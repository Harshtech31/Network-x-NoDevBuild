import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
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
} from 'react-native';

const INTEREST_TAGS = ['Technology', 'Business', 'Sustainability', 'Research', 'Arts', 'Sports'];

export default function CreatePostScreen() {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const isPostButtonEnabled = postText.trim().length > 0 || image !== null;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.headerButtonText}>Cancel</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity style={[styles.postButton, !isPostButtonEnabled && styles.postButtonDisabled]} disabled={!isPostButtonEnabled}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

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
          <TouchableOpacity onPress={pickImage}><Ionicons name="image-outline" size={28} color="#6B7280" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="location-outline" size={28} color="#6B7280" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="stats-chart-outline" size={28} color="#D1D5DB" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="document-attach-outline" size={28} color="#D1D5DB" /></TouchableOpacity>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerButtonText: { fontSize: 16, color: '#6B7280' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  postButton: { backgroundColor: '#8B1A1A', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  postButtonDisabled: { backgroundColor: '#FCA5A5' },
  postButtonText: { color: '#FFFFFF', fontWeight: '600' },
  scrollView: { padding: 16 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  audienceSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  audienceText: { marginRight: 4, color: '#374151' },
  textInput: { fontSize: 18, minHeight: 120, textAlignVertical: 'top' },
  imagePreviewContainer: { marginTop: 16, position: 'relative' },
  imagePreview: { width: '100%', height: 200, borderRadius: 12 },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12 },
  extrasRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 16 },
  tagsSection: { marginTop: 16 },
  tagsHeader: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tagChip: { backgroundColor: '#FFEDD5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  tagChipSelected: { backgroundColor: '#9A3412' },
  tagText: { color: '#9A3412', fontWeight: '500' },
  tagTextSelected: { color: '#FFFFFF' },
});