import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ClubDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock club data - in real app this would come from API based on params.id
  const club = {
    id: Array.isArray(params.id) ? params.id[0] : params.id || '1',
    name: Array.isArray(params.name) ? params.name[0] : params.name || 'Tech Innovators Club',
    category: Array.isArray(params.category) ? params.category[0] : params.category || 'Technology',
    description: 'A community of passionate technologists exploring cutting-edge innovations, sharing knowledge, and building the future together.',
    longDescription: 'Tech Innovators Club is a vibrant community where technology enthusiasts, developers, designers, and entrepreneurs come together to explore the latest trends in tech. We organize workshops, hackathons, networking events, and guest speaker sessions featuring industry leaders.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop',
    members: 1247,
    posts: 89,
    events: 24,
    founded: 'January 2022',
    location: 'San Francisco, CA',
    website: 'www.techinnovators.club',
    admins: [
      { name: 'David Kim', role: 'Founder & President', avatar: 'https://ui-avatars.com/api/?name=David+Kim&size=40&background=8B1A1A&color=fff' },
      { name: 'Emma Wilson', role: 'Vice President', avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&size=40&background=059669&color=fff' },
    ],
    upcomingEvents: [
      {
        title: 'AI & Machine Learning Workshop',
        date: 'March 15, 2024',
        time: '2:00 PM - 5:00 PM',
        location: 'Tech Hub, Downtown',
        attendees: 45
      },
      {
        title: 'Startup Pitch Night',
        date: 'March 22, 2024',
        time: '6:00 PM - 9:00 PM',
        location: 'Innovation Center',
        attendees: 78
      },
      {
        title: 'Blockchain Fundamentals',
        date: 'March 29, 2024',
        time: '1:00 PM - 4:00 PM',
        location: 'Virtual Event',
        attendees: 120
      }
    ],
    recentPosts: [
      {
        author: 'David Kim',
        time: '2 hours ago',
        content: 'Excited to announce our upcoming AI workshop! We have some amazing speakers lined up.',
        likes: 24,
        comments: 8
      },
      {
        author: 'Emma Wilson',
        time: '1 day ago',
        content: 'Great turnout at yesterday\'s networking event! Thanks to everyone who joined us.',
        likes: 31,
        comments: 12
      },
      {
        author: 'Tech Innovators Club',
        time: '3 days ago',
        content: 'Check out the highlights from our recent hackathon. Amazing projects from our community!',
        likes: 67,
        comments: 23
      }
    ],
    rules: [
      'Be respectful and professional in all interactions',
      'No spam or self-promotion without permission',
      'Share knowledge and help fellow members',
      'Attend events when you RSVP',
      'Follow community guidelines and code of conduct'
    ]
  };

  const renderAbout = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{club.longDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Founded:</Text>
          <Text style={styles.infoValue}>{club.founded}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>{club.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="globe-outline" size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Website:</Text>
          <Text style={[styles.infoValue, styles.linkText]}>{club.website}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club Admins</Text>
        {club.admins.map((admin, index) => (
          <View key={index} style={styles.adminCard}>
            <Image source={{ uri: admin.avatar }} style={styles.adminAvatar} />
            <View style={styles.adminInfo}>
              <Text style={styles.adminName}>{admin.name}</Text>
              <Text style={styles.adminRole}>{admin.role}</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#8B1A1A" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Rules</Text>
        {club.rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <Text style={styles.ruleNumber}>{index + 1}.</Text>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEvents = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {club.upcomingEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.attendeeBadge}>
                <Ionicons name="people" size={12} color="#6B7280" />
                <Text style={styles.attendeeCount}>{event.attendees}</Text>
              </View>
            </View>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetail}>
                <Ionicons name="calendar" size={14} color="#8B1A1A" />
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Ionicons name="time" size={14} color="#8B1A1A" />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Ionicons name="location" size={14} color="#8B1A1A" />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.rsvpButton}>
              <Text style={styles.rsvpButtonText}>RSVP</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPosts = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        {club.recentPosts.map((post, index) => (
          <View key={index} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="heart-outline" size={16} color="#6B7280" />
                <Text style={styles.postActionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                <Text style={styles.postActionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="share-outline" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Club Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Club Header */}
      <View style={styles.clubHeader}>
        <Image source={{ uri: club.image }} style={styles.clubImage} />
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.clubCategory}>{club.category}</Text>
          <Text style={styles.clubDescription}>{club.description}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{club.members.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{club.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{club.events}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Ionicons 
                name={isFollowing ? "checkmark" : "add"} 
                size={18} 
                color={isFollowing ? "#8B1A1A" : "#FFFFFF"} 
              />
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="people" size={18} color="#FFFFFF" />
              <Text style={styles.joinButtonText}>Join Club</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['about', 'events', 'posts'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'about' && renderAbout()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'posts' && renderPosts()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubHeader: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  clubImage: {
    width: '100%',
    height: 200,
  },
  clubInfo: {
    padding: 20,
  },
  clubName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  clubCategory: {
    fontSize: 14,
    color: '#8B1A1A',
    fontWeight: '600',
    marginBottom: 8,
  },
  clubDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#8B1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  followingButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#8B1A1A',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#8B1A1A',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8B1A1A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#8B1A1A',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  linkText: {
    color: '#8B1A1A',
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  adminRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  messageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ruleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B1A1A',
    marginRight: 8,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  eventCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  attendeeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  attendeeCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#374151',
  },
  rsvpButton: {
    backgroundColor: '#8B1A1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  rsvpButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postActionText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
