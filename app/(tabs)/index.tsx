import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeTab() {
  const router = useRouter();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  const menuItems = [
    {
      id: 'collaborations',
      title: 'Find Collaborators',
      icon: 'people',
      route: '/CollaborationScreen',
      description: 'Connect with like-minded individuals'
    },
    {
      id: 'groups',
      title: 'Join Groups',
      icon: 'chatbubbles',
      route: '/GroupsScreen',
      description: 'Discover and join communities'
    },
    {
      id: 'events',
      title: 'Events',
      icon: 'calendar',
      route: '/EventsScreen',
      description: 'Upcoming events and activities'
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: 'library',
      route: '/ResourcesScreen',
      description: 'Learning materials and guides'
    }
  ];

  useEffect(() => {
    if (showSideMenu) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSideMenu]);

  const handleMenuItemPress = (route: string) => {
    setShowSideMenu(false);
    if (route === '/CollaborationScreen') {
      router.push('/CollaborationScreen');
    } else {
      // For other routes, show coming soon alert for now
      console.log(`Navigate to ${route}`);
    }
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const openSideMenu = () => {
    setShowSideMenu(true);
  };

  const closeSideMenu = () => {
    setShowSideMenu(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hamburger menu only */}
      <View style={styles.hamburgerContainer}>
        <TouchableOpacity 
          style={styles.hamburgerButton}
          onPress={() => setShowSideMenu(true)}
        >
          <Ionicons name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Main Content - Empty for now */}
      <View style={styles.content}>
        {/* Content will be added later */}
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={showSideMenu}
        animationType="none"
        transparent={true}
        onRequestClose={closeSideMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeSideMenu}
        >
          <Animated.View 
            style={[
              styles.sideMenu,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <TouchableOpacity 
                style={styles.profileSection}
                onPress={handleProfilePress}
              >
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
                  style={styles.menuProfileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">John Doe</Text>
                  <Text style={styles.profileEmail} numberOfLines={1} ellipsizeMode="tail">john.doe@example.com</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuContent}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={styles.menuItemIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#8B1A1A" />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  hamburgerContainer: {
    paddingTop: 23,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  hamburgerButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  sideMenu: {
    backgroundColor: '#FFFFFF',
    width: '75%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuProfileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});