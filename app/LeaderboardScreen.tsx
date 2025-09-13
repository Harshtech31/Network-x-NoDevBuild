import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Contributor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rank: number;
  posts: number;
  likes: number;
  collabs: number;
  badge: string;
  badgeColor: string;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  // Mock data with total scores
  const mockContributors: Contributor[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'AI Campus Assistant',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      rank: 1,
      posts: 24,
      likes: 342,
      collabs: 8,
      badge: 'Top Contributor',
      badgeColor: '#F59E0B'
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      title: 'Sustainable Energy Monitor',
      avatar: 'https://i.pravatar.cc/150?u=ahmed',
      rank: 2,
      posts: 19,
      likes: 298,
      collabs: 6,
      badge: 'Innovation Leader',
      badgeColor: '#10B981'
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      title: 'Campus Food Waste Tracker',
      avatar: 'https://i.pravatar.cc/150?u=emma',
      rank: 3,
      posts: 17,
      likes: 276,
      collabs: 7,
      badge: 'Rising Star',
      badgeColor: '#F97316'
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Study Group Matcher',
      avatar: 'https://i.pravatar.cc/150?u=david',
      rank: 4,
      posts: 15,
      likes: 234,
      collabs: 5,
      badge: 'Active Creator',
      badgeColor: '#8B5CF6'
    },
    {
      id: '5',
      name: 'Priya Patel',
      title: 'Mental Health Support Bot',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      rank: 5,
      posts: 13,
      likes: 198,
      collabs: 4,
      badge: 'Consistent Poster',
      badgeColor: '#EF4444'
    },
    {
      id: '6',
      name: 'Marcus Johnson',
      title: 'Campus Event Organizer',
      avatar: 'https://i.pravatar.cc/150?u=marcus',
      rank: 6,
      posts: 12,
      likes: 189,
      collabs: 3,
      badge: 'Event Master',
      badgeColor: '#8B5CF6'
    },
    {
      id: '7',
      name: 'Lisa Wang',
      title: 'Research Assistant',
      avatar: 'https://i.pravatar.cc/150?u=lisa',
      rank: 7,
      posts: 11,
      likes: 167,
      collabs: 2,
      badge: 'Researcher',
      badgeColor: '#10B981'
    }
  ];

  const topThree = mockContributors.slice(0, 3);

  useEffect(() => {
    // Load contributors immediately without delay
    setContributors(mockContributors);
  }, []);

  const navigateToProfile = (contributor: Contributor) => {
    router.push({
      pathname: '/UserProfileScreen',
      params: {
        userId: contributor.id,
        userName: contributor.name,
        userAvatar: contributor.avatar
      }
    });
  };

  const getTotalScore = (contributor: Contributor) => {
    return contributor.posts + contributor.likes + contributor.collabs;
  };

  const renderPodiumSection = () => (
    <LinearGradient
      colors={['#7f1d1d', '#ea580c', '#fed7aa']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.podiumContainer}
    >
      <Text style={styles.podiumTimer}>Ends in 20 23Hours</Text>
      
      <View style={styles.podiumStands}>
        {/* Second Place */}
        <TouchableOpacity 
          style={styles.podiumPlace}
          onPress={() => navigateToProfile(contributors[1])}
        >
          <Image source={{ uri: contributors[1]?.avatar }} style={styles.podiumAvatar} />
          <Text style={styles.podiumName}>{contributors[1]?.name.split(' ')[0]}</Text>
          <View style={styles.scoreChip}>
            <Text style={styles.scoreText}>{getTotalScore(contributors[1])}</Text>
          </View>
          <View style={styles.podiumNumber}>
            <Text style={styles.podiumNumberText}>2</Text>
          </View>
        </TouchableOpacity>
        
        {/* First Place */}
        <TouchableOpacity 
          style={[styles.podiumPlace, styles.firstPlace]}
          onPress={() => navigateToProfile(contributors[0])}
        >
          <Image source={{ uri: contributors[0]?.avatar }} style={styles.podiumAvatar} />
          <Text style={styles.podiumName}>{contributors[0]?.name.split(' ')[0]}</Text>
          <View style={styles.scoreChip}>
            <Text style={styles.scoreText}>{getTotalScore(contributors[0])}</Text>
          </View>
          <View style={styles.podiumNumber}>
            <Text style={styles.podiumNumberText}>1</Text>
          </View>
        </TouchableOpacity>
        
        {/* Third Place */}
        <TouchableOpacity 
          style={styles.podiumPlace}
          onPress={() => navigateToProfile(contributors[2])}
        >
          <Image source={{ uri: contributors[2]?.avatar }} style={styles.podiumAvatar} />
          <Text style={styles.podiumName}>{contributors[2]?.name.split(' ')[0]}</Text>
          <View style={styles.scoreChip}>
            <Text style={styles.scoreText}>{getTotalScore(contributors[2])}</Text>
          </View>
          <View style={styles.podiumNumber}>
            <Text style={styles.podiumNumberText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderContributorCard = ({ item: contributor }: { item: Contributor }) => (
    <View style={styles.contributorCardWrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollableCardContent}
      >
        <TouchableOpacity 
          style={styles.contributorCard}
          onPress={() => navigateToProfile(contributor)}
          activeOpacity={0.95}
        >
          {/* Position Icon */}
          <View style={styles.positionIconContainer}>
            {contributor.rank === 1 && <Ionicons name="trophy" size={20} color="#F59E0B" />}
            {contributor.rank === 2 && <Ionicons name="medal" size={20} color="#6B7280" />}
            {contributor.rank === 3 && <Ionicons name="medal" size={20} color="#CD7C2F" />}
            {contributor.rank > 3 && <Ionicons name="star-outline" size={20} color="#9CA3AF" />}
          </View>
          
          {/* Profile Picture */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: contributor.avatar }} style={styles.avatar} />
          </View>
          
          {/* Name and Title */}
          <View style={styles.nameSection}>
            <Text style={styles.contributorName}>{contributor.name}</Text>
            <Text style={styles.contributorTitle}>{contributor.title}</Text>
          </View>
          
          {/* Stats Count */}
          <View style={styles.statsCount}>
            <Text style={styles.totalScore}>{getTotalScore(contributor)}</Text>
            <Text style={styles.scoreLabel}>Total Score</Text>
          </View>
          
          {/* Achievement Badge */}
          <View style={[styles.badge, { backgroundColor: contributor.badgeColor }]}>
            <Text style={styles.badgeLabel}>{contributor.badge}</Text>
          </View>
          
          {/* Additional Stats - Now visible with horizontal scroll */}
          <View style={styles.additionalStats}>
            <View style={styles.additionalStatItem}>
              <Text style={styles.additionalStatNumber}>{contributor.posts}</Text>
              <Text style={styles.additionalStatLabel}>Posts</Text>
            </View>
            <View style={styles.additionalStatItem}>
              <Text style={styles.additionalStatNumber}>{contributor.likes}</Text>
              <Text style={styles.additionalStatLabel}>Likes</Text>
            </View>
            <View style={styles.additionalStatItem}>
              <Text style={styles.additionalStatNumber}>{contributor.collabs}</Text>
              <Text style={styles.additionalStatLabel}>Collabs</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );


  const renderTopThreeSection = () => (
    <LinearGradient
      colors={['#7f1d1d', '#ea580c', '#fed7aa']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.topThreeContainer}
    >
      <View style={styles.topThreeHeader}>
        <Ionicons name="trophy" size={24} color="#FFFFFF" />
        <Text style={styles.topThreeTitle}>This Month's Top 3</Text>
      </View>
      
      <View style={styles.topThreeList}>
        {topThree.map((contributor, index) => (
          <TouchableOpacity 
            key={contributor.id}
            style={styles.topThreeItem}
            onPress={() => navigateToProfile(contributor)}
          >
            <View style={styles.topThreeAvatar}>
              <Image source={{ uri: contributor.avatar }} style={styles.topThreeAvatarImage} />
              <View style={[styles.topThreeRank, { backgroundColor: index === 0 ? '#F59E0B' : index === 1 ? '#6B7280' : '#CD7C2F' }]}>
                <Text style={styles.topThreeRankText}>{index + 1}</Text>
              </View>
            </View>
            <Text style={styles.topThreeName}>{contributor.name}</Text>
            <Text style={styles.topThreeStats}>
              {contributor.posts} posts • {contributor.likes} likes
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Simple Header */}
      <View style={styles.simpleHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#7f1d1d" />
        </TouchableOpacity>
        <Text style={styles.simpleHeaderTitle}>Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top 3 Section */}
        {renderTopThreeSection()}

        {/* All Contributors List */}
        <View style={styles.allContributorsContainer}>
          <Text style={styles.sectionTitle}>All Contributors</Text>
          <FlatList
            data={contributors}
            renderItem={renderContributorCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 43,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  simpleHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  podiumContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  podiumTimer: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 30,
    fontWeight: '500',
  },
  podiumStands: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  podiumPlace: {
    alignItems: 'center',
    position: 'relative',
  },
  firstPlace: {
    marginBottom: 0,
  },
  podiumAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  podiumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  podiumNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  podiumNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  cardsContainer: {
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },
  cardsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contributorCardWrapper: {
    marginBottom: 12,
  },
  scrollableCardContent: {
    paddingRight: 20,
  },
  contributorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 600,
  },
  positionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rankIcon: {
    fontSize: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 48,
    marginBottom: 16,
  },
  cardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  userDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f1d1d',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  topThreeContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  topThreeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  topThreeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topThreeList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  topThreeItem: {
    alignItems: 'center',
    flex: 1,
  },
  topThreeAvatar: {
    position: 'relative',
    marginBottom: 12,
  },
  topThreeAvatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  topThreeRank: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  topThreeRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topThreeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  topThreeStats: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userCardDesktop: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  topThreeCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userBadge: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 60,
  },
  userBadgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  rankNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7f1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  topThreeDesktopItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 200,
  },
  topThreeScrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topThreeScroll: {
    flexGrow: 0,
  },
  // All Users Section
  allUsersContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
  },
  allUsersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  usersList: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f1d1d',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    paddingBottom: 100,
  },
  // New Contributor Card Styles
  allContributorsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  duplicateContributorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameSection: {
    flex: 1,
    marginRight: 12,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contributorTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsCount: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 60,
  },
  totalScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f1d1d',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 50,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  additionalStats: {
    flexDirection: 'row',
    marginLeft: 16,
    gap: 16,
  },
  additionalStatItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  additionalStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  additionalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
});
