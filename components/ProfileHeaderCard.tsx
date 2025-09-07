import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatsItem = {
  value: string | number;
  label: string;
};

type ProfileHeaderCardProps = {
  name: string;
  username: string;
  university: string;
  joinedDate: string;
  bio: string;
  stats: StatsItem[];
  onEditPress?: () => void;
  onSharePress?: () => void;
};

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  name,
  username,
  university,
  joinedDate,
  bio,
  stats,
  onEditPress,
  onSharePress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>@{username}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{university}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>Joined {joinedDate}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onEditPress}
            accessibilityLabel="Edit profile"
          >
            <Ionicons name="pencil-outline" size={20} color="#111111" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { marginLeft: 8 }]}
            onPress={onSharePress}
            accessibilityLabel="Share profile"
          >
            <Ionicons name="share-social-outline" size={20} color="#111111" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.bio}>{bio}</Text>
      
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={[
            styles.statItem,
            index < stats.length - 1 && styles.statDivider
          ]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B1A1A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
