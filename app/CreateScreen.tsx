import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const INTEREST_TAGS = ['Technology', 'Business', 'Sustainability', 'Research', 'Arts', 'Sports'];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
];

const LOCATIONS = [
  'Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE', 'Ajman, UAE', 
  'Remote', 'Hybrid', 'On Campus', 'Innovation Hub'
];

export default function CreatePostScreen() {
  const router = useRouter();
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const isPostButtonEnabled = postText.trim().length > 0 || image !== null;

  const pickImage = () => {
    setShowImagePicker(true);
  };

  const selectImage = (imageUrl: string) => {
    setImage(imageUrl);
    setShowImagePicker(false);
  };

  const selectLocation = (location: string) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePost = () => {
    setShowSuccessAnimation(true);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide animation and navigate back after delay
    setTimeout(() => {
      setShowSuccessAnimation(false);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      slideAnim.setValue(50);
      router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B1A1A" />
      
      {/* Header with gradient */}
      <LinearGradient colors={['#8B1A1A', '#A52A2A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity 
          style={[styles.postButton, !isPostButtonEnabled && styles.postButtonDisabled]} 
          disabled={!isPostButtonEnabled}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <TouchableOpacity style={styles.audienceSelector}>
              <Text style={styles.audienceText}>Public</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.textInput}
          multiline
          placeholder="What do you want to share?"
          value={postText}
          onChangeText={setPostText}
        />

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
              <Ionicons name="close-circle" size={24} color="#111111" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.extrasRow}>
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image-outline" size={28} color="#8B1A1A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowLocationPicker(true)}>
            <Ionicons name="location-outline" size={28} color="#8B1A1A" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="stats-chart-outline" size={28} color="#D1D5DB" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="document-attach-outline" size={28} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Selected Location Display */}
        {selectedLocation && (
          <View style={styles.selectedLocationContainer}>
            <Ionicons name="location" size={16} color="#8B1A1A" />
            <Text style={styles.selectedLocationText}>{selectedLocation}</Text>
            <TouchableOpacity onPress={() => setSelectedLocation('')}>
              <Ionicons name="close-circle" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tagsSection}>
          <Text style={styles.tagsHeader}>Add Tags/Interests</Text>
          <View style={styles.tagsContainer}>
            {INTEREST_TAGS.map(tag => (
              <TouchableOpacity 
                key={tag} 
                style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipSelected]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal visible={showImagePicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowImagePicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Image</Text>
            <View style={{ width: 60 }} />
          </View>
          <FlatList
            data={SAMPLE_IMAGES}
            numColumns={2}
            contentContainerStyle={styles.imageGrid}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.imageOption} onPress={() => selectImage(item)}>
                <Image source={{ uri: item }} style={styles.imageOptionPreview} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </Modal>

      {/* Location Picker Modal */}
      <Modal visible={showLocationPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.locationList}>
            {LOCATIONS.map((location, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.locationOption}
                onPress={() => selectLocation(location)}
              >
                <Ionicons name="location-outline" size={20} color="#8B1A1A" />
                <Text style={styles.locationText}>{location}</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Success Animation Modal */}
      <Modal visible={showSuccessAnimation} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <Animated.View 
            style={[
              styles.successContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            <LinearGradient colors={['#8B1A1A', '#A52A2A']} style={styles.successGradient}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons name="checkmark-circle" size={60} color="white" />
              </Animated.View>
              <Text style={styles.successTitle}>Post Created!</Text>
              <Text style={styles.successMessage}>Your post has been shared successfully</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerButtonText: { fontSize: 16, color: 'white', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: 'white' },
  postButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  postButtonDisabled: { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)' },
  postButtonText: { color: '#FFFFFF', fontWeight: '600' },
  scrollView: { padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  audienceSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  audienceText: { marginRight: 4, color: '#374151' },
  textInput: { fontSize: 18, minHeight: 120, textAlignVertical: 'top', color: '#374151', backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  imagePreviewContainer: { marginTop: 16, position: 'relative' },
  imagePreview: { width: '100%', height: 200, borderRadius: 12 },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 12, padding: 4 },
  extrasRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 16, backgroundColor: 'white', borderRadius: 12, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  selectedLocationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 12, alignSelf: 'flex-start', gap: 6 },
  selectedLocationText: { color: '#8B1A1A', fontSize: 14, fontWeight: '500' },
  tagsSection: { marginTop: 20 },
  tagsHeader: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#374151' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tagChip: { backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#8B1A1A' },
  tagChipSelected: { backgroundColor: '#8B1A1A' },
  tagText: { color: '#8B1A1A', fontWeight: '500' },
  tagTextSelected: { color: '#FFFFFF' },
  modalContainer: { flex: 1, backgroundColor: 'white' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalCancelText: { fontSize: 16, color: '#8B1A1A', fontWeight: '500' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#374151' },
  imageGrid: { padding: 20 },
  imageOption: { flex: 1, margin: 8, aspectRatio: 1, borderRadius: 12, overflow: 'hidden' },
  imageOptionPreview: { width: '100%', height: '100%' },
  locationList: { flex: 1, padding: 20 },
  locationOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 8, gap: 12 },
  locationText: { flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' },
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  successContainer: { margin: 40, borderRadius: 20, overflow: 'hidden' },
  successGradient: { paddingVertical: 40, paddingHorizontal: 30, alignItems: 'center' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 16, marginBottom: 8 },
  successMessage: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
});
