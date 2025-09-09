import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';

interface Document {
  name: string;
  uri: string;
  size: number;
  mimeType: string;
}

export default function CreateScreen() {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [attachedDocuments, setAttachedDocuments] = useState<Document[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const tagInputRef = useRef<TextInput>(null);

  const predefinedTags = [
    'Technology', 'Business', 'Health', 'Education', 'Travel',
    'Food', 'Sports', 'Entertainment', 'Science', 'Art'
  ];

  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
    'Dallas, TX', 'San Jose, CA'
  ];

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const selectLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(prev => prev.filter(loc => loc !== location));
    } else {
      setSelectedLocations(prev => [...prev, location]);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags([...selectedTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const removeLocation = (location: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== location));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const createPoll = () => {
    if (pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2) {
      setShowPollModal(false);
    }
  };

  const removeDocument = (index: number) => {
    setAttachedDocuments(attachedDocuments.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    setShowSuccessAnimation(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setShowSuccessAnimation(false);
      setPostText('');
      setImages([]);
      setSelectedTags([]);
      setSelectedLocations([]);
      setPollQuestion('');
      setPollOptions(['', '']);
      setAttachedDocuments([]);
      setCustomTagInput('');
      
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      slideAnim.setValue(50);
    }, 2500);
  };

  const handleDocumentPress = () => {
    setShowDocumentModal(true);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newDocument: Document = {
          name: asset.name,
          uri: asset.uri,
          size: asset.size || 0,
          mimeType: asset.mimeType || 'application/octet-stream',
        };
        setAttachedDocuments([...attachedDocuments, newDocument]);
        setShowDocumentModal(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const scrollToTagInput = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const isPostButtonEnabled = postText.trim().length > 0 || images.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New post</Text>
        <TouchableOpacity 
          onPress={handlePost}
          disabled={!isPostButtonEnabled}
          style={[styles.postButton, !isPostButtonEnabled && styles.postButtonDisabled]}
        >
          <Text style={[styles.postButtonText, !isPostButtonEnabled && styles.postButtonTextDisabled]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.username}>John Doe</Text>
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          value={postText}
          onChangeText={setPostText}
          multiline
          textAlignVertical="top"
        />

        {/* Image Preview */}
        {images.length > 0 && (
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Poll Preview */}
        {pollQuestion.trim() && (
          <View style={styles.pollContainer}>
            <Text style={styles.pollQuestion}>{pollQuestion}</Text>
            {pollOptions.filter(opt => opt.trim()).map((option, index) => (
              <View key={index} style={styles.pollOption}>
                <Text style={styles.pollOptionText}>{option}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.removePollButton}
              onPress={() => {
                setPollQuestion('');
                setPollOptions(['', '']);
              }}
            >
              <Text style={styles.removePollText}>Remove Poll</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Documents Preview */}
        {attachedDocuments.length > 0 && (
          <View style={styles.documentsContainer}>
            {attachedDocuments.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <Ionicons name="document-text" size={24} color="#8B1A1A" />
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentSize}>
                    {(doc.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeDocument(index)}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Location Preview */}
        {selectedLocations.length > 0 && (
          <View style={styles.locationContainer}>
            {selectedLocations.map((location, index) => (
              <View key={index} style={styles.locationChip}>
                <Ionicons name="location" size={16} color="#8B1A1A" />
                <Text style={styles.locationText}>{location}</Text>
                <TouchableOpacity onPress={() => removeLocation(location)}>
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImageFromGallery}>
            <Ionicons name="image" size={24} color="#8B1A1A" />
            <Text style={styles.actionButtonLabel}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowLocationModal(true)}>
            <Ionicons name="location" size={24} color="#8B1A1A" />
            <Text style={styles.actionButtonLabel}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowPollModal(true)}>
            <Ionicons name="bar-chart" size={24} color="#8B1A1A" />
            <Text style={styles.actionButtonLabel}>Poll</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDocumentPress}>
            <Ionicons name="document" size={24} color="#8B1A1A" />
            <Text style={styles.actionButtonLabel}>Document</Text>
          </TouchableOpacity>
        </View>

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Add tags</Text>
          
          {/* Custom Tag Input */}
          <View style={styles.customTagContainer}>
            <TextInput
              ref={tagInputRef}
              style={styles.customTagInput}
              placeholder="Type a custom tag..."
              placeholderTextColor="#999"
              value={customTagInput}
              onChangeText={setCustomTagInput}
              onSubmitEditing={addCustomTag}
              onFocus={scrollToTagInput}
              returnKeyType="done"
            />
            {customTagInput.trim() && (
              <TouchableOpacity style={styles.addTagButton} onPress={addCustomTag}>
                <Ionicons name="add" size={20} color="#8B1A1A" />
              </TouchableOpacity>
            )}
          </View>

          {/* Predefined Tags */}
          <View style={styles.tagsContainer}>
            {predefinedTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  selectedTags.includes(tag) && styles.tagChipSelected
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextSelected
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected Custom Tags */}
          {selectedTags.filter(tag => !predefinedTags.includes(tag)).length > 0 && (
            <View style={styles.tagsContainer}>
              {selectedTags.filter(tag => !predefinedTags.includes(tag)).map((tag) => (
                <View key={tag} style={styles.customTagChip}>
                  <Text style={styles.customTagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Location Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.locationList}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.locationItem,
                    selectedLocations.includes(location) && styles.locationItemSelected
                  ]}
                  onPress={() => selectLocation(location)}
                >
                  <Text style={[
                    styles.locationItemText,
                    selectedLocations.includes(location) && styles.locationItemTextSelected
                  ]}>
                    {location}
                  </Text>
                  {selectedLocations.includes(location) && (
                    <Ionicons name="checkmark" size={20} color="#8B1A1A" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Poll Modal */}
      <Modal visible={showPollModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Poll</Text>
              <TouchableOpacity onPress={() => setShowPollModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pollModalContent}>
              <TextInput
                style={styles.pollQuestionInput}
                placeholder="Ask a question..."
                placeholderTextColor="#999"
                value={pollQuestion}
                onChangeText={setPollQuestion}
                multiline
              />
              {pollOptions.map((option, index) => (
                <View key={index} style={styles.pollOptionContainer}>
                  <TextInput
                    style={styles.pollOptionInput}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor="#999"
                    value={option}
                    onChangeText={(value) => updatePollOption(index, value)}
                  />
                  {pollOptions.length > 2 && (
                    <TouchableOpacity onPress={() => removePollOption(index)}>
                      <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {pollOptions.length < 4 && (
                <TouchableOpacity style={styles.addOptionButton} onPress={addPollOption}>
                  <Ionicons name="add" size={20} color="#8B1A1A" />
                  <Text style={styles.addOptionText}>Add option</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.createPollButton} onPress={createPoll}>
                <Text style={styles.createPollText}>Create Poll</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <Modal transparent visible={showSuccessAnimation}>
          <View style={styles.successOverlay}>
            <Animated.View
              style={[
                styles.successModal,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    { translateY: slideAnim }
                  ]
                }
              ]}
            >
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              <Text style={styles.successTitle}>Post Created!</Text>
              <Text style={styles.successSubtitle}>Your post has been shared successfully</Text>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Document Picker Modal */}
      <Modal visible={showDocumentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Attach Document</Text>
              <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.documentOptions}>
              <TouchableOpacity style={styles.documentOption} onPress={pickDocument}>
                <Ionicons name="document" size={32} color="#8B1A1A" />
                <Text style={styles.documentOptionText}>Browse Files</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  postButton: {
    backgroundColor: '#8B1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  pollOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pollOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  removePollButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  removePollText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  documentsContainer: {
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  documentSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  locationText: {
    fontSize: 14,
    color: '#8B1A1A',
    marginLeft: 4,
    marginRight: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  actionButton: {
    padding: 8,
    alignItems: 'center',
  },
  actionButtonLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  tagsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  customTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  customTagInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  addTagButton: {
    padding: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagChipSelected: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  customTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  customTagText: {
    fontSize: 14,
    color: '#8B1A1A',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationList: {
    maxHeight: 400,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locationItemSelected: {
    backgroundColor: '#FEF2F2',
  },
  locationItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  locationItemTextSelected: {
    color: '#8B1A1A',
    fontWeight: '500',
  },
  pollModalContent: {
    padding: 16,
    maxHeight: 400,
  },
  pollQuestionInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollOptionInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#8B1A1A',
    borderStyle: 'dashed',
  },
  addOptionText: {
    color: '#8B1A1A',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  createPollButton: {
    backgroundColor: '#8B1A1A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createPollText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  documentOptions: {
    padding: 20,
  },
  documentOption: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  documentOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B1A1A',
    marginTop: 8,
  },
});

// Install expo-document-picker: npx expo install expo-document-picker