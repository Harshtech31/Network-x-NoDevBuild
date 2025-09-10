import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

// Data & Types
type Event = {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  shortDesc: string;
  bannerUrl: string;
  tags: string[];
};

const sampleEvents: Event[] = [
  { id: 1, title: 'AI Club Meetup', type: 'Event', date: '2025-09-10', time: '18:00', location: 'Innovation Hub', shortDesc: 'Build your first agent; pizza included.', bannerUrl: 'https://source.unsplash.com/400x200/?ai,workshop', tags: ['AI', 'Workshop'] },
  { id: 2, title: 'Design Jam', type: 'Event', date: '2025-09-10', time: '15:00', location: 'Studio 2', shortDesc: 'Rapid prototyping sprint.', bannerUrl: 'https://source.unsplash.com/400x200/?design,sprint', tags: ['Design'] },
  { id: 3, title: 'Robotics Demo Day', type: 'Event', date: '2025-09-12', time: '11:00', location: 'Main Hall', shortDesc: 'Showcase bots & sensors.', bannerUrl: 'https://source.unsplash.com/400x200/?robotics', tags: ['Robotics', 'Demo'] },
  { id: 4, title: 'Career Fair', type: 'Event', date: '2025-09-15', time: '10:00', location: 'Expo Center', shortDesc: 'Meet recruiters, polish resumes.', bannerUrl: 'https://source.unsplash.com/400x200/?career,fair', tags: ['Career'] },
];

const EventCard = ({ item, isListView }: { item: Event, isListView?: boolean }) => (
  <View style={[styles.card, isListView && styles.cardListView]}>
    <Image source={{ uri: item.bannerUrl }} style={[styles.cardMedia, isListView && styles.cardMediaListView]} />
    <View style={styles.cardContent}>
      <View style={styles.chip}><Text style={styles.chipText}>{item.type}</Text></View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.metaText}>📍 {item.location}</Text>
      <Text style={styles.metaText}>{item.date} • {item.time}</Text>
    </View>
  </View>
);

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [viewMode, setViewMode] = useState('Grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [events, setEvents] = useState(sampleEvents);

  // Simulate initial data loading
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(sampleEvents);
      } catch (error) {
        Alert.alert('Error', 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setEvents(sampleEvents);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh events');
    } finally {
      setIsRefreshing(false);
    }
  };

  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};
    sampleEvents.forEach(event => {
      marks[event.date] = { marked: true, dotColor: '#991B1B' };
    });
    marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: '#991B1B', selectedTextColor: '#FFFFFF', activeOpacity: 0.8 };
    return marks;
  }, [selectedDate]);

  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return events;
    const q = searchQuery.trim().toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(q) || event.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [searchQuery, events]);

  const eventsOnSelectedDate = useMemo(() => 
    filteredBySearch.filter(event => event.date === selectedDate)
  , [filteredBySearch, selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}><Text style={styles.headerTitle}>Events & Calendar</Text></View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7f1d1d" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput 
                    placeholder="Search events or tags..." 
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              <Calendar
                onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  calendarBackground: '#FFFFFF',
                  arrowColor: '#991B1B',
                  todayTextColor: '#991B1B',
                  textSectionTitleColor: '#991B1B',
                  selectedDayBackgroundColor: '#991B1B',
                  selectedDayTextColor: '#FFFFFF',
                }}
              />

              <View style={styles.dayEventsPanel}>
              <Text style={styles.panelTitle}>Events on {selectedDate}</Text>
              {eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map(event => <EventCard key={event.id} item={event} isListView={true} />)
              ) : (
                <View style={styles.emptyStateContainer}><Text style={styles.emptyStateText}>No events for this date.</Text></View>
              )}
            </View>

            <View style={styles.listHeaderContainer}>
              <Text style={styles.panelTitle}>All Events</Text>
              <View style={styles.viewToggle}>
                <TouchableOpacity onPress={() => setViewMode('Grid')} style={[styles.toggleButton, viewMode === 'Grid' && styles.toggleButtonActive]}><Ionicons name="grid" size={20} color={viewMode === 'Grid' ? '#991B1B' : '#6B7280'} /></TouchableOpacity>
                <TouchableOpacity onPress={() => setViewMode('List')} style={[styles.toggleButton, viewMode === 'List' && styles.toggleButtonActive]}><Ionicons name="list" size={20} color={viewMode === 'List' ? '#991B1B' : '#6B7280'} /></TouchableOpacity>
              </View>
            </View>
          </>
        }
        data={filteredBySearch}
        key={viewMode}
        numColumns={viewMode === 'Grid' ? 2 : 1}
        renderItem={({ item }) => <EventCard item={item} isListView={viewMode === 'List'} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.eventsCollection}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#7f1d1d']}
            tintColor="#7f1d1d"
          />
        }
      />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF2F2' },
  header: { height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  searchBarContainer: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  dayEventsPanel: { padding: 16 },
  panelTitle: { fontSize: 20, fontWeight: 'bold' },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
  listHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  viewToggle: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12 },
  toggleButton: { padding: 8, borderRadius: 10 },
  toggleButtonActive: { backgroundColor: '#FFFFFF' },
  eventsCollection: { paddingHorizontal: 12 },
  card: { flex: 1, margin: 6, backgroundColor: '#FFFFFF', borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, overflow: 'hidden' },
  cardListView: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 4, marginBottom: 8 },
  cardMedia: { width: '100%', aspectRatio: 16 / 9 },
  cardMediaListView: { width: 80, height: 80, aspectRatio: 1, borderRadius: 12 },
  cardContent: { flex: 1, padding: 12 },
  chip: { alignSelf: 'flex-start', backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 6 },
  chipText: { color: '#991B1B', fontSize: 12, fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  metaText: { color: '#6B7280', fontSize: 12, marginBottom: 2 },
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
});