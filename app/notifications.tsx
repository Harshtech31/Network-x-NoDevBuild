import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const initialNotifications = [
  {
    id: '1',
    type: 'like',
    title: 'Sarah Chen liked your post',
    message: 'Your AI workshop post got some love!',
    time: '5m ago',
    read: false,
    avatar: 'https://i.pravatar.cc/150?u=sarahchen',
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment on your project',
    message: 'Alex Kumar: "This looks amazing! Can you share the code?"',
    time: '1h ago',
    read: false,
    avatar: 'https://i.pravatar.cc/150?u=alexkumar',
  },
  {
    id: '5',
    type: 'post',
    title: 'Jordan Smith created a new post',
    message: '"Anyone else excited for the hackathon this weekend? 🔥"',
    time: '3h ago',
    read: false,
    avatar: 'https://i.pravatar.cc/150?u=jordans',
  },
  {
    id: '3',
    type: 'event',
    title: 'AI Club Meetup reminder',
    message: 'Starting in 30 minutes at Innovation Hub',
    time: '2h ago',
    read: true,
    avatar: 'https://i.pravatar.cc/150?u=aiclub',
  },
  {
    id: '4',
    type: 'follow',
    title: 'Maya Patel started following you',
    message: 'Check out her latest robotics project',
    time: '1d ago',
    read: true,
    avatar: 'https://i.pravatar.cc/150?u=mayapatel',
  },
];

const NotificationItem = ({ item }: { item: typeof initialNotifications[0] }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'like': return <Ionicons name="heart-outline" size={20} color="#7f1d1d" />;
      case 'comment': return <Ionicons name="chatbubble-outline" size={20} color="#7f1d1d" />;
      case 'event': return <Ionicons name="calendar-outline" size={20} color="#7f1d1d" />;
      case 'follow': return <Ionicons name="person-add-outline" size={20} color="#7f1d1d" />;
      case 'post': return <Ionicons name="newspaper-outline" size={20} color="#7f1d1d" />;
      default: return <Ionicons name="notifications-outline" size={20} color="#6B7280" />;
    }
  };

  return (
    <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadItem]}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.notificationContent}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textContent}>
          <Text style={styles.notificationTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.notificationMessage} numberOfLines={1}>{item.message}</Text>
        </View>
      </View>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => <Text style={styles.headerTitle}>Notifications</Text>}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#7f1d1d', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  notificationsList: { paddingVertical: 8, paddingTop: 40 },
  notificationItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', marginHorizontal: 12, marginVertical: 6, borderRadius: 16 },
  unreadItem: { backgroundColor: '#fff7ed' },
  iconContainer: { marginRight: 16 },
  notificationContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  textContent: { flex: 1 },
  notificationTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  notificationMessage: { fontSize: 13, color: '#6B7280' },
  notificationTime: { fontSize: 12, color: '#9CA3AF', marginLeft: 8 },
});
