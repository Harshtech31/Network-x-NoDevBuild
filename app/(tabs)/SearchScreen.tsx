import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchScreen() {
  const router = useRouter();

  const handleCollaborationPress = () => {
    // This will navigate to the new screen. The route will be valid once the file is created.
    router.push('/collaboration-cards');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects, people, or topics"
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Option Button */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleCollaborationPress}
          accessibilityLabel="View Collaborations"
          activeOpacity={0.8}
        >
          <Text style={styles.optionButtonText}>Collaborations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0', // Consistent app background
  },
  content: {
    padding: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Subtle background
    borderRadius: 24, // Rounded style
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%', // Full width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111111',
  },
  optionButton: {
    marginTop: 24,
    backgroundColor: '#8B1A1A', // Accent color
    borderRadius: 24, // Pill shaped
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // Centered
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});