import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProfileHeaderCard } from '@/components/ProfileHeaderCard';

const { width } = Dimensions.get('window');

// Mock data for demonstration purposes
const PROFILE_DATA = {
  name: 'Alex Doe',
  username: 'alexdoe',
  university: 'Stanford University',
  joinedDate: '2023',
  bio: 'Computer Science student passionate about AI and mobile development. Building the future one line of code at a time.',
  stats: [
    { value: '12', label: 'Projects' },
    { value: '8', label: 'Collaborations' },
    { value: '25', label: 'Events' },
    { value: '156', label: 'Connections' },
  ],
};

// Dummy components for tab content to keep the example clean
const OverviewTab = () => <Text style={styles.tabContentText}>Overview Content Here</Text>;
const ProjectsTab = () => <Text style={styles.tabContentText}>Projects Content Here</Text>;
const EventsTab = () => <Text style={styles.tabContentText}>Events Content Here</Text>;
const AchievementsTab = () => <Text style={styles.tabContentText}>Achievements Content Here</Text>;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Projects', 'Events', 'Achievements'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Projects':
        return <ProjectsTab />;
      case 'Events':
        return <EventsTab />;
      case 'Achievements':
        return <AchievementsTab />;
      case 'Overview':
      default:
        return <OverviewTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image and Avatar */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/400x150' }} // Placeholder
            style={styles.coverImage}
          />
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Main Content Area with Padding */}
        <View style={styles.contentArea}>
          {/* Profile Card with Stats */}
          <ProfileHeaderCard
            name={PROFILE_DATA.name}
            username={PROFILE_DATA.username}
            university={PROFILE_DATA.university}
            joinedDate={PROFILE_DATA.joinedDate}
            bio={PROFILE_DATA.bio}
            stats={PROFILE_DATA.stats}
            onEditPress={() => console.log('Edit pressed')}
            onSharePress={() => console.log('Share pressed')}
          />

          {/* Pill Tabs */}
          <View style={styles.pillTabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.pillTab, activeTab === tab && styles.activePillTab]}
                onPress={() => setActiveTab(tab)}
                accessibilityLabel={`Select ${tab} tab`}
              >
                <Text style={[styles.pillTabText, activeTab === tab && styles.activePillTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>{renderTabContent()}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0', // off-white background from design tokens
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100, // Ensure content isn't hidden by the bottom tab bar
  },
  headerContainer: {
    height: 200,
    marginBottom: 60, // Space for the overlapping avatar
  },
  coverImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 130,
    left: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF7F0', // Match the screen background for a seamless look
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  contentArea: {
    paddingHorizontal: 16,
    paddingTop: 8,      // 8px top padding as requested
    paddingBottom: 8,   // 8px bottom padding as requested
  },
  pillTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6', // Light gray background for the container
    borderRadius: 20,
    padding: 4,
    marginTop: 16, // Spacing between card and pills
  },
  pillTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePillTab: {
    backgroundColor: '#8B1A1A', // primary color
  },
  pillTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280', // muted text
  },
  activePillTabText: {
    color: '#FFFFFF', // white text
  },
  tabContentContainer: {
    marginTop: 24,
    minHeight: 200, // Example height to ensure there's content to see
  },
  tabContentText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
  },
});