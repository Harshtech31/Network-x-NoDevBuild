import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoType, setPhotoType] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Pulse animation for profile image
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handleTabPress = (tab: string, index: number) => {
    setActiveTab(tab);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleSkillPress = (skill: string) => {
    // Add bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    console.log(`Navigating to ${skill} details`);
  };

  const handlePhotoPress = (type: string) => {
    setPhotoType(type);
    setShowPhotoModal(true);
  };

  const handleUniversityPress = (university: string) => {
    console.log(`Navigating to ${university} page`);
  };

  const renderOverview = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Computer Science student passionate about AI/ML and sustainable technology. Always looking for innovative projects that make a positive impact.
        </Text>
      </View>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'Data Science', 'UI/UX Design', 'Project Management'].map((skill) => (
            <Animated.View key={skill} style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity style={styles.skillChip} onPress={() => handleSkillPress(skill)}>
                <Text style={styles.skillText}>{skill}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Recent Projects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {[
          { title: 'Campus Sustainability Tracker', desc: 'AI-powered app to track and reduce campus carbon footprint', collaborators: 4, likes: 23, status: 'Active' },
          { title: 'Student Mental Health Platform', desc: 'Peer support platform with mood tracking and resources', collaborators: 5, likes: 31, status: 'Completed' }
        ].map((project, index) => (
          <TouchableOpacity key={index} style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={[styles.statusBadge, project.status === 'Active' ? styles.activeBadge : styles.completedBadge]}>
                <Text style={[styles.statusText, project.status === 'Active' ? styles.activeStatusText : styles.completedStatusText]}>
                  {project.status}
                </Text>
              </View>
            </View>
            <Text style={styles.projectDesc}>{project.desc}</Text>
            <View style={styles.projectStats}>
              <View style={styles.projectStat}>
                <Ionicons name="people-outline" size={14} color="#6B7280" />
                <Text style={styles.projectStatText}>{project.collaborators} collaborators</Text>
              </View>
              <View style={styles.projectStat}>
                <Ionicons name="heart-outline" size={14} color="#6B7280" />
                <Text style={styles.projectStatText}>{project.likes} likes</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color="#8B1A1A" />
            <Text style={styles.contactText}>alex.johnson@student.birmingham.ac.ae</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color="#8B1A1A" />
            <Text style={styles.contactText}>+971 50 123 4567</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <Ionicons name="globe-outline" size={16} color="#8B1A1A" />
            <Text style={styles.contactText}>alexjohnson.dev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <Ionicons name="logo-github" size={16} color="#8B1A1A" />
            <Text style={styles.contactText}>alexj_dev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <Ionicons name="logo-linkedin" size={16} color="#8B1A1A" />
            <Text style={styles.contactText}>alex-johnson-dev</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Academic Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic</Text>
        <View style={styles.academicContainer}>
          <View style={styles.academicItem}>
            <Text style={styles.academicLabel}>Year:</Text>
            <Text style={styles.academicValue}>3rd Year</Text>
          </View>
          <View style={styles.academicItem}>
            <Text style={styles.academicLabel}>Major:</Text>
            <Text style={styles.academicValue}>Computer Science</Text>
          </View>
          <View style={styles.academicItem}>
            <Text style={styles.academicLabel}>GPA:</Text>
            <Text style={styles.academicValue}>3.8/4.0</Text>
          </View>
        </View>
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {['Artificial Intelligence', 'Sustainability', 'Startups', 'Photography', 'Music'].map((interest) => (
            <View key={interest} style={styles.interestChip}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderProjects = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.projectsGrid}>
        {[1, 2, 3, 4].map((project) => (
          <TouchableOpacity key={project} style={styles.projectGridCard}>
            <View style={styles.projectImagePlaceholder}>
              <LinearGradient colors={['#ea580c', '#fed7aa']} style={styles.projectGradient} />
            </View>
            <View style={styles.projectContent}>
              <Text style={styles.projectTitle}>Campus Sustainability Tracker</Text>
              <Text style={styles.projectDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore... Read more
              </Text>
              <View style={styles.projectTags}>
                <View style={styles.projectTag}>
                  <Text style={styles.projectTagText}>AI</Text>
                </View>
                <View style={styles.projectTag}>
                  <Text style={styles.projectTagText}>Sustainability</Text>
                </View>
                <View style={styles.projectTag}>
                  <Text style={styles.projectTagText}>Mobile App</Text>
                </View>
              </View>
              <View style={styles.projectStatus}>
                <View style={[styles.statusBadge, styles.activeBadge]}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              <View style={styles.projectMetrics}>
                <View style={styles.metric}>
                  <Ionicons name="people-outline" size={14} color="#666666" />
                  <Text style={styles.metricText}>4</Text>
                </View>
                <View style={styles.metric}>
                  <Ionicons name="heart-outline" size={14} color="#666666" />
                  <Text style={styles.metricText}>23</Text>
                </View>
                <View style={styles.metric}>
                  <Ionicons name="chatbubble-outline" size={14} color="#666666" />
                  <Text style={styles.metricText}>6</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>see all projects</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEvents = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {[1, 2, 3].map((event) => (
        <TouchableOpacity key={event} style={styles.eventCard}>
          <View style={styles.eventImagePlaceholder} />
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>AI Workshop Series</Text>
            <Text style={styles.eventDate}>Aug 15, 2024</Text>
            <Text style={styles.eventAttendees}>45 attendees</Text>
          </View>
          <View style={styles.eventRole}>
            <Text style={styles.roleText}>Organizer</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>see all events</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPosts = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.postsContainer}>
        {[
          {
            id: '1',
            content: 'Just finished implementing a machine learning model for predicting student performance! Excited to share the results with the class. 🤖📊',
            timestamp: '2 hours ago',
            likes: 24,
            comments: 8,
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            content: 'Looking for teammates for the upcoming hackathon! Need someone with UI/UX skills and backend development experience. DM me if interested! 💻',
            timestamp: '1 day ago',
            likes: 15,
            comments: 12,
            image: null
          },
          {
            id: '3',
            content: 'Great workshop on sustainable technology today! Learned so much about renewable energy systems and their implementation in smart cities. 🌱⚡',
            timestamp: '3 days ago',
            likes: 31,
            comments: 6,
            image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop'
          }
        ].map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }}
                style={styles.postAvatar}
              />
              <View style={styles.postHeaderText}>
                <Text style={styles.postAuthor}>Alex Johnson</Text>
                <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="heart-outline" size={20} color="#6B7280" />
                <Text style={styles.postActionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text style={styles.postActionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="share-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderAchievements = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.achievementsGrid}>
        {[
          { title: "Dean's List", subtitle: "Fall 2023 Semester", icon: "trophy" },
          { title: "Hackathon Winner", subtitle: "Dubai Tech Challenge 2024", icon: "medal" },
          { title: "Research Publication", subtitle: "AI in Education Conference", icon: "book" },
          { title: "Club President", subtitle: "Tech Society 2024", icon: "ribbon" },
        ].map((achievement, index) => (
          <TouchableOpacity key={index} style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name={achievement.icon as any} size={24} color="#ea580c" />
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false} 
      />
      
      {/* Scrollable Profile Content */}
      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View style={[styles.profileHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.coverPhotoContainer}>
            <TouchableOpacity onPress={() => handlePhotoPress('cover')}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }}
                style={styles.coverPhoto}
              />
              <View style={styles.editCoverOverlay}>
                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => handlePhotoPress('profile')} style={styles.profileImageContainer}>
              <Animated.Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' }}
                style={[styles.profileImage, { transform: [{ scale: pulseAnim }] }]}
              />
              <View style={styles.editProfileImageOverlay}>
                <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.profileName}>Alex Johnson</Text>
            <Text style={styles.profileHandle}>@alexj_dev</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#7f1d1d" />
              <Text style={styles.profileLocation}>University of Birmingham Dubai</Text>
            </View>
            <View style={styles.joinedContainer}>
              <Ionicons name="calendar-outline" size={14} color="#7f1d1d" />
              <Text style={styles.joinedText}>Joined September 2023</Text>
            </View>
            
            <Text style={[styles.bioText, { marginBottom: 20 }]}>
              Computer Science Student passionate about AI/ML and sustainable technology. 
              Building the future one line of code at a time.
            </Text>
            
            <View style={[styles.actionButtons, { marginBottom: 4 }]}>
              <TouchableOpacity style={styles.editProfileBtn}>
                <Ionicons name="pencil-outline" size={16} color="#FFFFFF" />
                <Text style={styles.editProfileBtnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn}>
                <Ionicons name="share-outline" size={16} color="#8B1A1A" />
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Stats Row inside Profile Card */}
            <View style={[styles.statsContainer, { marginTop: 24 }]}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Collaborations</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>25</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
            </View>

            {/* Tab Navigation inside Profile Box */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabScrollView, { marginTop: 24 }]}>
              <View style={styles.tabNavigation}>
                {['overview', 'projects', 'posts', 'events', 'achievements'].map((tab, index) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                    onPress={() => handleTabPress(tab, index)}
                  >
                    <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animated.View>

        {/* Horizontal Swipeable Tab Content */}
        <View style={styles.swipeableContentContainer}>
          <FlatList
            ref={flatListRef}
            data={[
              { key: 'overview', component: renderOverview() },
              { key: 'projects', component: renderProjects() },
              { key: 'posts', component: renderPosts() },
              { key: 'events', component: renderEvents() },
              { key: 'achievements', component: renderAchievements() }
            ]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <ScrollView 
                style={styles.tabContentSwipeable}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {item.component}
                <View style={styles.bottomSpacing} />
              </ScrollView>
            )}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              const tabs = ['overview', 'projects', 'posts', 'events', 'achievements'];
              setActiveTab(tabs[index]);
            }}
          />
        </View>
      </ScrollView>

      {/* Photo Edit Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowPhotoModal(false)} />
          <Animated.View style={styles.photoModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              Edit {photoType === 'cover' ? 'Cover Photo' : 'Profile Photo'}
            </Text>
            
            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="camera-outline" size={24} color="#8B1A1A" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="image-outline" size={24} color="#8B1A1A" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
              <Text style={[styles.modalOptionText, { color: '#EF4444' }]}>Remove Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainScrollView: {
    flex: 1,
  },
  contentContainer: {
    height: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileHeaderSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  oldProjectCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    marginTop: -60,
    marginHorizontal: 20,
    zIndex: 1,
  },
  tabScrollView: {
    marginTop: 20,
    maxHeight: 50,
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
    minWidth: 100,
  },
  activeTabButton: {
    backgroundColor: '#7f1d1d',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  tabContent: {
    width: width,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fed7aa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  coverPhotoArea: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  coverGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7f1d1d',
    borderRadius: 12,
    padding: 6,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  profileHandle: {
    fontSize: 16,
    color: '#7f1d1d',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 14,
    color: '#7f1d1d',
    marginLeft: 5,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  joinedText: {
    fontSize: 14,
    color: '#7f1d1d',
    marginLeft: 5,
  },
  bioText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  editProfileBtn: {
    backgroundColor: '#7f1d1d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  shareBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  shareBtnText: {
    color: '#8B1A1A',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  projectGridCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectImagePlaceholder: {
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
  },
  projectGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  projectContent: {
    padding: 15,
  },
  projectDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
    lineHeight: 16,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  projectTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  projectTagText: {
    fontSize: 10,
    color: '#666666',
  },
  projectStatus: {
    marginBottom: 10,
  },
  projectMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#666666',
  },
  seeAllButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#ea580c',
    fontWeight: '500',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 15,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 4,
  },
  eventAttendees: {
    fontSize: 12,
    color: '#666666',
  },
  eventRole: {
    backgroundColor: '#fed7aa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  roleText: {
    fontSize: 12,
    color: '#7f1d1d',
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fed7aa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    backgroundColor: '#8B1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#8B1A1A',
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#10B981',
  },
  completedBadge: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#FFFFFF',
  },
  completedStatusText: {
    color: '#FFFFFF',
  },
  projectDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  projectStatText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  contactContainer: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  academicContainer: {
    marginTop: 8,
  },
  academicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  academicLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  academicValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  interestText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  photoModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalCancel: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  postsContainer: {
    paddingVertical: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderText: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  postTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  postActionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
  },
  coverPhotoContainer: {
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editCoverOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileImageOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#8B1A1A',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  swipeableContentContainer: {
    flex: 1,
    marginTop: 20,
  },
  tabContentSwipeable: {
    width: width,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});