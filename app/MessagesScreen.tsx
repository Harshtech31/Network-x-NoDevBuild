import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Animated,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';

// Mock Data
const MESSAGES_DATA = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    message: 'Hey! Are you free for the project meeting tomorrow?', 
    time: '2m', 
    unread: 2, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=alex',
    type: 'personal'
  },
  { 
    id: '2', 
    name: 'Study Group', 
    message: 'Emma: Don\'t forget about the exam next week!', 
    time: '15m', 
    unread: 0, 
    online: false, 
    avatar: 'https://i.pravatar.cc/150?u=studygroup',
    type: 'group'
  },
  { 
    id: '3', 
    name: 'Sarah Wilson', 
    message: 'Thanks for helping me with the assignment 😊', 
    time: '1h', 
    unread: 0, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    type: 'personal'
  },
  { 
    id: '4', 
    name: 'Tech Club', 
    message: 'You: Looking forward to the hackathon!', 
    time: '3h', 
    unread: 1, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=techclub',
    type: 'group'
  },
  { 
    id: '5', 
    name: 'Mike Chen', 
    message: 'Can you send me the presentation slides?', 
    time: 'Yesterday', 
    unread: 0, 
    online: false, 
    avatar: 'https://i.pravatar.cc/150?u=mike',
    type: 'personal'
  },
  { 
    id: '6', 
    name: 'Lisa Park', 
    message: 'Great job on the demo today! 🎉', 
    time: 'Yesterday', 
    unread: 0, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=lisa',
    type: 'personal'
  },
  { 
    id: '7', 
    name: 'Project Team', 
    message: 'David: Meeting rescheduled to 3 PM', 
    time: '2 days ago', 
    unread: 0, 
    online: false, 
    avatar: 'https://i.pravatar.cc/150?u=projectteam',
    type: 'group'
  },
  { 
    id: '8', 
    name: 'Jordan Smith', 
    message: 'You: Sure, I\'ll be there by 5 PM', 
    time: '3 days ago', 
    unread: 0, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=jordan',
    type: 'personal'
  }
];

const FILTER_TABS = ['All', 'Unread', 'Groups'];

const ChatListItem = ({ item }: { item: (typeof MESSAGES_DATA)[0] }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.listItem} onPress={() => router.push(`/chat/${item.id}` as any)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
        {item.type === 'group' && (
          <View style={styles.groupIndicator}>
            <Ionicons name="people" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.messageText,
              item.unread > 0 && styles.unreadMessageText
            ]} 
            numberOfLines={2}
          >
            {item.message}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messages, setMessages] = useState(MESSAGES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(MESSAGES_DATA);

  // Simulate initial data loading
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        setMessages(MESSAGES_DATA);
      } catch (error) {
        Alert.alert('Error', 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = messages.filter(message => 
      message.name.toLowerCase().includes(query.toLowerCase()) ||
      message.message.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredMessages(filtered);
  };

  // Handle filter functionality
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    let filtered = messages;
    
    // Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    switch (filter) {
      case 'Unread':
        filtered = filtered.filter(message => message.unread > 0);
        break;
      case 'Groups':
        filtered = filtered.filter(message => message.type === 'group');
        break;
      case 'All':
      default:
        // Already filtered by search if applicable
        break;
    }
    
    setFilteredMessages(filtered);
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(MESSAGES_DATA);
      // Reapply current filters
      handleFilterChange(activeFilter);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh messages');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update filtered messages when messages change
  useEffect(() => {
    handleFilterChange(activeFilter);
  }, [messages]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fef2f2" translucent={true} />
      
      {/* Header with Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="close" size={24} color="#991B1B" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#991B1B" />
          <TextInput 
            placeholder="Search conversations..." 
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filter Tabs with Unique Design */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTER_TABS.map((filter, index) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.activeFilterTab,
                index === 0 && styles.firstTab
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <View style={[
                styles.filterDot,
                activeFilter === filter && styles.activeFilterDot
              ]} />
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7f1d1d" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={({ item }) => <ChatListItem item={item} />}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#991B1B']}
              tintColor="#991B1B"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No messages found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? `No results for "${searchQuery}"` : `No ${activeFilter.toLowerCase()} messages`}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Main Container
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    paddingTop: 0 
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fef2f2'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#991B1B',
    letterSpacing: -0.5
  },
  closeBtn: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  
  // Search Bar Styles
  searchContainer: { 
    paddingHorizontal: 20, 
    paddingBottom: 16, 
    backgroundColor: '#fef2f2'
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 44, 
    shadowColor: '#991B1B', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: 'rgba(153, 27, 27, 0.08)' 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16, 
    color: '#111827' 
  },
  
  // Filter Tabs with Unique Design
  filterContainer: { 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  filterScroll: { 
    paddingHorizontal: 20 
  },
  filterTab: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    marginRight: 8, 
    borderRadius: 18, 
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  firstTab: {
    marginLeft: 0
  },
  activeFilterTab: { 
    backgroundColor: '#991B1B',
    borderColor: '#991B1B',
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginRight: 8
  },
  activeFilterDot: {
    backgroundColor: '#FFFFFF'
  },
  filterText: { 
    fontSize: 13, 
    fontWeight: '500', 
    color: '#6B7280' 
  },
  activeFilterText: { 
    color: '#FFFFFF' 
  },
  
  // Messages List
  messagesList: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68
  },
  
  // List Item Styles - Flat Design
  listItem: { 
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16, 
    paddingVertical: 12,
    backgroundColor: '#FFFFFF'
  },
  avatarContainer: { 
    position: 'relative', 
    marginRight: 12 
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24,
    backgroundColor: '#E5E7EB'
  },
  onlineIndicator: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#10B981', 
    borderWidth: 2, 
    borderColor: '#FFFFFF' 
  },
  groupIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  
  // Message Content
  messageContent: { 
    flex: 1, 
    paddingTop: 2 
  },
  messageHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 4 
  },
  senderName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#111827',
    flex: 1,
    marginRight: 8
  },
  messageTime: { 
    fontSize: 12, 
    color: '#6B7280',
    fontWeight: '400'
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  messageText: { 
    fontSize: 14, 
    color: '#6B7280', 
    lineHeight: 20,
    flex: 1,
    marginRight: 8
  },
  unreadMessageText: {
    fontWeight: '500',
    color: '#374151'
  },
  
  // Unread Badge
  unreadBadge: { 
    backgroundColor: '#8B1A1A', 
    borderRadius: 10, 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    minWidth: 20, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  unreadCount: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
