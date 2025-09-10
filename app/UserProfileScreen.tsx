import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShareService } from '../utils/ShareService';

const { width } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  university: string;
  major: string;
  year: string;
  followers: number;
  following: number;
  projects: number;
  clubs: number;
  skills: string[];
  achievements: Array<{
    title: string;
    subtitle: string;
    icon: string;
  }>;
}

// Mock user data - in real app this would come from API
const mockUser: User = {
  id: 'user123',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  bio: 'Computer Science student passionate about AI and machine learning. Always excited to collaborate on innovative projects!',
  location: 'Dubai, UAE',
  university: 'American University of Dubai',
  major: 'Computer Science',
  year: 'Junior',
  followers: 234,
  following: 189,
  projects: 12,
  clubs: 5,
  skills: ['Python', 'React', 'Machine Learning', 'Data Science', 'JavaScript', 'Node.js'],
  achievements: [
    { title: "Dean's List", subtitle: "Fall 2023 Semester", icon: "trophy" },
    { title: "Hackathon Winner", subtitle: "AI Challenge 2024", icon: "medal" },
    { title: "Research Assistant", subtitle: "ML Lab", icon: "book" },
    { title: "Club Vice President", subtitle: "CS Society", icon: "ribbon" },
  ],
};

export default function UserProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [user] = useState<User>(mockUser); // In real app, fetch based on params.userId

  const handleMessage = () => {
    Alert.alert(
      "Send Message",
      `Start a conversation with ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send", onPress: () => {
          // Navigate to chat screen
          Alert.alert("Success", "Message sent!");
        }}
      ]
    );
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? "Unfollowed" : "Following",
      isFollowing 
        ? `You are no longer following ${user.name}` 
        : `You are now following ${user.name}`
    );
  };

  const handleShare = async () => {
    try {
      const shareSuccess = await ShareService.shareProfile({
        id: user.id,
        name: user.name,
        bio: user.bio,
        university: user.university,
        major: user.major
      });
      
      if (shareSuccess) {
        console.log('Profile shared successfully');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      Alert.alert('Share Error', 'Unable to share this profile.');
    }
  };

  const navigateToFollowers = () => {
    router.push({
      pathname: '/FollowersScreen',
      params: {
        type: 'followers',
        userName: user.name,
        count: user.followers
      }
    });
  };

  const navigateToFollowing = () => {
    router.push({
      pathname: '/FollowersScreen',
      params: {
        type: 'following',
        userName: user.name,
        count: user.following
      }
    });
  };

  const renderHeader = () => (
    <View style={styles.modernHeader}>
      <TouchableOpacity 
        style={styles.modernBackButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#991B1B" />
      </TouchableOpacity>
      <Text style={styles.modernHeaderTitle}>Profile</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerActionBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color="#991B1B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerActionBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#991B1B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={styles.modernProfileSection}>
      <View style={styles.modernAvatarContainer}>
        <View style={styles.avatarGlow}>
          <Image source={{ uri: user.avatar }} style={styles.modernAvatar} />
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
      </View>
      
      <Text style={styles.modernUserName}>{user.name}</Text>
      <Text style={styles.modernUserBio}>{user.bio}</Text>
      
      <View style={styles.modernInfoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={16} color="#991B1B" />
          <Text style={styles.infoText}>{user.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="school" size={16} color="#991B1B" />
          <Text style={styles.infoText}>{user.major} • {user.year}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="business" size={16} color="#991B1B" />
          <Text style={styles.infoText}>{user.university}</Text>
        </View>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.modernStatsContainer}>
      <TouchableOpacity style={styles.modernStatItem} onPress={navigateToFollowers}>
        <Text style={styles.modernStatNumber}>{user.followers}</Text>
        <Text style={styles.modernStatLabel}>Followers</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modernStatItem} onPress={navigateToFollowing}>
        <Text style={styles.modernStatNumber}>{user.following}</Text>
        <Text style={styles.modernStatLabel}>Following</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modernStatItem}>
        <Text style={styles.modernStatNumber}>{user.projects}</Text>
        <Text style={styles.modernStatLabel}>Projects</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modernStatItem}>
        <Text style={styles.modernStatNumber}>{user.clubs}</Text>
        <Text style={styles.modernStatLabel}>Clubs</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.modernActionButtonsContainer}>
      <TouchableOpacity 
        style={styles.modernMessageButton}
        onPress={handleMessage}
      >
        <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
        <Text style={styles.modernMessageButtonText}>Message</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.modernFollowButton, isFollowing && styles.modernFollowingButton]}
        onPress={handleFollow}
      >
        <Ionicons 
          name={isFollowing ? "heart" : "heart-outline"} 
          size={20} 
          color={isFollowing ? "#FFFFFF" : "#991B1B"} 
        />
        <Text style={[styles.modernFollowButtonText, isFollowing && styles.modernFollowingButtonText]}>
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreActionsButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#991B1B" />
      </TouchableOpacity>
    </View>
  );

  const renderSkills = () => (
    <View style={styles.modernSection}>
      <View style={styles.modernSectionHeader}>
        <Text style={styles.modernSectionTitle}>Skills & Expertise</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={20} color="#991B1B" />
        </TouchableOpacity>
      </View>
      <View style={styles.modernSkillsContainer}>
        {user.skills.map((skill, index) => (
          <TouchableOpacity key={index} style={styles.modernSkillChip}>
            <Text style={styles.modernSkillText}>{skill}</Text>
            <View style={styles.skillLevel}>
              <View style={[styles.skillLevelFill, { width: `${Math.random() * 40 + 60}%` }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.modernSection}>
      <View style={styles.modernSectionHeader}>
        <Text style={styles.modernSectionTitle}>Achievements</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
        {user.achievements.map((achievement, index) => (
          <TouchableOpacity key={index} style={styles.modernAchievementCard}>
            <View style={styles.modernAchievementIcon}>
              <Ionicons name={achievement.icon as any} size={28} color="#991B1B" />
            </View>
            <Text style={styles.modernAchievementTitle}>{achievement.title}</Text>
            <Text style={styles.modernAchievementSubtitle}>{achievement.subtitle}</Text>
            <View style={styles.achievementGlow} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fef2f2" translucent={true} />
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileInfo()}
        {renderStats()}
        {renderActionButtons()}
        {renderSkills()}
        {renderAchievements()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2',
  },
  
  // Modern Header Styles
  modernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modernBackButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  },
  modernHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#991B1B',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  },

  // Modern Profile Section
  modernProfileSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernAvatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGlow: {
    position: 'relative',
  },
  modernAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#991B1B',
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#991B1B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modernUserName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  modernUserBio: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  modernInfoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 26, 26, 0.2)',
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Modern Stats
  modernStatsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernStatItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    minWidth: 70,
  },
  modernStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  modernStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Modern Action Buttons
  modernActionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernMessageButton: {
    flex: 1,
    backgroundColor: '#991B1B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modernMessageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modernFollowButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modernFollowingButton: {
    backgroundColor: '#991B1B',
    borderColor: '#991B1B',
  },
  modernFollowButtonText: {
    color: '#991B1B',
    fontSize: 16,
    fontWeight: '600',
  },
  modernFollowingButtonText: {
    color: '#FFFFFF',
  },
  moreActionsButton: {
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#991B1B',
  },

  // Modern Sections
  modernSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modernSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '600',
  },

  // Modern Skills
  modernSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modernSkillChip: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#991B1B',
    minWidth: (width - 80) / 2,
    alignItems: 'center',
  },
  modernSkillText: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '600',
    marginBottom: 6,
  },
  skillLevel: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  skillLevelFill: {
    height: '100%',
    backgroundColor: '#991B1B',
    borderRadius: 2,
  },

  // Modern Achievements
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  modernAchievementCard: {
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: 160,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#991B1B',
    position: 'relative',
    overflow: 'hidden',
  },
  modernAchievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modernAchievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  modernAchievementSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  achievementGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 26, 26, 0.1)',
  },

  bottomSpacing: {
    height: 40,
  },
  scrollView: {
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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
