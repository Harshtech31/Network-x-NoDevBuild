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

export default function ProjectDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data - in real app this would come from API based on params.id
  const project = {
    id: Array.isArray(params.id) ? params.id[0] : params.id || '1',
    title: Array.isArray(params.title) ? params.title[0] : params.title || 'AI-Powered Study Assistant',
    status: Array.isArray(params.status) ? params.status[0] : params.status || 'recruiting',
    description: 'A comprehensive study assistant that uses AI to help students organize their learning materials, create personalized study plans, and track progress. Features include smart note-taking, quiz generation, and collaborative study groups.',
    longDescription: 'This project aims to revolutionize how students approach learning by leveraging artificial intelligence and machine learning. The platform will analyze study patterns, identify knowledge gaps, and provide personalized recommendations to improve learning outcomes.',
    technologies: ['React Native', 'Node.js', 'Python', 'TensorFlow', 'MongoDB', 'AWS'],
    teamSize: '4/6 members',
    duration: '6 months',
    startDate: 'March 2024',
    leader: {
      name: 'Alex Johnson',
      role: 'Project Lead',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&size=40&background=8B1A1A&color=fff'
    },
    team: [
      { name: 'Sarah Chen', role: 'Frontend Developer', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&size=40&background=059669&color=fff' },
      { name: 'Mike Rodriguez', role: 'Backend Developer', avatar: 'https://ui-avatars.com/api/?name=Mike+Rodriguez&size=40&background=DC2626&color=fff' },
      { name: 'Lisa Wang', role: 'UI/UX Designer', avatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&size=40&background=7C3AED&color=fff' },
    ],
    openRoles: [
      { title: 'ML Engineer', description: 'Experience with TensorFlow and Python required' },
      { title: 'Mobile Developer', description: 'React Native expertise needed' }
    ],
    milestones: [
      { title: 'Project Setup & Planning', status: 'completed', date: 'March 2024' },
      { title: 'Backend API Development', status: 'in-progress', date: 'April 2024' },
      { title: 'Frontend Implementation', status: 'pending', date: 'May 2024' },
      { title: 'AI Model Integration', status: 'pending', date: 'June 2024' },
      { title: 'Testing & Deployment', status: 'pending', date: 'July 2024' }
    ],
    updates: [
      {
        date: '2 days ago',
        author: 'Alex Johnson',
        content: 'Completed the initial database schema design. Ready to start backend development!'
      },
      {
        date: '1 week ago',
        author: 'Lisa Wang',
        content: 'Finished the wireframes and user flow diagrams. Check out the Figma link in our Discord.'
      },
      {
        date: '2 weeks ago',
        author: 'Sarah Chen',
        content: 'Set up the project repository and CI/CD pipeline. All team members have access now.'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#D1FAE5', text: '#065F46' };
      case 'recruiting': return { bg: '#FEF3C7', text: '#92400E' };
      case 'completed': return { bg: '#E0E7FF', text: '#3730A3' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in-progress': return 'play-circle';
      default: return 'ellipse-outline';
    }
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const renderOverview = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Project</Text>
        <Text style={styles.description}>{project.longDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technologies</Text>
        <View style={styles.techContainer}>
          {project.technologies.map((tech, index) => (
            <View key={index} style={styles.techChip}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{project.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Date:</Text>
          <Text style={styles.detailValue}>{project.startDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Team Size:</Text>
          <Text style={styles.detailValue}>{project.teamSize}</Text>
        </View>
      </View>
    </View>
  );

  const renderTeam = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Leader</Text>
        <View style={styles.memberCard}>
          <Image source={{ uri: project.leader.avatar }} style={styles.memberAvatar} />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{project.leader.name}</Text>
            <Text style={styles.memberRole}>{project.leader.role}</Text>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#8B1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        {project.team.map((member, index) => (
          <View key={index} style={styles.memberCard}>
            <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#8B1A1A" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Positions</Text>
        {project.openRoles.map((role, index) => (
          <View key={index} style={styles.roleCard}>
            <Text style={styles.roleTitle}>{role.title}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProgress = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Milestones</Text>
        {project.milestones.map((milestone, index) => (
          <View key={index} style={styles.milestoneItem}>
            <Ionicons 
              name={getMilestoneIcon(milestone.status)} 
              size={20} 
              color={getMilestoneColor(milestone.status)} 
            />
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneTitle}>{milestone.title}</Text>
              <Text style={styles.milestoneDate}>{milestone.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        {project.updates.map((update, index) => (
          <View key={index} style={styles.updateItem}>
            <View style={styles.updateHeader}>
              <Text style={styles.updateAuthor}>{update.author}</Text>
              <Text style={styles.updateDate}>{update.date}</Text>
            </View>
            <Text style={styles.updateContent}>{update.content}</Text>
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
        <Text style={styles.headerTitle}>Project Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Project Header */}
      <View style={styles.projectHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status).bg }]}>
            <Text style={[styles.statusText, { color: getStatusColor(project.status).text }]}>
              {project.status}
            </Text>
          </View>
        </View>
        <Text style={styles.projectDescription}>{project.description}</Text>
        
        <TouchableOpacity style={styles.joinButton}>
          <Ionicons name="person-add" size={18} color="#FFFFFF" />
          <Text style={styles.joinButtonText}>Join Project</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['overview', 'team', 'progress'].map((tab) => (
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'progress' && renderProgress()}
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
  projectHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  projectDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: '#8B1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
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
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  memberRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: '#8B1A1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  milestoneContent: {
    marginLeft: 12,
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  milestoneDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  updateItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  updateAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  updateDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  updateContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
