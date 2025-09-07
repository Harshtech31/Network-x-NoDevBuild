import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock Data & Types
type FeedItem = {
  id: string;
  type: 'event' | 'project' | 'post';
  title?: string;
  user?: { name: string; handle: string; avatar: string };
  timestamp?: string;
  content?: string;
  media?: string | null;
  likes?: number;
  comments?: number;
  shares?: number;
  location?: string;
  date?: string;
  time?: string;
  tags?: string[];
  members?: string[];
};

const FEED_DATA: FeedItem[] = [
  { id: '1', type: 'event', title: 'AI Club Meetup', location: 'Innovation Hub', date: '2025-09-10', time: '18:00', media: 'https://source.unsplash.com/400x200/?ai,workshop', tags: ['AI', 'Workshop'] },
  { id: '2', type: 'project', title: 'Eco-Friendly Drone', user: { name: 'Alex Kumar', handle: '@alexk', avatar: 'https://i.pravatar.cc/150?u=alexk' }, content: 'Developing a drone from recycled materials. Looking for collaborators!', tags: ['Engineering', 'Sustainability'] },
  { id: '3', type: 'post', user: { name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://i.pravatar.cc/150?u=sarahc' }, timestamp: '2h ago', content: 'Just launched my new portfolio website! Built with React & Framer Motion. Feedback is welcome! 🚀 #webdev #uidesign', media: 'https://source.unsplash.com/400x200/?website,design', likes: 128, comments: 12, shares: 4 },
  { id: '4', type: 'project', title: 'Campus Connect App', user: { name: 'Maya Patel', handle: '@mayap', avatar: 'https://i.pravatar.cc/150?u=mayap' }, content: 'An app to connect students with similar interests. Beta testing soon!', tags: ['Mobile App', 'Social'] },
  { id: '5', type: 'event', title: 'Design Jam', location: 'Studio 2', date: '2025-09-12', time: '15:00', media: 'https://source.unsplash.com/400x200/?design,sprint', tags: ['Design'] },
  { id: '6', type: 'post', user: { name: 'Jordan Smith', handle: '@jordans', avatar: 'https://i.pravatar.cc/150?u=jordans' }, timestamp: '1d ago', content: 'Anyone else excited for the hackathon this weekend? 🔥', media: null, likes: 76, comments: 8, shares: 2 },
  { id: '7', type: 'project', title: 'Mental Health Chatbot', user: { name: 'Lisa Park', handle: '@lisap', avatar: 'https://i.pravatar.cc/150?u=lisap' }, content: 'Building a supportive chatbot for students. We need NLP experts!', tags: ['AI', 'Health', 'Python'] },
  { id: '8', type: 'event', title: 'Career Fair', location: 'Expo Center', date: '2025-09-15', time: '10:00', media: 'https://source.unsplash.com/400x200/?career,fair', tags: ['Career'] },
];

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const EventCard = ({ item }: { item: FeedItem }) => (
  <Card>
    {item.media && <Image source={{ uri: item.media }} style={styles.media} />}
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.metaText}>📍 {item.location}</Text>
      <Text style={styles.metaText}>🗓️ {item.date} • {item.time}</Text>
    </View>
  </Card>
);

const ProjectCard = ({ item }: { item: FeedItem }) => (
  <Card>
    <View style={styles.cardHeader}>
      <Image source={{ uri: item.user?.avatar }} style={styles.avatar} />
      <View style={styles.headerTextContainer}>
        <Text style={styles.userName}>{item.user?.name}</Text>
        <Text style={styles.userHandle}>{item.user?.handle}</Text>
      </View>
      <View style={[styles.chip, styles.projectBadge]}><Text style={styles.projectBadgeText}>Project</Text></View>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  </Card>
);

const PostCard = ({ item }: { item: FeedItem }) => (
  <Card>
    <View style={styles.cardHeader}>
      <Image source={{ uri: item.user?.avatar }} style={styles.avatar} />
      <View style={styles.headerTextContainer}>
        <Text style={styles.userName}>{item.user?.name}</Text>
        <Text style={styles.userHandle}>{item.user?.handle} • {item.timestamp}</Text>
      </View>
    </View>
    <View style={styles.cardBody}>
      <Text>{item.content}</Text>
    </View>
    {item.media && <Image source={{ uri: item.media }} style={styles.media} />}
    <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.actionButton}><Ionicons name="heart-outline" size={20} /><Text style={styles.actionText}>{item.likes}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}><Ionicons name="chatbubble-outline" size={20} /><Text style={styles.actionText}>{item.comments}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}><Ionicons name="arrow-redo-outline" size={20} /><Text style={styles.actionText}>{item.shares}</Text></TouchableOpacity>
    </View>
  </Card>
);

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = useMemo(() => {
    if (activeFilter === 'All') return FEED_DATA;
    return FEED_DATA.filter(item => item.type === activeFilter.toLowerCase().slice(0, -1));
  }, [activeFilter]);

  const renderItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case 'event': return <EventCard item={item} />;
      case 'project': return <ProjectCard item={item} />;
      case 'post': return <PostCard item={item} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>network</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#7f1d1d" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedList}
        ListHeaderComponent={() => (
          <View style={styles.filterContainer}>
            {['All', 'Posts', 'Projects', 'Events'].map(filter => (
              <TouchableOpacity 
                key={filter} 
                style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/messages')}>
        <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingTop: 60, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#7f1d1d' },
  feedList: { paddingHorizontal: 16, paddingBottom: 100 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#FFFFFF' },
  activeFilter: { backgroundColor: '#7f1d1d' },
  filterText: { color: '#7f1d1d', fontWeight: '600' },
  activeFilterText: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6, marginBottom: 20, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  headerTextContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  metaText: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  chip: { backgroundColor: '#FED7AA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipText: { color: '#9A3412', fontSize: 12, fontWeight: '500' },
  projectBadge: { backgroundColor: '#FEF2F2' },
  projectBadgeText: { color: '#B91C1C' },
  media: { width: '100%', height: 160 },
  cardBody: { padding: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingVertical: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6, color: '#374151' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userHandle: { fontSize: 14, color: '#6B7280' },
  fab: { position: 'absolute', bottom: 100, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#7f1d1d', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowRadius: 10, shadowOpacity: 0.2, elevation: 8 },
});