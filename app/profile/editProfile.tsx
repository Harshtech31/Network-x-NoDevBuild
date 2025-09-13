import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useCallback, useMemo } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    handle: '@alexj_dev',
    college: 'University of Birmingham Dubai',
    joinedDate: 'September 2023',
    bio: 'Computer Science student passionate about AI and sustainable technology. Building innovative solutions for tomorrow\'s challenges.',
    about: 'Computer Science student passionate about AI/ML and sustainable technology. Always looking for innovative projects that make a positive impact.',
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'Data Science', 'UI/UX Design', 'Project Management'],
    contact: {
      email: 'alex.johnson@student.birmingham.ac.ae',
      phone: '+971 50 123 4567',
      website: 'alexjohnson.dev',
      github: 'alexj_dev',
      linkedin: 'alex-johnson-dev'
    },
    academic: {
      year: '3rd Year',
      major: 'Computer Science',
      gpa: '3.8/4.0'
    },
    interests: ['Artificial Intelligence', 'Sustainability', 'Startups', 'Photography', 'Music']
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleSave = useCallback(() => {
    // Here you would typically save to backend/storage
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  }, []);

  const handleAddSkill = useCallback(() => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  }, [newSkill, profileData.skills]);

  const handleRemoveSkill = useCallback((skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }, []);

  const handleAddInterest = useCallback(() => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  }, [newInterest, profileData.interests]);

  const handleRemoveInterest = useCallback((interestToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fef2f2" />
        
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#7f1d1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.name}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Handle</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.handle}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, handle: text }))}
              placeholder="@username"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>College/University</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.college}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, college: text }))}
              placeholder="Enter your college name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Joined Date</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.joinedDate}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, joinedDate: text }))}
              placeholder="Month Year"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio Description</Text>
            <TextInput
              style={[styles.textInput, styles.largeBioInput]}
              value={profileData.bio}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
              placeholder="Write a short bio about yourself"
              multiline
              numberOfLines={5}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.textInput, styles.largeAboutInput]}
              value={profileData.about}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, about: text }))}
              placeholder="Tell others about yourself, your interests, and what you're passionate about"
              multiline
              numberOfLines={6}
            />
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.addItemContainer}>
            <TextInput
              style={[styles.textInput, styles.addItemInput]}
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Add a new skill"
              onSubmitEditing={handleAddSkill}
            />
            <TouchableOpacity onPress={handleAddSkill} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chipsContainer}>
            {profileData.skills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
                <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.contact.email}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                contact: { ...prev.contact, email: text }
              }))}
              placeholder="your.email@example.com"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.contact.phone}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                contact: { ...prev.contact, phone: text }
              }))}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.contact.website}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                contact: { ...prev.contact, website: text }
              }))}
              placeholder="yourwebsite.com"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GitHub Username</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.contact.github}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                contact: { ...prev.contact, github: text }
              }))}
              placeholder="github_username"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LinkedIn Profile</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.contact.linkedin}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                contact: { ...prev.contact, linkedin: text }
              }))}
              placeholder="linkedin-profile-name"
            />
          </View>
        </View>

        {/* Academic Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Academic Year</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.academic.year}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                academic: { ...prev.academic, year: text }
              }))}
              placeholder="e.g., 3rd Year, Graduate, etc."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Major/Field of Study</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.academic.major}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                academic: { ...prev.academic, major: text }
              }))}
              placeholder="Computer Science, Engineering, etc."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GPA</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.academic.gpa}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                academic: { ...prev.academic, gpa: text }
              }))}
              placeholder="3.8/4.0"
            />
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.addItemContainer}>
            <TextInput
              style={[styles.textInput, styles.addItemInput]}
              value={newInterest}
              onChangeText={setNewInterest}
              placeholder="Add a new interest"
              onSubmitEditing={handleAddInterest}
            />
            <TouchableOpacity onPress={handleAddInterest} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chipsContainer}>
            {profileData.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
                <TouchableOpacity onPress={() => handleRemoveInterest(interest)}>
                  <Ionicons name="close" size={16} color="#92400E" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 41,
    backgroundColor: '#fef2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#7f1d1d',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.1)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  largeBioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  largeAboutInput: {
    height: 140,
    textAlignVertical: 'top',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemInput: {
    flex: 1,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#991B1B',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 6,
  },
  interestChip: {
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 6,
  },
  bottomSpacing: {
    height: 40,
  },
});
