import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ShareService } from '../../utils/ShareService';

// Mock Data & Types
type FeedItem = {
  id: string;
  type: 'event' | 'project' | 'post' | 'story' | 'club';
  title?: string;
  user?: { name: string; handle: string; avatar: string; verified?: boolean; role?: string };
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
  members?: number;
  posts?: number;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
};

type QuickAction = {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
};

type StoryItem = {
  id: string;
  user: { name: string; avatar: string };
  preview: string;
  isViewed: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', title: 'Find Collaborators', icon: 'people', color: '#991B1B', route: '/CollaborationScreen' },
  { id: '2', title: 'Create Project', icon: 'add-circle', color: '#ea580c', route: '/CreateScreen' },
  { id: '3', title: 'Join Events', icon: 'calendar', color: '#991B1B', route: '/EventsScreen' },
  { id: '4', title: 'Messages', icon: 'chatbubble-ellipses', color: '#ea580c', route: '/MessagesScreen' },
];

const STORIES_DATA: StoryItem[] = [
  { id: '1', user: { name: 'Your Story', avatar: 'https://i.pravatar.cc/150?u=you' }, preview: 'https://source.unsplash.com/150x150/?profile', isViewed: false },
  { id: '2', user: { name: 'Alex Kumar', avatar: 'https://i.pravatar.cc/150?u=alex' }, preview: 'https://source.unsplash.com/150x150/?tech', isViewed: false },
  { id: '3', user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' }, preview: 'https://source.unsplash.com/150x150/?design', isViewed: true },
  { id: '4', user: { name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?u=maya' }, preview: 'https://source.unsplash.com/150x150/?startup', isViewed: false },
  { id: '5', user: { name: 'Jordan Smith', avatar: 'https://i.pravatar.cc/150?u=jordan' }, preview: 'https://source.unsplash.com/150x150/?coding', isViewed: true },
];

const FEED_DATA: FeedItem[] = [
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
    category: 'Technology'
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
    priority: 'high'
  },
  { 
    id: '3', 
    type: 'post', 
    user: { name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://i.pravatar.cc/150?u=sarahc', verified: true, role: 'UX Designer' }, 
    timestamp: '2h ago', 
    content: 'Successfully launched my professional portfolio website built with React and Framer Motion. The journey from concept to deployment taught me so much about modern web development. Professional feedback is welcome! #webdev #uidesign #portfolio', 
    media: 'https://source.unsplash.com/400x300/?website,portfolio', 
    likes: 342, 
    comments: 28, 
    shares: 15 
  },
  { 
    id: '4', 
    type: 'project', 
    title: 'Campus Connect Platform', 
    user: { name: 'Maya Patel', handle: '@mayap', avatar: 'https://i.pravatar.cc/150?u=mayap', verified: false, role: 'Product Manager' }, 
    content: 'Building a comprehensive networking platform for students and professionals. Features include skill matching, project collaboration, and career mentorship. Beta testing phase begins next month.', 
    tags: ['Mobile App', 'Social', 'Networking'], 
    likes: 189, 
    comments: 22, 
    shares: 8,
    priority: 'medium'
  },
  { 
    id: '5', 
    type: 'event', 
    title: 'Design Thinking Workshop', 
    location: 'Creative Studio, Downtown', 
    date: '2025-09-12', 
    time: '15:00', 
    media: 'https://source.unsplash.com/400x300/?design,workshop', 
    tags: ['Design', 'Workshop', 'Creative'],
    priority: 'medium',
    category: 'Design'
  },
  { 
    id: '6', 
    type: 'post', 
    user: { name: 'Jordan Smith', handle: '@jordans', avatar: 'https://i.pravatar.cc/150?u=jordans', verified: false, role: 'Software Developer' }, 
    timestamp: '1d ago', 
    content: 'Excited to announce my participation in the upcoming hackathon this weekend! Looking forward to collaborating with talented developers and building something amazing. Who else is joining? 🚀', 
    media: null, 
    likes: 156, 
    comments: 31, 
    shares: 7 
  },
  { 
    id: '7', 
    type: 'project', 
    title: 'Mental Health Support System', 
    user: { name: 'Lisa Park', handle: '@lisap', avatar: 'https://i.pravatar.cc/150?u=lisap', verified: true, role: 'AI Researcher' }, 
    content: 'Developing an AI-powered mental health support system specifically designed for students. Seeking NLP specialists, clinical psychologists, and domain experts to join our mission of making mental health support more accessible.', 
    tags: ['AI', 'Health', 'Psychology', 'NLP'], 
    likes: 298, 
    comments: 45, 
    shares: 23,
    priority: 'high'
  },
  { 
    id: '8', 
    type: 'club', 
    title: 'Tech Innovation Club', 
    content: 'A community of passionate developers, designers, and entrepreneurs working on cutting-edge technology projects. We meet weekly to discuss trends, share knowledge, and collaborate on innovative solutions.',
    location: 'Tech Hub, Building A',
    members: 127,
    posts: 45,
    tags: ['Technology', 'Innovation', 'Startups'],
    priority: 'high',
    category: 'Technology'
  },
  { 
    id: '9', 
    type: 'event', 
    title: 'Career Development Fair 2025', 
    location: 'Convention Center', 
    date: '2025-09-15', 
    time: '10:00', 
    media: 'https://source.unsplash.com/400x300/?career,networking', 
    tags: ['Career', 'Networking', 'Professional'],
    priority: 'high',
    category: 'Career'
  },
  { 
    id: '10', 
    type: 'club', 
    title: 'Creative Design Society', 
    content: 'Join our vibrant community of designers, artists, and creative minds. We organize workshops, design challenges, and networking events to help members grow their creative skills and professional network.',
    location: 'Design Studio, Floor 3',
    members: 89,
    posts: 32,
    tags: ['Design', 'Art', 'Creative'],
    priority: 'medium',
    category: 'Design'
  },
];

const AnimatedCard = ({ children, style, index }: { children: React.ReactNode, style?: any, index?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const delay = (index || 0) * 100;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.card, 
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const AnimatedButton = ({ children, onPress, style }: { children: React.ReactNode, onPress: () => void, style?: any }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postInteractions, setPostInteractions] = useState<{[key: string]: {liked: boolean, likes: number, comments: number, shares: number, saved: boolean}}>({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<{[key: string]: Array<{id: string, user: string, text: string, timestamp: string}>}>({});
  const [newComment, setNewComment] = useState('');
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const tabScrollViewRef = useRef<ScrollView>(null);

  const tabs = ['All', 'Posts', 'Projects', 'Events', 'Clubs'];

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    if (index !== activeTabIndex) {
      setActiveTabIndex(index);
      // Auto-scroll tab bar to show active tab
      const tabWidth = 100; // Approximate tab width
      const tabScrollX = index * tabWidth - width / 2 + tabWidth / 2;
      tabScrollViewRef.current?.scrollTo({ x: Math.max(0, tabScrollX), animated: true });
    }
  };

  const menuItems = [
    {
      id: 'collaborations',
      title: 'Find Collaborators',
      icon: 'people',
      route: '/CollaborationScreen',
      description: 'Connect with like-minded individuals'
    },
    {
      id: 'groups',
      title: 'Join Groups',
      icon: 'chatbubbles',
      route: '/JoinGroupsScreen',
      description: 'Discover and join communities'
    },
    {
      id: 'events',
      title: 'Events',
      icon: 'calendar',
      route: '/EventsScreen',
      description: 'Upcoming events and activities'
    },
    {
      id: 'saved',
      title: 'Saved',
      icon: 'bookmark',
      route: '/SavedScreen',
      description: 'Your saved posts and content'
    }
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In real app, refetch feed data here
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh feed. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Simulate initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        Alert.alert('Error', 'Failed to load feed data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handlePostInteraction = async (postId: string, action: 'like' | 'comment' | 'share' | 'save') => {
    const feedItem = FEED_DATA.find(item => item.id === postId);
    
    setPostInteractions(prev => {
      const current = prev[postId] || { liked: false, likes: 42, comments: 8, shares: 3, saved: false };
      
      switch (action) {
        case 'like':
          return {
            ...prev,
            [postId]: {
              ...current,
              liked: !current.liked,
              likes: current.liked ? current.likes - 1 : current.likes + 1
            }
          };
        case 'comment':
          console.log('Opening comments for post:', postId);
          setSelectedPostId(postId);
          setShowCommentsModal(true);
          return prev;
        case 'share':
          if (feedItem) {
            handleShare(feedItem);
          }
          return {
            ...prev,
            [postId]: {
              ...current,
              shares: current.shares + 1
            }
          };
        case 'save':
          return {
            ...prev,
            [postId]: {
              ...current,
              saved: !current.saved
            }
          };
        default:
          return prev;
      }
    });
  };

  const handleShare = async (item: FeedItem) => {
    try {
      let shareSuccess = false;
      
      switch (item.type) {
        case 'post':
          shareSuccess = await ShareService.sharePost({
            id: item.id,
            content: item.content || item.title || 'Check out this post',
            user: item.user || { name: 'Anonymous' }
          });
          break;
          
        case 'event':
          shareSuccess = await ShareService.shareEvent({
            id: item.id,
            title: item.title || 'Event',
            content: item.content,
            location: item.location,
            date: item.date,
            time: item.time,
            organizer: item.user
          });
          break;
          
        case 'project':
          shareSuccess = await ShareService.shareProject({
            id: item.id,
            title: item.title || 'Project',
            content: item.content,
            user: item.user
          });
          break;
          
        case 'club':
          shareSuccess = await ShareService.shareClub({
            id: item.id,
            title: item.title || 'Club',
            content: item.content,
            location: item.location
          });
          break;
          
        default:
          shareSuccess = await ShareService.quickShareText(
            item.content || item.title || 'Check this out on NetworkX!',
            'Shared from NetworkX'
          );
      }
      
      if (shareSuccess) {
        console.log(`Successfully shared ${item.type}:`, item.id);
      }
    } catch (error) {
      console.error('Error sharing item:', error);
      Alert.alert('Share Error', 'Unable to share this content.');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedPostId) {
      const comment = {
        id: Date.now().toString(),
        user: 'You',
        text: newComment.trim(),
        timestamp: 'now'
      };
      
      setComments(prev => ({
        ...prev,
        [selectedPostId]: [...(prev[selectedPostId] || []), comment]
      }));
      
      setPostInteractions(prev => ({
        ...prev,
        [selectedPostId]: {
          ...prev[selectedPostId],
          comments: (prev[selectedPostId]?.comments || 0) + 1
        }
      }));
      
      setNewComment('');
    }
  };

  useEffect(() => {
    if (showSideMenu) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSideMenu]);

  const handleMenuItemPress = (route: string) => {
    setShowSideMenu(false);
    if (route === '/CollaborationScreen') {
      router.push('/CollaborationScreen');
    } else if (route === '/SavedScreen') {
      router.push('/SavedScreen');
    } else if (route === '/JoinGroupsScreen') {
      router.push('/JoinGroupsScreen');
    } else {
      console.log(`Navigate to ${route}`);
    }
  };

  // Theme toggle handled by context

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleQuickAction = (route: string) => {
    if (route === '/CollaborationScreen') {
      router.push('/CollaborationScreen');
    } else if (route === '/CreateScreen') {
      router.push('/CreateScreen');
    } else if (route === '/MessagesScreen') {
      router.push('/MessagesScreen');
    } else {
      console.log(`Navigate to ${route}`);
    }
  };

  const handleStoryPress = (storyId: string) => {
    console.log('Story pressed:', storyId);
    // Navigate to story view
  };

  const handleEventPress = (eventId: string) => {
    console.log('Event pressed:', eventId);
    // Navigate to event detail - will implement proper routing later
  };

  const handleProjectPress = (projectId: string) => {
    console.log('Project pressed:', projectId);
    // Navigate to project detail - will implement proper routing later
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear any stored user data/tokens here
            // Reset app state
            setShowSideMenu(false);
            setActiveFilter('All');
            setPostInteractions({});
            // Reset theme handled by context
            
            console.log('User logged out successfully');
            
            // Navigate back to root or login screen
            router.replace('/(tabs)');
            
            // Show logout confirmation
            setTimeout(() => {
              Alert.alert('Logged Out', 'You have been successfully logged out');
            }, 500);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredData = useMemo(() => {
    if (activeFilter === 'All') return FEED_DATA;
    if (activeFilter === 'Posts') return FEED_DATA.filter(item => item.type === 'post');
    if (activeFilter === 'Projects') return FEED_DATA.filter(item => item.type === 'project');
    if (activeFilter === 'Events') return FEED_DATA.filter(item => item.type === 'event');
    if (activeFilter === 'Clubs') return FEED_DATA.filter(item => item.type === 'club');
    return FEED_DATA.filter(item => item.type === activeFilter.toLowerCase().slice(0, -1));
  }, [activeFilter]);



  const renderItem = React.useCallback(({ item, index }: { item: FeedItem, index: number }) => {
    const interactions = postInteractions[item.id] || { liked: false, likes: item.likes || 0, comments: item.comments || 0, shares: item.shares || 0, saved: false };

    if (item.type === 'event') {
      const eventDate = new Date(item.date || '');
      const day = eventDate.getDate();
      const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      
      return (
        <View style={styles.cleanEventCard}>
          
          <View style={styles.eventMainContent}>
            <View style={styles.eventDateBox}>
              <Text style={styles.eventDay}>{day}</Text>
              <Text style={styles.eventMonth}>{month}</Text>
            </View>
            
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={14} color="#991B1B" />
                  <Text style={styles.eventDetailText}>{item.location}</Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="time-outline" size={14} color="#ea580c" />
                  <Text style={styles.eventDetailText}>{item.time}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.bookmarkIcon}
              onPress={() => handlePostInteraction(item.id, 'save')}
            >
              <Ionicons 
                name={interactions.saved ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={interactions.saved ? "#ea580c" : "#991B1B"} 
              />
            </TouchableOpacity>
          </View>
          
          {item.media && (
            <View style={styles.eventImageSection}>
              <Image source={{ uri: item.media }} style={styles.eventImage} resizeMode="cover" />
              <View style={styles.eventImageOverlay}>
                <TouchableOpacity 
                  style={styles.joinEventButton}
                  onPress={() => handleEventPress(item.id)}
                >
                  <Text style={styles.joinEventText}>Join Event</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.eventTags}>
            {item.tags?.slice(0, 3).map((tag, tagIndex) => (
              <View key={tagIndex} style={styles.eventTag}>
                <Text style={styles.eventTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (item.type === 'project') {
      return (
        <View style={styles.cleanProjectCard}>
          <View style={styles.projectMainContent}>
            <View style={styles.projectIconBox}>
              <Ionicons name="code-working" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.projectInfo}>
              <Text style={styles.projectTitle}>{item.title}</Text>
              <View style={styles.projectDetails}>
                <View style={styles.projectDetailRow}>
                  <Ionicons name="person-outline" size={14} color="#991B1B" />
                  <Text style={styles.projectDetailText}>{item.user?.name}</Text>
                </View>
                <View style={styles.projectDetailRow}>
                  <Ionicons name="time-outline" size={14} color="#ea580c" />
                  <Text style={styles.projectDetailText}>No deadline</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bookmarkIcon}
              onPress={() => handlePostInteraction(item.id, 'save')}
            >
              <Ionicons 
                name={interactions.saved ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={interactions.saved ? "#ea580c" : "#991B1B"} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.projectDescription}>
            <Text style={styles.projectDescriptionText}>{item.content}</Text>
          </View>
          <View style={styles.projectActions}>
            <TouchableOpacity 
              style={styles.projectActionButton}
              onPress={() => handleProjectPress(item.id)}
            >
              <Text style={styles.projectActionText}>View Project</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.projectStats}>
              <TouchableOpacity 
                style={styles.projectStatButton}
                onPress={() => handlePostInteraction(item.id, 'like')}
              >
                <Ionicons 
                  name={interactions.liked ? "heart" : "heart-outline"} 
                  size={18} 
                  color={interactions.liked ? "#ea580c" : "#6B7280"} 
                />
                <Text style={styles.projectStatText}>{interactions.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.projectStatButton}
                onPress={() => handlePostInteraction(item.id, 'comment')}
              >
                <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                <Text style={styles.projectStatText}>{interactions.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.projectTags}>
            {item.tags?.slice(0, 3).map((tag, tagIndex) => (
              <View key={tagIndex} style={styles.projectTag}>
                <Text style={styles.projectTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (item.type === 'club') {
      return (
        <View style={styles.cleanClubCard}>
          <View style={styles.clubMainContent}>
            <View style={styles.clubIconBox}>
              <Ionicons name="people" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.clubInfo}>
              <Text style={styles.clubTitle}>{item.title}</Text>
              <View style={styles.clubDetails}>
                <View style={styles.clubDetailRow}>
                  <Ionicons name="location-outline" size={14} color="#991B1B" />
                  <Text style={styles.clubDetailText}>{item.location || 'Online'}</Text>
                </View>
                <View style={styles.clubDetailRow}>
                  <Ionicons name="person-outline" size={14} color="#ea580c" />
                  <Text style={styles.clubDetailText}>{item.members || '0'} members</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bookmarkIcon}
              onPress={() => handlePostInteraction(item.id, 'save')}
            >
              <Ionicons 
                name={interactions.saved ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={interactions.saved ? "#ea580c" : "#991B1B"} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.clubDescription}>
            <Text style={styles.clubDescriptionText}>{item.content}</Text>
          </View>
          <View style={styles.clubActions}>
            <TouchableOpacity 
              style={styles.clubActionButton}
              onPress={() => console.log('Club application:', item.id)}
            >
              <Ionicons name="flame" size={16} color="#FFFFFF" />
              <Text style={styles.clubActionText}>Interested</Text>
            </TouchableOpacity>
            <View style={styles.clubStats}>
              <TouchableOpacity style={styles.clubStatButton}>
                <Ionicons name="people-outline" size={18} color="#6B7280" />
                <Text style={styles.clubStatText}>{item.members || '0'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clubStatButton}>
                <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                <Text style={styles.clubStatText}>{item.posts || '0'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.clubTags}>
            {item.tags?.slice(0, 3).map((tag, tagIndex) => (
              <View key={tagIndex} style={styles.clubTag}>
                <Text style={styles.clubTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.premiumPostCard}>
        <View style={styles.postHeaderNew}>
          <View style={styles.userAvatarContainerNew}>
            <Image source={{ uri: item.user?.avatar }} style={styles.premiumUserAvatar} />
            <View style={styles.storyRingNew} />
          </View>
          <View style={styles.userInfoNew}>
            <View style={styles.userNameRowNew}>
              <Text style={styles.premiumUserName}>{item.user?.name}</Text>
              {item.user?.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#991B1B" />
              )}
            </View>
            <Text style={styles.postTimestampNew}>{item.timestamp}</Text>
          </View>
          <TouchableOpacity style={styles.postMoreBtnNew}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View style={styles.postContentContainerNew}>
          <Text style={styles.premiumPostContent}>{item.content}</Text>
        </View>
        {item.media && (
          <View style={styles.postImageContainerNew}>
            <Image source={{ uri: item.media }} style={styles.premiumPostImage} resizeMode="cover" />
          </View>
        )}
        <View style={styles.postActionsNew}>
          <View style={styles.postActionsLeftNew}>
            <TouchableOpacity 
              style={styles.modernActionButtonNew}
              onPress={() => handlePostInteraction(item.id, 'like')}
            >
              <Ionicons 
                name={interactions.liked ? "heart" : "heart-outline"} 
                size={24} 
                color={interactions.liked ? "#e11d48" : "#991B1B"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modernActionButtonNew}
              onPress={() => handlePostInteraction(item.id, 'comment')}
            >
              <Ionicons name="chatbubble-outline" size={22} color="#991B1B" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modernActionButtonNew}
              onPress={() => handlePostInteraction(item.id, 'share')}
            >
              <Ionicons name="paper-plane-outline" size={22} color="#991B1B" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.bookmarkBtnNew}
            onPress={() => handlePostInteraction(item.id, 'save')}
          >
            <Ionicons 
              name={interactions.saved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={interactions.saved ? "#ea580c" : "#991B1B"} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.postStatsNew}>
          <Text style={styles.likesCountNew}>{interactions.likes} likes</Text>
          <TouchableOpacity>
            <Text style={styles.commentsLinkNew}>View all {interactions.comments} comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [postInteractions]);

  // Loading Screen Component
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fef2f2" />
        <View style={styles.loadingContent}>
          <LinearGradient
            colors={['#991B1B', '#FFF4E9']}
            style={styles.loadingLogo}
          >
            <Ionicons name="home" size={40} color="#FFFFFF" />
          </LinearGradient>
          <ActivityIndicator size="large" color="#991B1B" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading your feed...</Text>
          <Text style={styles.loadingSubtext}>Getting the latest updates</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={[{ flex: 1, backgroundColor: '#FFFFFF' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fef2f2" translucent={true} />
        
        {/* Header */}
        <Animated.View style={[{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingHorizontal: 20, 
          paddingTop: 50, 
          paddingBottom: 16, 
          backgroundColor: '#fef2f2'
        }, { opacity: headerOpacity }]}>
          <TouchableOpacity 
            style={{ 
              padding: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              shadowColor: '#991B1B',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={() => setShowSideMenu(true)}
          >
            <Ionicons name="menu" size={24} color="#991B1B" />
          </TouchableOpacity>
          
          <Text style={{ 
            fontSize: 28, 
            fontWeight: 'bold', 
            color: '#991B1B',
            letterSpacing: -0.5
          }}>Home</Text>
          
          <TouchableOpacity 
            style={{ 
              padding: 8, 
              position: 'relative',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              shadowColor: '#991B1B',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={() => router.push('/NotificationsScreen')}
          >
            <Ionicons name="notifications-outline" size={24} color="#991B1B" />
            <View style={{ 
              position: 'absolute', 
              top: 4, 
              right: 4, 
              backgroundColor: '#991B1B', 
              borderRadius: 8, 
              width: 16, 
              height: 16, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>3</Text>
            </View>
            </TouchableOpacity>
        </Animated.View>

        {/* Swipeable Tabs */}
        <View style={{ 
          backgroundColor: '#FFFFFF', 
          paddingVertical: 12, 
          borderBottomWidth: 1, 
          borderBottomColor: '#E5E7EB' 
        }}>
          <ScrollView ref={tabScrollViewRef} horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  marginRight: 12,
                  borderRadius: 20,
                  backgroundColor: activeTabIndex === index ? '#991B1B' : 'transparent',
                  borderWidth: 1,
                  borderColor: activeTabIndex === index ? '#991B1B' : '#E5E7EB'
                }}
                onPress={() => handleTabPress(index)}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: activeTabIndex === index ? '#FFFFFF' : '#991B1B'
                }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={{ flex: 1 }}
        >
          {/* All Tab Content */}
          <ScrollView 
            style={{ width: width, backgroundColor: '#F8F9FA' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#991B1B']}
                tintColor={'#991B1B'}
              />
            }
          >
            <View style={{ paddingTop: 8, paddingBottom: 16 }}>
              {FEED_DATA.map((item, index) => (
                <View key={item.id}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Posts Tab Content */}
          <ScrollView 
            style={{ width: width, backgroundColor: '#F8F9FA' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#991B1B']}
                tintColor={'#991B1B'}
              />
            }
          >
            <View style={{ paddingTop: 8, paddingBottom: 16 }}>
              {FEED_DATA.filter(item => item.type === 'post').map((item, index) => (
                <View key={item.id}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Projects Tab Content */}
          <ScrollView 
            style={{ width: width, backgroundColor: '#F8F9FA' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#991B1B']}
                tintColor={'#991B1B'}
              />
            }
          >
            <View style={{ paddingTop: 8, paddingBottom: 16 }}>
              {FEED_DATA.filter(item => item.type === 'project').map((item, index) => (
                <View key={item.id}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Events Tab Content */}
          <ScrollView 
            style={{ width: width, backgroundColor: '#F8F9FA' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#991B1B']}
                tintColor={'#991B1B'}
              />
            }
          >
            <View style={{ paddingTop: 8, paddingBottom: 16 }}>
              {FEED_DATA.filter(item => item.type === 'event').map((item, index) => (
                <View key={item.id}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Clubs Tab Content */}
          <ScrollView 
            style={{ width: width, backgroundColor: '#F8F9FA' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#991B1B']}
                tintColor={'#991B1B'}
              />
            }
          >
            <View style={{ paddingTop: 8, paddingBottom: 16 }}>
              {FEED_DATA.filter(item => item.type === 'club').map((item, index) => (
                <View key={item.id}>
                  {renderItem({ item, index })}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Messages Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#991B1B',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#991B1B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
          onPress={() => router.push('/MessagesScreen')}
        >
          <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Enhanced Side Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSideMenu}
          onRequestClose={() => setShowSideMenu(false)}
        >
          <TouchableOpacity 
            style={styles.premiumModalOverlay}
            activeOpacity={1}
            onPress={() => setShowSideMenu(false)}
          >
            <Animated.View 
              style={[{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '75%',
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 10
              }, { transform: [{ translateX: slideAnim }] }]}
            >
              <LinearGradient
                colors={['#991B1B', '#FFF4E9']}
                style={{
                  padding: 20,
                  paddingTop: 40,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <TouchableOpacity 
                  style={styles.premiumProfileContainer}
                  onPress={() => {
                    setShowSideMenu(false);
                    router.push('/(tabs)/profile');
                  }}
                >
                  <View style={styles.premiumProfileImageContainer}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/60' }} 
                      style={styles.premiumProfileImage}
                    />
                    <View style={styles.profileStatusIndicator} />
                  </View>
                  <View style={styles.premiumProfileInfo}>
                    <Text style={styles.premiumProfileName}>John Doe</Text>
                    <Text style={styles.premiumProfileEmail}>john.doe@example.com</Text>
                    <View style={styles.profileStats}>
                      <Text style={styles.profileStatsText}>156 connections</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
              </LinearGradient>

              <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E5E7EB'
                    }}
                    onPress={() => handleMenuItemPress(item.route)}
                  >
                    <View style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 20, 
                      backgroundColor: '#F9FAFB', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginRight: 16 
                    }}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={22} 
                        color={'#991B1B'} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: '#1F2937', 
                        marginBottom: 2 
                      }}>
                        {item.title}
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: '#6B7280' 
                      }}>{item.description}</Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={18} 
                      color={'#6B7280'} 
                    />
                  </TouchableOpacity>
                ))}
                
                {/* Logout Button at Bottom */}
                <TouchableOpacity 
                  style={{
                    marginTop: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    alignItems: 'center'
                  }}
                  onPress={handleLogout}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#6B7280', 
                    fontWeight: '500' 
                  }}>Logout</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* Comments Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCommentsModal}
          onRequestClose={() => setShowCommentsModal(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.commentsModalOverlay}
          >
            <View style={styles.commentsModalContainer}>
              <View style={styles.commentsModalHeader}>
                <Text style={styles.commentsModalTitle}>Comments</Text>
                <TouchableOpacity 
                  onPress={() => setShowCommentsModal(false)}
                  style={styles.commentsModalClose}
                >
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.commentsScrollView}>
                {selectedPostId && comments[selectedPostId]?.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>{comment.user[0]}</Text>
                    </View>
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                    </View>
                  </View>
                ))}
                {selectedPostId && (!comments[selectedPostId] || comments[selectedPostId].length === 0) && (
                  <View style={styles.noCommentsContainer}>
                    <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                  </View>
                )}
              </ScrollView>
              
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity 
                  style={styles.commentSendButton}
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={newComment.trim() ? "#991B1B" : "#9CA3AF"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // Premium Container & Layout
  premiumContainer: {
    flex: 1,
    backgroundColor: '#f3f2ef'
  },
  
  // Premium Header Styles
  premiumHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 16, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0', 
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  premiumHamburgerButton: { 
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fef2f2'
  },
  premiumHeaderButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f3f2ef'
  },
  linkedinHeaderCenter: {
    flex: 1,
    alignItems: 'center'
  },
  linkedinTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000'
  },
  linkedinHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  linkedinNotificationButton: {
    padding: 8,
    position: 'relative'
  },
  linkedinNotificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#0a66c2',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkedinNotificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },

  // LinkedIn Main Content & Create Post
  linkedinMainContent: {
    flex: 1,
    paddingTop: 8
  },
  linkedinCreatePostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  linkedinCreatePostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  linkedinUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  linkedinCreatePostInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9'
  },
  linkedinCreatePostPlaceholder: {
    color: '#666666',
    fontSize: 16
  },
  linkedinCreatePostActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  linkedinActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  linkedinActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666666'
  },

  // Burgundy Pill Navigation Tabs
  linkedinNavTabs: {
    backgroundColor: '#f8f4f4',
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  tabsScrollView: {
    flexGrow: 0
  },
  linkedinTab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: 'transparent'
  },
  linkedinActiveTab: {
    backgroundColor: '#991B1B'
  },
  linkedinTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B'
  },
  linkedinActiveTabText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  linkedinTabIndicator: {
    display: 'none'
  },

  // Dark Mode Styles
  darkContainer: {
    backgroundColor: '#1a1a1a'
  },
  darkHeader: {
    backgroundColor: '#2d2d2d',
    borderBottomColor: '#404040'
  },
  darkText: {
    color: '#FFFFFF'
  },
  darkModeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  logoutButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  logoutText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500'
  },

  // Dark Mode Navigation Tabs
  darkNavTabs: {
    backgroundColor: '#2d2d2d',
    borderBottomColor: '#404040'
  },
  darkTab: {
    backgroundColor: '#404040',
    borderColor: '#666666'
  },
  darkActiveTab: {
    backgroundColor: '#991B1B',
    borderColor: '#991B1B'
  },
  darkTabText: {
    color: '#CCCCCC'
  },
  darkActiveTabText: {
    color: '#FFFFFF'
  },

  // Dark Mode Main Content
  darkMainContent: {
    backgroundColor: '#1a1a1a'
  },
  darkCard: {
    backgroundColor: '#2d2d2d',
    borderColor: '#404040'
  },
  darkCardText: {
    color: '#FFFFFF'
  },
  darkCardSubtext: {
    color: '#CCCCCC'
  },
  darkSideMenu: {
    backgroundColor: '#2d2d2d'
  },
  darkMenuItem: {
    backgroundColor: '#404040'
  },
  darkMenuText: {
    color: '#FFFFFF'
  },
  darkMessagesButton: {
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },

  // Premium Menu Header (was missing)
  premiumMenuHeader: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)'
  },
  premiumProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  premiumProfileImageContainer: {
    position: 'relative',
    marginRight: 12
  },
  premiumProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  premiumProfileInfo: {
    flex: 1
  },
  premiumProfileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4
  },
  premiumProfileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8
  },
  profileStats: {
    flexDirection: 'row'
  },
  profileStatsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500'
  },
  profileStatusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  logoGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  premiumHeaderTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    letterSpacing: 1
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  searchButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fef2f2'
  },
  notificationButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ea580c',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },

  // Feed Layout
  premiumFeedList: { 
    paddingBottom: 100 
  },
  feedHeader: {
    backgroundColor: '#fff7ed'
  },

  // Section Titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20
  },

  // Stories Section
  storiesContainer: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8
  },
  storiesScroll: {
    paddingHorizontal: 20
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70
  },
  storyImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
    marginBottom: 8
  },
  unviewedStory: {
    backgroundColor: '#991B1B'
  },
  viewedStory: {
    backgroundColor: '#D1D5DB'
  },
  storyImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F3F4F6'
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#991B1B',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  storyName: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500'
  },

  // Quick Actions Section
  quickActionsContainer: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  },

  // Premium Filter Container
  premiumFilterContainer: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 29, 29, 0.1)'
  },
  premiumFilterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 20,
    position: 'relative',
    alignItems: 'center'
  },
  premiumActiveFilter: {
    backgroundColor: '#fef2f2'
  },
  premiumFilterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280'
  },
  premiumActiveFilterText: {
    color: '#991B1B'
  },
  filterIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    backgroundColor: '#991B1B',
    borderRadius: 2
  },

  // Premium Event Card
  premiumEventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.1)'
  },
  priorityBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ea580c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  eventHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  eventDateBadgeNew: {
    width: 70,
    height: 70,
    backgroundColor: '#991B1B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  eventDateLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  eventMonthSmall: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  eventInfoNew: {
    flex: 1
  },
  premiumEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  eventMetaRowNew: {
    gap: 16
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  eventMetaText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500'
  },
  eventBookmarkBtnNew: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 16
  },
  eventImageContainerNew: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative'
  },
  premiumEventImage: {
    width: '100%',
    height: 200,
    borderRadius: 16
  },
  eventImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16
  },
  eventJoinBtnNew: {
    backgroundColor: 'rgba(127, 29, 29, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  eventJoinTextNew: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  eventTagsNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8
  },
  premiumTag: {
    backgroundColor: '#fed7aa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ea580c'
  },
  premiumTagText: {
    color: '#9a3412',
    fontSize: 12,
    fontWeight: '600'
  },

  // Premium Project Card
  premiumProjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.1)'
  },
  projectHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16
  },
  userAvatarContainerNew: {
    position: 'relative',
    marginRight: 12
  },
  premiumUserAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#fef2f2'
  },
  onlineIndicatorNew: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  userInfoNew: {
    flex: 1
  },
  userNameRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6
  },
  premiumUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827'
  },
  userRole: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500'
  },
  projectMoreBtnNew: {
    padding: 8
  },
  projectContentNew: {
    paddingHorizontal: 20,
    paddingBottom: 16
  },
  premiumProjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10
  },
  premiumProjectDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24
  },
  projectTagsNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8
  },
  gradientTagNew: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  gradientTagTextNew: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  projectActionsNew: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(127, 29, 29, 0.1)'
  },
  projectActionBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    gap: 6
  },
  likedButton: {
    backgroundColor: '#991B1B'
  },
  projectActionTextNew: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B'
  },
  likedText: {
    color: '#FFFFFF'
  },

  // Premium Post Card
  premiumPostCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  postHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16
  },
  storyRingNew: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: '#991B1B'
  },
  postTimestampNew: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500'
  },
  postMoreBtnNew: {
    padding: 8
  },
  postContentContainerNew: {
    paddingHorizontal: 20,
    paddingBottom: 16
  },
  premiumPostContent: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 26
  },
  postImageContainerNew: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden'
  },
  premiumPostImage: {
    width: '100%',
    height: 250,
    borderRadius: 16
  },
  postActionsNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16
  },
  postActionsLeftNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  modernActionButtonNew: {
    padding: 8
  },
  bookmarkBtnNew: {
    padding: 8
  },
  postStatsNew: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  likesCountNew: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  commentsLinkNew: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500'
  },

  // Messages Button
  messagesButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10
  },
  messagesButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Premium Side Menu
  premiumModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row'
  },
  premiumSideMenu: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20
  },
  menuHeaderGradient: {
    padding: 24,
    paddingTop: 60
  },
  premiumProfileSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16
  },
  premiumMenuProfileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  premiumMenuContent: {
    flex: 1,
    paddingTop: 16
  },
  premiumMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  premiumMenuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  premiumMenuItemContent: {
    flex: 1
  },
  premiumMenuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2
  },
  premiumMenuItemDescription: {
    fontSize: 14,
    color: '#6B7280'
  },

  // Logout Menu Item Styles
  logoutMenuItem: {
    backgroundColor: '#fef2f2',
    borderTopWidth: 1,
    borderTopColor: '#fecaca'
  },
  logoutMenuItemIcon: {
    backgroundColor: '#fee2e2'
  },
  logoutMenuItemTitle: {
    color: '#dc2626',
    fontWeight: '600'
  },

  // Legacy styles (keeping for compatibility)
  container: { flex: 1, backgroundColor: '#fef2f2' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(127, 29, 29, 0.1)', paddingTop: 70, paddingBottom: 10, shadowColor: '#991B1B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  hamburgerButton: { padding: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#991B1B' },
  feedList: { paddingHorizontal: 16, paddingBottom: 100 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#FFFFFF' },
  activeFilter: { backgroundColor: '#991B1B' },
  filterText: { color: '#991B1B', fontWeight: '600' },
  activeFilterText: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6, marginBottom: 20, overflow: 'hidden' },
  
  // Modern Event Card Styles (Legacy)
  modernEventCard: { backgroundColor: '#FFFFFF', borderRadius: 0, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginBottom: 8, overflow: 'hidden', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  eventHeader: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  eventDateBadge: { width: 60, height: 60, backgroundColor: '#991B1B', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  oldEventInfo: { flex: 1 },
  modernEventTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  eventMetaRow: { flexDirection: 'row', alignItems: 'center' },
  eventLocation: { fontSize: 14, color: '#6B7280', marginLeft: 4 },
  eventTime: { fontSize: 14, color: '#6B7280', marginLeft: 4 },
  eventBookmarkBtn: { padding: 8, backgroundColor: '#fef2f2', borderRadius: 12 },
  eventImageContainer: { position: 'relative', marginHorizontal: 20, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  modernEventImage: { width: '100%', height: 180, borderRadius: 16 },
  oldEventImageOverlay: { position: 'absolute', bottom: 12, right: 12 },
  eventJoinBtn: { backgroundColor: 'rgba(139, 26, 26, 0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  eventJoinText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  modernEventTags: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingBottom: 20 },
  modernTag: { backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#991B1B' },
  modernTagText: { color: '#991B1B', fontSize: 12, fontWeight: '600' },

  // Modern Project Card Styles  
  modernProjectCard: { backgroundColor: '#FFFFFF', borderRadius: 0, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginBottom: 8, overflow: 'hidden', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  modernProjectHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 16 },
  userAvatarContainer: { position: 'relative', marginRight: 12 },
  modernUserAvatar: { width: 48, height: 48, borderRadius: 24 },
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, backgroundColor: '#10B981', borderRadius: 7, borderWidth: 2, borderColor: '#FFFFFF' },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  modernUserName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginRight: 6 },
  verifiedBadge: { marginLeft: 4 },
  modernUserHandle: { fontSize: 14, color: '#6B7280' },
  projectMoreBtn: { padding: 8 },
  projectContent: { paddingHorizontal: 20, paddingBottom: 16 },
  modernProjectTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  modernProjectDescription: { fontSize: 15, color: '#374151', lineHeight: 22 },
  modernProjectTags: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingBottom: 16 },
  gradientTag: { backgroundColor: '#991B1B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  gradientTagText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  oldProjectActions: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(127, 29, 29, 0.1)' },
  projectActionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fef2f2' },
  oldProjectActionText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: '#991B1B' },

  // Modern Post Card Styles
  modernPostCard: { backgroundColor: '#FFFFFF', borderRadius: 0, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginBottom: 8, overflow: 'hidden', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  modernPostHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 16 },
  storyRing: { position: 'absolute', top: -2, left: -2, width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#991B1B' },
  modernPostTimestamp: { fontSize: 14, color: '#6B7280' },
  postMoreBtn: { padding: 8 },
  postContentContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  modernPostContent: { fontSize: 16, color: '#111827', lineHeight: 24 },
  postImageContainer: { position: 'relative', marginBottom: 16, overflow: 'hidden' },
  modernPostImage: { width: '100%', height: 240, borderRadius: 0 },
  postImageActions: { position: 'absolute', top: 12, right: 12 },
  imageActionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modernPostActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  postActionsLeft: { flexDirection: 'row', alignItems: 'center' },
  modernActionButton: { marginRight: 20, padding: 8 },
  bookmarkBtn: { padding: 8 },
  postStats: { paddingHorizontal: 20, paddingBottom: 20 },
  likesCount: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  commentsLink: { fontSize: 14, color: '#6B7280' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  headerTextContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  metaText: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  chip: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipText: { color: '#991B1B', fontSize: 12, fontWeight: '500' },
  projectBadge: { backgroundColor: '#fef2f2' },
  projectBadgeText: { color: '#991B1B' },

  // Clean Event Card Styles
  cleanEventCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden'
  },
  eventMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16
  },
  eventDateBox: {
    backgroundColor: '#991B1B',
    borderRadius: 12,
    width: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  eventDay: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  eventMonth: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600'
  },
  eventInfo: {
    flex: 1,
    marginRight: 8
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  eventDetails: {
    gap: 4
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  eventDetailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1
  },
  bookmarkIcon: {
    padding: 4
  },
  eventImageSection: {
    position: 'relative',
    height: 120,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden'
  },
  eventImage: {
    width: '100%',
    height: '100%'
  },
  eventImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  joinEventButton: {
    backgroundColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6
  },
  joinEventText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  eventTags: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8
  },
  eventTag: {
    backgroundColor: '#fed7aa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  eventTagText: {
    color: '#9a3412',
    fontSize: 12,
    fontWeight: '500'
  },

  // Clean Project Card Styles
  cleanProjectCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden'
  },
  projectMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16
  },
  projectIconBox: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  projectInfo: {
    flex: 1,
    marginRight: 8
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  projectDetails: {
    gap: 4
  },
  projectDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  projectDetailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1
  },
  projectDescription: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  projectDescriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  projectActionButton: {
    backgroundColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6
  },
  projectActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16
  },
  projectStatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  projectStatText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500'
  },
  projectTags: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8
  },
  projectTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  projectTagText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '500'
  },

  // Clean Club Card Styles
  cleanClubCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden'
  },
  clubMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16
  },
  clubIconBox: {
    backgroundColor: '#991B1B',
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  clubInfo: {
    flex: 1,
    marginRight: 8
  },
  clubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  clubDetails: {
    gap: 4
  },
  clubDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  clubDetailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1
  },
  clubDescription: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  clubDescriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  clubActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  clubActionButton: {
    backgroundColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6
  },
  clubActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  clubStats: {
    flexDirection: 'row',
    gap: 16
  },
  clubStatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  clubStatText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500'
  },
  clubTags: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8
  },
  clubTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  clubTagText: {
    color: '#3730a3',
    fontSize: 12,
    fontWeight: '500'
  },
  media: { width: '100%', height: 160 },
  cardBody: { padding: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingVertical: 10 },
  
  // Loading Screen Styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Comments Modal Styles
  commentsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  commentsModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
  },
  commentsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  commentsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  commentsModalClose: {
    padding: 4,
  },
  commentsScrollView: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#991B1B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  commentSendButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});