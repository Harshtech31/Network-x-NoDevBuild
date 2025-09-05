import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

// Type definition for an event
type Event = {
  id: string;
  title: string;
  organizer: string;
  category: string;
  image: string;
  featured: boolean;
};

// Mock data for events
const EVENTS_DATA: Event[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Workshop',
    organizer: 'Tech Society',
    category: 'Technology',
    image: 'https://via.placeholder.com/300x150?text=AI+Workshop',
    featured: true,
  },
  {
    id: '2',
    title: 'Startup Pitch Night',
    organizer: 'Business Club',
    category: 'Business',
    image: 'https://via.placeholder.com/300x150?text=Pitch+Night',
    featured: true,
  },
  {
    id: '3',
    title: 'Varsity Soccer Match',
    organizer: 'Athletics Department',
    category: 'Sports',
    image: 'https://via.placeholder.com/300x150?text=Soccer+Match',
    featured: false,
  },
  {
    id: '4',
    title: 'Digital Art Exhibition',
    organizer: 'Arts Council',
    category: 'Arts',
    image: 'https://via.placeholder.com/300x150?text=Art+Exhibition',
    featured: false,
  },
];

// Grid View Card
const EventCard = ({ item }: { item: Event }) => (
  <View style={styles.eventCard}>
    <Image source={{ uri: item.image }} style={styles.eventImage} />
    {item.featured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>Featured</Text></View>}
    <View style={styles.eventContent}>
      <Text style={styles.eventCategory}>{item.category}</Text>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventOrganizer}>{item.organizer}</Text>
      <View style={styles.eventActions}>
        <TouchableOpacity><Ionicons name="heart-outline" size={24} color="#6B7280" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="share-social-outline" size={24} color="#6B7280" /></TouchableOpacity>
      </View>
    </View>
  </View>
);

// List View Item
const EventListItem = ({ item }: { item: Event }) => (
  <TouchableOpacity style={styles.listItem}>
    <Image source={{ uri: item.image }} style={styles.listImage} />
    <View style={styles.listContent}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventOrganizer}>{item.organizer}</Text>
      <Text style={styles.eventCategory}>{item.category}</Text>
    </View>
    <View style={styles.listActions}>
        <TouchableOpacity><Ionicons name="heart-outline" size={24} color="#6B7280" /></TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function CalendarScreen() {
  const [viewMode, setViewMode] = useState('Grid');

    const renderContent = () => {
    if (viewMode === 'Grid') {
      return (
        <FlatList
          key="grid" // Unique key for grid mode
          data={EVENTS_DATA}
          renderItem={({ item }) => <EventCard item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    if (viewMode === 'List') {
      return (
        <FlatList
          key="list" // Unique key for list mode
          data={EVENTS_DATA}
          renderItem={({ item }) => <EventListItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    // Placeholder for Calendar view
    return <View style={styles.placeholderView}><Text>Calendar view coming soon!</Text></View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Events</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#111111" />
          <View style={styles.notificationBadge}><Text style={styles.notificationCount}>3</Text></View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchAndFilters}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput placeholder="Search events, clubs, or tags..." style={styles.searchInput} />
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.categoryDropdown}><Text style={styles.categoryText}>Category: All</Text><Ionicons name="chevron-down" size={16} color="#FFFFFF" /></TouchableOpacity>
          <View style={styles.viewToggle}>
            {['Grid', 'List', 'Calendar'].map(mode => (
              <TouchableOpacity key={mode} style={[styles.toggleButton, viewMode === mode && styles.activeToggleButton]} onPress={() => setViewMode(mode)}>
                <Text style={[styles.toggleText, viewMode === mode && styles.activeToggleButton]}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Featured Events</Text>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111111' },
  notificationButton: { position: 'relative' },
  notificationBadge: { position: 'absolute', right: -5, top: -5, backgroundColor: '#8B1A1A', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  notificationCount: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  searchAndFilters: { paddingHorizontal: 16, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B1A1A', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  categoryText: { color: '#FFFFFF', fontWeight: '600', marginRight: 8 },
  viewToggle: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 20 },
  toggleButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  activeToggleButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  toggleText: { fontWeight: '600', color: '#6B7280' },
  activeToggleText: { color: '#8B1A1A' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 12 },
  gridContainer: { paddingHorizontal: 12, paddingBottom: 100 },
  eventCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, margin: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  eventImage: { width: '100%', height: 100, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  featuredBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(139, 26, 26, 0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  featuredText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  eventContent: { padding: 12 },
  eventCategory: { fontSize: 12, color: '#8B1A1A', fontWeight: '600', marginBottom: 4 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#111111', marginBottom: 4 },
  eventOrganizer: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  eventActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  placeholderView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  listItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  listImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  listContent: { flex: 1 },
  listActions: { marginLeft: 12 },
});