import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RecentlySearchedCard from '../../components/RecentlySearchedCard';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  const handleFilterPress = () => {
    setShowFilter(!showFilter);
  };

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];
  const departments = ['Computer Science', 'AI/ML', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Electronics'];
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false} 
      />
      
      {/* Header with Search Bar */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={[styles.searchContainer, { marginTop: 32 }]}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search events, people, projects..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <Ionicons name="funnel-outline" size={20} color="#8B1A1A" />
          </TouchableOpacity>
        </View>

        {/* Modern Filter Panel */}
        {showFilter && (
          <Animated.View style={styles.filterPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterHeaderTitle}>Filter & Discover</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeFilterButton}>
                <Ionicons name="close" size={20} color="#8B1A1A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Academic Year</Text>
              <View style={styles.filterGrid}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.modernFilterChip, selectedYears.includes(year) && styles.modernFilterChipActive]}
                    onPress={() => {
                      if (selectedYears.includes(year)) {
                        setSelectedYears(selectedYears.filter(y => y !== year));
                      } else {
                        setSelectedYears([...selectedYears, year]);
                      }
                    }}
                  >
                    <Text style={[styles.modernFilterChipText, selectedYears.includes(year) && styles.modernFilterChipTextActive]}>
                      {year}
                    </Text>
                    {selectedYears.includes(year) && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Department</Text>
              <View style={styles.filterGrid}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.modernFilterChip, selectedDepartments.includes(dept) && styles.modernFilterChipActive]}
                    onPress={() => {
                      if (selectedDepartments.includes(dept)) {
                        setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                      } else {
                        setSelectedDepartments([...selectedDepartments, dept]);
                      }
                    }}
                  >
                    <Text style={[styles.modernFilterChipText, selectedDepartments.includes(dept) && styles.modernFilterChipTextActive]}>
                      {dept}
                    </Text>
                    {selectedDepartments.includes(dept) && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modernFilterActions}>
              <TouchableOpacity style={styles.modernClearButton} onPress={() => { setSelectedYears([]); setSelectedDepartments([]); }}>
                <Ionicons name="refresh-outline" size={18} color="#6B7280" />
                <Text style={styles.modernClearButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modernApplyButton} onPress={() => setShowFilter(false)}>
                <LinearGradient
                  colors={['#8B1A1A', '#DC2626']}
                  style={styles.applyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                  <Text style={styles.modernApplyButtonText}>Find Matches</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">


        {/* Recently Searched For */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Recently Searched</Text>
          {[
            { name: 'Sarah Chen', handle: '@sarah_cs', field: 'Computer Science • 3rd Year', location: 'Dubai, UAE', rating: 4.8, projects: 8, collaborations: 12, gpa: '3.9/4.0' },
            { name: 'Ahmed Hassan', handle: '@ahmed_dev', field: 'Computer Science • 4th Year', location: 'Dubai, UAE', rating: 4.6, projects: 15, collaborations: 9, gpa: '3.7/4.0' }
          ].map((person, index) => (
            <RecentlySearchedCard key={index} person={person} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionContainer: {
    marginTop: 14,
  },
  sectionLabel: {
    fontSize: 18,
    color: '#111111',
    marginBottom: 16,
    fontWeight: '600',
  },
  filterPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
  },
  filterScrollView: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#8B1A1A',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeFilterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modernFilterChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modernFilterChipActive: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
    transform: [{ scale: 1.02 }],
    shadowColor: '#8B1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modernFilterChipText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  modernFilterChipTextActive: {
    color: '#FFFFFF',
  },
  chipIcon: {
    marginLeft: 6,
  },
  modernFilterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  modernClearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  modernClearButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  modernApplyButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  modernApplyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});