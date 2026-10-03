import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { FilterModal } from '@/components/ui/FilterModal';
import { SPECIALTIES } from '@/src/data/doctors';
import { useApp } from '@/src/context/AppContext';

export default function SelectDoctorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ specialty?: string }>();
  const { doctors } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    params.specialty || 'all'
  );
  const [minExp, setMinExp] = useState<number>(0);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  // Filter list
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === 'all' || doc.specialtyKey === selectedSpecialty;
    const matchesExp = doc.experienceYears >= minExp;
    return matchesSpecialty && matchesExp;
  });

  const handleSelectDoctor = (id: string) => {
    router.push({
      pathname: '/doctor/[id]',
      params: { id },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header matching Screenshot 3 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select Doctor</Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
          activeOpacity={0.75}
        >
          <Ionicons name="options-outline" size={22} color="#0D4B5B" />
        </TouchableOpacity>
      </View>

      {/* Specialty Filter Chips Bar */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              selectedSpecialty === 'all' && styles.activeChip,
            ]}
            onPress={() => setSelectedSpecialty('all')}
          >
            <Text
              style={[
                styles.chipText,
                selectedSpecialty === 'all' && styles.activeChipText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {SPECIALTIES.map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={[
                styles.chip,
                selectedSpecialty === spec.id && styles.activeChip,
              ]}
              onPress={() => setSelectedSpecialty(spec.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSpecialty === spec.id && styles.activeChipText,
                ]}
              >
                {spec.name.replace('\n', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Doctors List matching Screenshot 3 */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            variant="list"
            onPress={() => handleSelectDoctor(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Doctors Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your specialty or experience filters.
            </Text>
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={() => {
                setSelectedSpecialty('all');
                setMinExp(0);
              }}
            >
              <Text style={styles.resetFiltersText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        selectedSpecialty={selectedSpecialty}
        onSelectSpecialty={setSelectedSpecialty}
        minExperience={minExp}
        onSelectMinExperience={setMinExp}
        onReset={() => {
          setSelectedSpecialty('all');
          setMinExp(0);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chipsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetFiltersBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
