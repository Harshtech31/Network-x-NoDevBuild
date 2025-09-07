import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolate, 
  runOnJS 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;

// Type definition for a collaborator
type Collaborator = {
  id: string;
  name: string;
  posted: string;
  badge: string;
  avatar: string;
  projectTitle: string;
  description: string;
  skills: string[];
  details: string[];
  commitment: string;
  tags: string[];
};

const COLLABORATORS_DATA: Collaborator[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    posted: '2 days ago',
    badge: 'Research',
    avatar: 'https://i.pravatar.cc/150?u=sarahchen',
    projectTitle: 'Sustainable Campus Initiative',
    description: 'Looking for environmental science students to develop eco-friendly solutions for our campus. We\'re working on waste reduction, energy efficiency, and green transportation options.',
    skills: ['Environmental Science', 'Data Analysis', 'Project Management', 'Research'],
    details: ['3–6 months', 'Hybrid', '4–6 people', 'Beginner friendly'],
    commitment: '10–15 hours/week',
    tags: ['#Sustainability', '#Research', '#Impact'],
  },
  {
    id: '2',
    name: 'David Lee',
    posted: '5 days ago',
    badge: 'Development',
    avatar: 'https://i.pravatar.cc/150?u=davidlee',
    projectTitle: 'AI-Powered Tutoring App',
    description: 'Seeking React Native developers to build a mobile app that uses AI for personalized learning. Experience with TypeScript is a plus.',
    skills: ['React Native', 'TypeScript', 'Firebase', 'UI/UX Design'],
    details: ['6–9 months', 'Remote', '2–3 people', 'Intermediate'],
    commitment: '15–20 hours/week',
    tags: ['#Edutech', '#MobileDev', '#AI'],
  },
];

const DetailRow = ({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={16} color="#6B7280" style={styles.detailIcon} />
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const CollaboratorCard = ({ user, onSwipe }: { user: Collaborator; onSwipe: (direction: number) => void }) => {
  const translateX = useSharedValue(0);

    const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2], [-15, 15], Extrapolate.CLAMP);
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

    const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    translateX.value = event.nativeEvent.translationX;
  };

    const onEnded = (event: any) => {
    if (Math.abs(event.nativeEvent.translationX) > SWIPE_THRESHOLD) {
      translateX.value = withSpring(Math.sign(event.nativeEvent.translationX) * SCREEN_WIDTH, {}, () => {
        runOnJS(onSwipe)(Math.sign(event.nativeEvent.translationX));
      });
    } else {
      translateX.value = withSpring(0);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onEnded}>
            <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.posted}>{user.posted}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{user.badge}</Text>
          </View>
        </View>
        <Text style={styles.projectTitle}>{user.projectTitle}</Text>
        <Text style={styles.description}>{user.description}</Text>
        <Text style={styles.sectionTitle}>Skills Needed</Text>
        <View style={styles.skillsContainer}>
          {user.skills.map((skill: string) => <View key={skill} style={styles.skillChip}><Text style={styles.skillText}>{skill}</Text></View>)}
        </View>
        <View style={styles.detailsGrid}>
          <DetailRow icon="time-outline" text={user.details[0]} />
          <DetailRow icon="location-outline" text={user.details[1]} />
          <DetailRow icon="people-outline" text={user.details[2]} />
          <DetailRow icon="school-outline" text={user.details[3]} />
        </View>
        <DetailRow icon="hourglass-outline" text={user.commitment} />
        <View style={styles.tagsContainer}>
          {user.tags.map((tag: string) => <Text key={tag} style={styles.tagText}>{tag}</Text>)}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default function CollaborationCardsScreen() {
  const router = useRouter();
  const [users, setUsers] = useState(COLLABORATORS_DATA);

  const onSwipe = (direction: number) => {
    console.log(`Swiped ${direction > 0 ? 'right (like)' : 'left (reject)'}`);
    setUsers(currentUsers => currentUsers.slice(1));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collaborator Swipe Cards</Text>
        </View>

        <View style={styles.cardStack}>
          {users.map((user) => (
            <CollaboratorCard key={user.id} user={user} onSwipe={onSwipe} />
          )).reverse()}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={[styles.bottomBarButton, styles.dismissButton]} onPress={() => onSwipe(-1)}>
            <Ionicons name="close" size={32} color="#8B1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomBarButton, styles.saveButton]} onPress={() => onSwipe(1)}>
            <Ionicons name="heart" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  cardStack: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -50 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, width: SCREEN_WIDTH * 0.9, position: 'absolute', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  headerText: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  posted: { fontSize: 14, color: '#6B7280' },
  badgeContainer: { backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#92400E', fontWeight: '500' },
  projectTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  skillChip: { backgroundColor: '#E0E7FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  skillText: { color: '#3730A3', fontWeight: '500' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 8 },
  detailIcon: { marginRight: 8 },
  detailText: { fontSize: 14, color: '#374151' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  tagText: { color: '#8B1A1A', marginRight: 12, fontWeight: '500' },
  bottomBar: { position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bottomBarButton: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 },
  dismissButton: { backgroundColor: '#FFFFFF' },
  saveButton: { backgroundColor: '#8B1A1A' },
});

