import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// A component to render the tab bar icon with active state styling.
const TabBarIcon = ({
  focused,
  name,
}: {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
}) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? '#FFFFFF' : '#111111'} // White icon for active, black for inactive
      />
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home-outline" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Home Tab',
        }}
      />
      <Tabs.Screen
        name="CalenderScreen"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="calendar-outline" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Calendar Tab',
        }}
      />
      <Tabs.Screen
        name="CreateScreen"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="add-circle-outline" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Create Tab',
        }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="search-outline" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Search Tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="person-outline" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Profile Tab',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 88, // Includes padding for safe area
    backgroundColor: '#FFF7F0', // off-white background
    borderTopLeftRadius: 24, // xl radius
    borderTopRightRadius: 24, // xl radius
    paddingBottom: 24, // Safe area padding
    paddingTop: 12,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBarItem: {
    height: 44, // Minimum touch target size
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22, // Circular shape
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#8B1A1A', // Red chip for active tab
  },
});