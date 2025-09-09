import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
  BackHandler,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import RecentlySearchedCard from '../../components/RecentlySearchedCard';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAllPeople, setShowAllPeople] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllClubs, setShowAllClubs] = useState(false);
  const [postInteractions, setPostInteractions] = useState<{[key: string]: {liked: boolean, likes: number, comments: number}}>({});

  // Handle back button to return to previous state instead of home
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // If any section is expanded, collapse it and return to main search
        if (showAllPeople || showAllPosts || showAllProjects || showAllClubs) {
          setActiveCategory('All');
          setShowAllPeople(false);
          setShowAllPosts(false);
          setShowAllProjects(false);
          setShowAllClubs(false);
          return true; // Prevent default back action
        }
        return false; // Allow default back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [showAllPeople, showAllPosts, showAllProjects, showAllClubs])
  );

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  const handleFilterPress = () => {
    setShowFilter(!showFilter);
  };

  const handleSeeAllPeople = () => {
    if (showAllPeople) {
      // See Less - return to main search page
      setActiveCategory('All');
      setShowAllPeople(false);
    } else {
      // See All - show only people
      setActiveCategory('People');
      setShowAllPeople(true);
    }
  };

  const handleSeeAllPosts = () => {
    if (showAllPosts) {
      // See Less - return to main search page
      setActiveCategory('All');
      setShowAllPosts(false);
    } else {
      // See All - show only posts
      setActiveCategory('Posts');
      setShowAllPosts(true);
    }
  };

  const handleSeeAllProjects = () => {
    if (showAllProjects) {
      // See Less - return to main search page
      setActiveCategory('All');
      setShowAllProjects(false);
    } else {
      // See All - show only projects
      setActiveCategory('Projects');
      setShowAllProjects(true);
    }
  };

  const handleSeeAllClubs = () => {
    if (showAllClubs) {
      // See Less - return to main search page
      setActiveCategory('All');
      setShowAllClubs(false);
    } else {
      // See All - show only clubs
      setActiveCategory('Clubs');
      setShowAllClubs(true);
    }
  };

  const handlePersonPress = (person: any) => {
    router.push(`/PersonDetailScreen?id=${person.id}&name=${encodeURIComponent(person.name)}&field=${encodeURIComponent(person.field)}`);
  };

  const handlePostPress = (post: any) => {
    // TODO: Implement post detail view or expand inline
    console.log('Navigate to post:', post.content);
  };

  const handleProjectPress = (project: any) => {
    router.push(`/ProjectDetailScreen?id=${project.id}&title=${encodeURIComponent(project.title)}&status=${project.status}`);
  };

  const handleClubPress = (club: any) => {
    router.push(`/ClubDetailScreen?id=${club.id}&name=${encodeURIComponent(club.name)}&category=${encodeURIComponent(club.category)}`);
  };

  // Post interaction handlers
  const handleLikePost = (postId: string, currentLikes: number) => {
    setPostInteractions(prev => {
      const current = prev[postId] || { liked: false, likes: currentLikes, comments: 0 };
      return {
        ...prev,
        [postId]: {
          ...current,
          liked: !current.liked,
          likes: current.liked ? current.likes - 1 : current.likes + 1
        }
      };
    });
  };

  const handleCommentPost = (postId: string) => {
    // TODO: Open comment modal or navigate to post detail
    console.log('Comment on post:', postId);
  };

  const handleSharePost = (postId: string) => {
    // TODO: Open share modal
    console.log('Share post:', postId);
  };

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];
  const departments = ['Computer Science', 'AI/ML', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Electronics'];
  const categories = ['All', 'People', 'Posts', 'Projects', 'Clubs'];
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false} 
      />
      
      {/* Header with Search Bar */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={[styles.searchContainer, { marginTop: 32 }]}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search events, people, projects..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <Ionicons name="funnel-outline" size={20} color="#8B1A1A" />
          </TouchableOpacity>
        </View>

        {/* Modern Filter Panel */}
        {showFilter && (
          <Animated.View style={styles.filterPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterHeaderTitle}>Filter & Discover</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeFilterButton}>
                <Ionicons name="close" size={20} color="#8B1A1A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Category</Text>
              <View style={styles.filterGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.modernFilterChip, activeCategory === category && styles.modernFilterChipActive]}
                    onPress={() => setActiveCategory(category)}
                  >
                    <Text style={[styles.modernFilterChipText, activeCategory === category && styles.modernFilterChipTextActive]}>
                      {category}
                    </Text>
                    {activeCategory === category && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Academic Year</Text>
              <View style={styles.filterGrid}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.modernFilterChip, selectedYears.includes(year) && styles.modernFilterChipActive]}
                    onPress={() => {
                      if (selectedYears.includes(year)) {
                        setSelectedYears(selectedYears.filter(y => y !== year));
                      } else {
                        setSelectedYears([...selectedYears, year]);
                      }
                    }}
                  >
                    <Text style={[styles.modernFilterChipText, selectedYears.includes(year) && styles.modernFilterChipTextActive]}>
                      {year}
                    </Text>
                    {selectedYears.includes(year) && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Department</Text>
              <View style={styles.filterGrid}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.modernFilterChip, selectedDepartments.includes(dept) && styles.modernFilterChipActive]}
                    onPress={() => {
                      if (selectedDepartments.includes(dept)) {
                        setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                      } else {
                        setSelectedDepartments([...selectedDepartments, dept]);
                      }
                    }}
                  >
                    <Text style={[styles.modernFilterChipText, selectedDepartments.includes(dept) && styles.modernFilterChipTextActive]}>
                      {dept}
                    </Text>
                    {selectedDepartments.includes(dept) && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modernFilterActions}>
              <TouchableOpacity style={styles.modernClearButton} onPress={() => { setSelectedYears([]); setSelectedDepartments([]); setActiveCategory('All'); }}>
                <Ionicons name="refresh-outline" size={18} color="#6B7280" />
                <Text style={styles.modernClearButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modernApplyButton} onPress={() => setShowFilter(false)}>
                <LinearGradient
                  colors={['#8B1A1A', '#DC2626']}
                  style={styles.applyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                  <Text style={styles.modernApplyButtonText}>Find Matches</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Animated.View>


      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* LinkedIn-style Content Sections */}
        {(activeCategory === 'All' || activeCategory === 'People') && (
          <Animated.View style={[styles.sectionContainer, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>People</Text>
              <TouchableOpacity onPress={handleSeeAllPeople}>
                <Text style={styles.seeAllText}>{showAllPeople ? 'See less' : 'See all people'}</Text>
              </TouchableOpacity>
            </View>
            
            {[
              { id: '1', name: 'Sarah Chen', handle: '@sarah_cs', field: 'Computer Science • 3rd Year', location: 'Dubai, UAE', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', connections: '500+', mutual: 12 },
              { id: '2', name: 'Ahmed Hassan', handle: '@ahmed_dev', field: 'Computer Science • 4th Year', location: 'Dubai, UAE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', connections: '300+', mutual: 8 },
              { id: '3', name: 'Maria Rodriguez', handle: '@maria_ai', field: 'AI/ML • Graduate', location: 'Dubai, UAE', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', connections: '1000+', mutual: 15 }
            ].slice(0, activeCategory === 'People' || showAllPeople ? 10 : 2).map((person, index) => (
              <TouchableOpacity key={person.id} onPress={() => handlePersonPress(person)} activeOpacity={0.7}>
                <Animated.View style={[styles.personCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                  <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personField}>{person.field}</Text>
                    <Text style={styles.personLocation}>{person.location}</Text>
                    <Text style={styles.mutualConnections}>{person.mutual} mutual connections</Text>
                  </View>
                  <TouchableOpacity style={styles.connectButton} onPress={(e) => { e.stopPropagation(); }}>
                    <Ionicons name="person-add-outline" size={20} color="#8B1A1A" />
                  </TouchableOpacity>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {(activeCategory === 'All' || activeCategory === 'Posts') && (
          <Animated.View style={[styles.sectionContainer, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Posts</Text>
              <TouchableOpacity onPress={handleSeeAllPosts}>
                <Text style={styles.seeAllText}>{showAllPosts ? 'See less' : 'See all posts'}</Text>
              </TouchableOpacity>
            </View>
            
            {[
              { id: '1', author: 'Tech Society', content: 'Excited to announce our upcoming AI Workshop! Join us for hands-on learning with industry experts.', time: '2h', likes: 45, comments: 12, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400' },
              { id: '2', author: 'Sarah Chen', content: 'Just completed my machine learning project on predictive analytics. The results exceeded expectations!', time: '4h', likes: 23, comments: 8, image: null }
            ].slice(0, activeCategory === 'Posts' || showAllPosts ? 10 : 1).map((post, index) => (
              <TouchableOpacity key={post.id} onPress={() => handlePostPress(post)} activeOpacity={0.95}>
                <Animated.View style={[styles.postCard, { opacity: fadeAnim }]}>
                  <View style={styles.postHeader}>
                    <View style={styles.postAuthorInfo}>
                      <View style={styles.authorAvatar}>
                        <Text style={styles.authorInitial}>{post.author[0]}</Text>
                      </View>
                      <View>
                        <Text style={styles.postAuthor}>{post.author}</Text>
                        <Text style={styles.postTime}>{post.time} ago</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); }}>
                      <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.postContent}>{post.content}</Text>
                  {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
                  <View style={styles.postActions}>
                    <TouchableOpacity 
                      style={styles.postAction} 
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        handleLikePost(post.id, post.likes);
                      }}
                    >
                      <Ionicons 
                        name={postInteractions[post.id]?.liked ? "heart" : "heart-outline"} 
                        size={20} 
                        color={postInteractions[post.id]?.liked ? "#DC2626" : "#6B7280"} 
                      />
                      <Text style={[styles.postActionText, postInteractions[post.id]?.liked && { color: "#DC2626" }]}>
                        {postInteractions[post.id]?.likes ?? post.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.postAction} 
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        handleCommentPost(post.id);
                      }}
                    >
                      <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                      <Text style={styles.postActionText}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.postAction} 
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        handleSharePost(post.id);
                      }}
                    >
                      <Ionicons name="share-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {(activeCategory === 'All' || activeCategory === 'Projects') && (
          <Animated.View style={[styles.sectionContainer, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Projects</Text>
              <TouchableOpacity onPress={handleSeeAllProjects}>
                <Text style={styles.seeAllText}>{showAllProjects ? 'See less' : 'See all projects'}</Text>
              </TouchableOpacity>
            </View>
            
            {[
              { id: '1', title: 'AI-Powered Campus Navigation', description: 'Smart navigation system using machine learning to optimize routes across campus', tech: ['React Native', 'Python', 'TensorFlow'], team: 4, status: 'Active' },
              { id: '2', title: 'Sustainable Energy Monitor', description: 'IoT-based system to track and optimize energy consumption in university buildings', tech: ['IoT', 'Node.js', 'MongoDB'], team: 3, status: 'Recruiting' }
            ].slice(0, activeCategory === 'Projects' || showAllProjects ? 10 : 1).map((project, index) => (
              <TouchableOpacity key={project.id} onPress={() => handleProjectPress(project)} activeOpacity={0.7}>
                <Animated.View style={[styles.projectCard, { opacity: fadeAnim }]}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <View style={[styles.projectStatus, project.status === 'Active' ? styles.statusActive : styles.statusRecruiting]}>
                      <Text style={[styles.statusText, project.status === 'Active' ? styles.statusActiveText : styles.statusRecruitingText]}>
                        {project.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.projectDescription}>{project.description}</Text>
                  <View style={styles.projectTech}>
                    {project.tech.map((tech, i) => (
                      <View key={i} style={styles.techChip}>
                        <Text style={styles.techText}>{tech}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.projectFooter}>
                    <Text style={styles.teamSize}>{project.team} team members</Text>
                    <TouchableOpacity style={styles.joinButton} onPress={(e) => { e.stopPropagation(); }}>
                      <Text style={styles.joinButtonText}>Join Project</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {(activeCategory === 'All' || activeCategory === 'Clubs') && (
          <Animated.View style={[styles.sectionContainer, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Clubs</Text>
              <TouchableOpacity onPress={handleSeeAllClubs}>
                <Text style={styles.seeAllText}>{showAllClubs ? 'See less' : 'See all clubs'}</Text>
              </TouchableOpacity>
            </View>
            
            {[
              { id: '1', name: 'Tech Society', description: 'Leading technology club focused on innovation and skill development', members: 250, category: 'Technology', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400' },
              { id: '2', name: 'Entrepreneurship Club', description: 'Supporting student entrepreneurs and startup initiatives', members: 180, category: 'Business', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400' }
            ].slice(0, activeCategory === 'Clubs' || showAllClubs ? 10 : 1).map((club, index) => (
              <TouchableOpacity key={club.id} onPress={() => handleClubPress(club)} activeOpacity={0.7}>
                <Animated.View style={[styles.clubCard, { opacity: fadeAnim }]}>
                  <Image source={{ uri: club.image }} style={styles.clubImage} />
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{club.name}</Text>
                    <Text style={styles.clubCategory}>{club.category}</Text>
                    <Text style={styles.clubDescription}>{club.description}</Text>
                    <Text style={styles.clubMembers}>{club.members} members</Text>
                  </View>
                  <TouchableOpacity style={styles.followButton} onPress={(e) => { e.stopPropagation(); }}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  filterPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterScrollView: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#8B1A1A',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeFilterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modernFilterChip: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modernFilterChipActive: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
    shadowColor: '#8B1A1A',
    shadowOpacity: 0.3,
    elevation: 3,
  },
  modernFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  modernFilterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  modernFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chipIcon: {
    marginLeft: 6,
  },
  modernFilterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  modernClearButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modernClearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  modernApplyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  modernApplyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // LinkedIn-style section styles
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#8B1A1A',
    fontSize: 14,
    fontWeight: '600',
  },

  // People section styles
  personCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  personField: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  personLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  mutualConnections: {
    fontSize: 12,
    color: '#8B1A1A',
    fontWeight: '500',
  },
  connectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  // Posts section styles
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#6B7280',
  },

  // Projects section styles
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  projectStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusRecruiting: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusActiveText: {
    color: '#065F46',
  },
  statusRecruitingText: {
    color: '#92400E',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  projectTech: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  techChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  techText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamSize: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  joinButton: {
    backgroundColor: '#8B1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Clubs section styles
  clubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  clubImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  clubInfo: {
    marginBottom: 12,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  clubCategory: {
    fontSize: 12,
    color: '#8B1A1A',
    fontWeight: '500',
    marginBottom: 6,
  },
  clubDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  clubMembers: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  followButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#8B1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});