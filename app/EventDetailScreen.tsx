import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShareService } from '../utils/ShareService';

export default function EventDetailScreen() {
  const router = useRouter();
  const { id, title, date, location } = useLocalSearchParams<{
    id: string;
    title?: string;
    date?: string;
    location?: string;
  }>();

  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(156);

  // Mock event data
  const eventData = {
    id: id || '1',
    title: title || 'AI & Machine Learning Workshop',
    description: 'Join us for an intensive workshop covering the latest developments in artificial intelligence and machine learning. Perfect for students and professionals looking to enhance their skills.',
    date: date || 'March 15, 2024',
    time: '2:00 PM - 6:00 PM',
    location: location || 'Innovation Hub, Room 301',
    organizer: {
      name: 'Tech Society',
      avatar: 'https://i.pravatar.cc/150?u=techsociety',
      verified: true,
    },
    category: 'Technology',
    price: 'Free',
    requirements: [
      'Basic programming knowledge',
      'Laptop with Python installed',
      'Enthusiasm to learn!',
    ],
    agenda: [
      { time: '2:00 PM', topic: 'Introduction to AI/ML' },
      { time: '2:30 PM', topic: 'Hands-on Python Workshop' },
      { time: '4:00 PM', topic: 'Break & Networking' },
      { time: '4:30 PM', topic: 'Advanced ML Techniques' },
      { time: '5:30 PM', topic: 'Q&A Session' },
    ],
    tags: ['AI', 'Machine Learning', 'Python', 'Workshop'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
  };

  const handleRegister = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isRegistered) {
        setIsRegistered(false);
        setAttendeeCount(prev => prev - 1);
        Alert.alert('Unregistered', 'You have been unregistered from this event.');
      } else {
        setIsRegistered(true);
        setAttendeeCount(prev => prev + 1);
        Alert.alert('Success!', 'You have been registered for this event. Check your email for confirmation.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Removed from Bookmarks' : 'Bookmarked',
      isBookmarked ? 'Event removed from your bookmarks.' : 'Event saved to your bookmarks.'
    );
  };

  const handleShare = async () => {
    try {
      const shareSuccess = await ShareService.shareEvent({
        id: eventData.id,
        title: eventData.title,
        content: eventData.description,
        location: eventData.location,
        date: eventData.date,
        time: eventData.time,
        organizer: eventData.organizer
      });
      
      if (shareSuccess) {
        console.log('Event shared successfully');
      }
    } catch (error) {
      console.error('Error sharing event:', error);
      Alert.alert('Share Error', 'Unable to share this event.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: eventData.image }} style={styles.eventImage} />
          <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? "#7f1d1d" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>

        {/* Event Info */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle}>{eventData.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{eventData.category}</Text>
            </View>
          </View>

          <Text style={styles.eventDescription}>{eventData.description}</Text>

          {/* Event Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color="#7f1d1d" />
              <Text style={styles.detailText}>{eventData.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#7f1d1d" />
              <Text style={styles.detailText}>{eventData.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} color="#7f1d1d" />
              <Text style={styles.detailText}>{eventData.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={20} color="#7f1d1d" />
              <Text style={styles.detailText}>{eventData.price}</Text>
            </View>
          </View>

          {/* Organizer */}
          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.organizerInfo}>
              <Image source={{ uri: eventData.organizer.avatar }} style={styles.organizerAvatar} />
              <View style={styles.organizerDetails}>
                <View style={styles.organizerNameRow}>
                  <Text style={styles.organizerName}>{eventData.organizer.name}</Text>
                  {eventData.organizer.verified && (
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  )}
                </View>
                <Text style={styles.organizerRole}>Event Organizer</Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Attendees */}
          <View style={styles.attendeesSection}>
            <Text style={styles.sectionTitle}>Attendees ({attendeeCount})</Text>
            <Text style={styles.attendeesText}>Join {attendeeCount} others attending this event</Text>
          </View>

          {/* Agenda */}
          <View style={styles.agendaSection}>
            <Text style={styles.sectionTitle}>Agenda</Text>
            {eventData.agenda.map((item, index) => (
              <View key={index} style={styles.agendaItem}>
                <Text style={styles.agendaTime}>{item.time}</Text>
                <Text style={styles.agendaTopic}>{item.topic}</Text>
              </View>
            ))}
          </View>

          {/* Requirements */}
          <View style={styles.requirementsSection}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {eventData.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {eventData.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Register Button */}
      <View style={styles.registerSection}>
        <TouchableOpacity 
          onPress={handleRegister} 
          style={[styles.registerButton, isRegistered && styles.unregisterButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <LinearGradient
              colors={isRegistered ? ['#DC2626', '#B91C1C'] : ['#7f1d1d', '#DC2626']}
              style={styles.registerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons 
                name={isRegistered ? "checkmark-circle" : "calendar"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.registerButtonText}>
                {isRegistered ? 'Registered' : 'Register Now'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#991B1B',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  eventDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    fontWeight: '500',
  },
  organizerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  organizerDetails: {
    flex: 1,
  },
  organizerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  organizerRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  attendeesSection: {
    marginBottom: 24,
  },
  attendeesText: {
    fontSize: 14,
    color: '#6B7280',
  },
  agendaSection: {
    marginBottom: 24,
  },
  agendaItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  agendaTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    width: 80,
  },
  agendaTopic: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  requirementsSection: {
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#991B1B',
  },
  registerSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  registerButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  unregisterButton: {
    opacity: 0.8,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
