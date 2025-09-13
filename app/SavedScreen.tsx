import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mock saved posts data - in real app, this would come from storage/API
const MOCK_SAVED_POSTS = [
  {
    id: '3',
    type: 'post',
    user: { name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://i.pravatar.cc/150?u=sarahc', verified: true, role: 'UX Designer' },
    timestamp: '2h ago',
    content: 'Successfully launched my professional portfolio website built with React and Framer Motion. The journey from concept to deployment taught me so much about modern web development. Professional feedback is welcome! #webdev #uidesign #portfolio',
    media: 'https://source.unsplash.com/400x300/?website,portfolio',
    likes: 342,
    comments: 28,
    shares: 15,
    savedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'project',
    title: 'Sustainable Engineering Initiative',
    user: { name: 'Alex Kumar', handle: '@alexk', avatar: 'https://i.pravatar.cc/150?u=alexk', verified: true, role: 'Senior Engineer' },
    content: 'Developing sustainable drone technology from recycled materials. Seeking qualified collaborators with expertise in materials science and aerodynamics. This project aims to revolutionize eco-friendly transportation.',
    tags: ['Engineering', 'Sustainability', 'Innovation'],
    likes: 234,
    comments: 18,
    shares: 12,
    priority: 'high',
    savedAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '1',
    type: 'event',
    title: 'AI Technology Conference 2025',
    location: 'Innovation Hub, Silicon Valley',
    date: '2025-09-10',
    time: '18:00',
    media: 'https://source.unsplash.com/400x300/?ai,conference',
    tags: ['AI', 'Technology', 'Networking'],
    priority: 'high',
    category: 'Technology',
    savedAt: '2024-01-13T09:20:00Z'
  }
];

export default function SavedScreen() {
  const [savedPosts, setSavedPosts] = useState(MOCK_SAVED_POSTS);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Posts', 'Projects', 'Events'];

  const filteredPosts = savedPosts.filter(post => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Posts') return post.type === 'post';
    if (selectedFilter === 'Projects') return post.type === 'project';
    if (selectedFilter === 'Events') return post.type === 'event';
    return true;
  });

  const handleUnsave = (postId: string) => {
    Alert.alert(
      'Remove from Saved',
      'Are you sure you want to remove this item from your saved posts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSavedPosts(prev => prev.filter(post => post.id !== postId));
          }
        }
      ]
    );
  };

  const renderSavedItem = (item: any) => {
    const savedDate = new Date(item.savedAt).toLocaleDateString();

    if (item.type === 'post') {
      return (
        <View key={item.id} style={styles.savedPostCard}>
          <View style={styles.savedPostHeader}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{item.user.name}</Text>
                  {item.user.verified && (
                    <Ionicons name="checkmark-circle" size={16} color="#7f1d1d" />
                  )}
                </View>
                <Text style={styles.userRole}>{item.user.role}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.unsaveButton}
              onPress={() => handleUnsave(item.id)}
            >
              <Ionicons name="bookmark" size={20} color="#ea580c" />
            </TouchableOpacity>
          </View>
          <Text style={styles.postContent}>{item.content}</Text>
          {item.media && (
            <Image source={{ uri: item.media }} style={styles.postImage} />
          )}
          <View style={styles.savedInfo}>
            <Text style={styles.savedDate}>Saved on {savedDate}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'project') {
      return (
        <View key={item.id} style={styles.savedProjectCard}>
          <View style={styles.savedProjectHeader}>
            <View style={styles.projectIconBox}>
              <Ionicons name="code-working" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.projectInfo}>
              <Text style={styles.projectTitle}>{item.title}</Text>
              <Text style={styles.projectAuthor}>by {item.user.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.unsaveButton}
              onPress={() => handleUnsave(item.id)}
            >
              <Ionicons name="bookmark" size={20} color="#ea580c" />
            </TouchableOpacity>
          </View>
          <Text style={styles.projectDescription}>{item.content}</Text>
          <View style={styles.projectTags}>
            {item.tags?.map((tag: string, index: number) => (
              <View key={index} style={styles.projectTag}>
                <Text style={styles.projectTagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.savedInfo}>
            <Text style={styles.savedDate}>Saved on {savedDate}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'event') {
      const eventDate = new Date(item.date);
      const day = eventDate.getDate();
      const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

      return (
        <View key={item.id} style={styles.savedEventCard}>
          <View style={styles.savedEventHeader}>
            <View style={styles.eventDateBox}>
              <Text style={styles.eventDay}>{day}</Text>
              <Text style={styles.eventMonth}>{month}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={14} color="#7f1d1d" />
                  <Text style={styles.eventDetailText}>{item.location}</Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="time-outline" size={14} color="#ea580c" />
                  <Text style={styles.eventDetailText}>{item.time}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.unsaveButton}
              onPress={() => handleUnsave(item.id)}
            >
              <Ionicons name="bookmark" size={20} color="#ea580c" />
            </TouchableOpacity>
          </View>
          {item.media && (
            <Image source={{ uri: item.media }} style={styles.eventImage} />
          )}
          <View style={styles.savedInfo}>
            <Text style={styles.savedDate}>Saved on {savedDate}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Saved Posts List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(renderSavedItem)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No saved {selectedFilter.toLowerCase()}</Text>
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'All' 
                ? 'Start saving posts, projects, and events to see them here'
                : `You haven't saved any ${selectedFilter.toLowerCase()} yet`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 46,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#991B1B',
    borderColor: '#7f1d1d',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  
  // Saved Post Card
  savedPostCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  savedPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  unsaveButton: {
    padding: 8,
  },
  postContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  
  // Saved Project Card
  savedProjectCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  savedProjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIconBox: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  projectAuthor: {
    fontSize: 14,
    color: '#6B7280',
  },
  projectDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  projectTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  projectTagText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Saved Event Card
  savedEventCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  savedEventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventDateBox: {
    backgroundColor: '#991B1B',
    borderRadius: 12,
    width: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventDay: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  eventInfo: {
    flex: 1,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  
  // Common styles
  savedInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  savedDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
