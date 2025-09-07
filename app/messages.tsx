import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock Data
const MESSAGES_DATA = [
  { 
    id: '1', 
    name: 'Sarah Chen', 
    message: 'Sounds good! See you then. 🎉', 
    time: '10m', 
    unread: 2, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=sarahchen',
    type: 'personal',
    members: []
  },
  { 
    id: '2', 
    name: 'AI Club Group', 
    message: 'Alex: Can anyone help with the ML project?', 
    time: '2h', 
    unread: 3, 
    online: false, 
    avatar: 'https://i.pravatar.cc/150?u=aiclub',
    type: 'group',
    members: ['Alex Kumar', 'Maya Patel', 'Jordan Smith', 'You']
  },
  { 
    id: '3', 
    name: 'David Lee', 
    message: 'Just pushed the latest commit.', 
    time: 'Yesterday', 
    unread: 0, 
    online: false, 
    avatar: 'https://i.pravatar.cc/150?u=davidlee',
    type: 'personal',
    members: []
  },
  { 
    id: '4', 
    name: 'Hackathon Squad', 
    message: 'You: Let\'s meet at the library.', 
    time: 'Yesterday', 
    unread: 0, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=hackathon',
    type: 'group',
    members: ['Emma Wilson', 'Ryan Chen', 'Zoe Martinez', 'You']
  },
  { 
    id: '5', 
    name: 'Study Buddies', 
    message: 'Lisa: Anyone free for coffee study session?', 
    time: '3h', 
    unread: 1, 
    online: true, 
    avatar: 'https://i.pravatar.cc/150?u=studybuddies',
    type: 'group',
    members: ['Lisa Park', 'Tom Anderson', 'Nina Rodriguez', 'You']
  },
];

const STATUS_DATA = [
  { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?u=me' },
  { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarahchen' },
  { id: '3', name: 'David', avatar: 'https://i.pravatar.cc/150?u=davidlee' },
  // ... more statuses
];

const ChatListItem = ({ item }: { item: (typeof MESSAGES_DATA)[0] }) => {
  const router = useRouter();

  return (
  <TouchableOpacity style={styles.chatItem} onPress={() => router.push((`/chat/${item.id}` as any))}>
    <View style={styles.avatarContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      {item.type === 'group' && (
        <View style={styles.groupIndicator}>
          <Ionicons name="people" size={12} color="#FFFFFF" />
        </View>
      )}
      {item.online && <View style={styles.onlineIndicator} />}
    </View>
    <View style={styles.chatContent}>
      <View style={styles.nameRow}>
        <Text style={styles.chatName}>{item.name}</Text>
        {item.type === 'group' && <Text style={styles.memberCount}>{item.members.length} members</Text>}
      </View>
      <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
    </View>
    <View style={styles.chatMeta}>
      <Text style={styles.chatTime}>{item.time}</Text>
      {item.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadCount}>{item.unread}</Text></View>}
    </View>
  </TouchableOpacity>
)};

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7f1d1d" />
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput placeholder="Search chats..." style={styles.searchInput} />
        </View>
      </View>

      <FlatList
        data={MESSAGES_DATA}
        renderItem={({ item }) => <ChatListItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2' },
  headerBar: { backgroundColor: '#7f1d1d', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 40 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  searchContainer: { backgroundColor: '#fef2f2', paddingHorizontal: 16, paddingVertical: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  statusList: { paddingHorizontal: 16, marginBottom: 8 },
  statusItem: { alignItems: 'center', marginRight: 16 },
  statusAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#7f1d1d' },
  statusName: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  chatList: { paddingBottom: 100 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF', marginHorizontal: 8, marginVertical: 4, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  groupIndicator: { position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#7f1d1d', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFFFFF' },
  chatContent: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  memberCount: { fontSize: 12, color: '#6B7280', marginLeft: 8, backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  chatMessage: { fontSize: 14, color: '#6B7280' },
  chatMeta: { alignItems: 'flex-end' },
  chatTime: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  unreadBadge: { backgroundColor: '#7f1d1d', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  unreadCount: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
});
