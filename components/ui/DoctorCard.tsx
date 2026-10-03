import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '@/src/data/doctors';
import { Colors } from './colors';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
  variant?: 'featured' | 'list';
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress, variant = 'list' }) => {
  if (variant === 'featured') {
    // Matches Screenshot 2 ("Top Doctors" on Home Screen)
    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image source={doctor.avatar} style={styles.featuredAvatar} />
        <View style={styles.featuredInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.star} style={styles.starIcon} />
            <Text style={styles.ratingText}>
              {doctor.rating.toFixed(1)} <Text style={styles.reviewsCount}>({doctor.reviewsCount})</Text>
            </Text>
          </View>
        </View>
        <View style={styles.chevronWrap}>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
        </View>
      </TouchableOpacity>
    );
  }

  // Matches Screenshot 3 ("Select Doctor" screen list item)
  return (
    <TouchableOpacity
      style={styles.listCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={doctor.avatar} style={styles.listAvatar} />
      <View style={styles.listInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.experience}>{doctor.experienceLabel}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={Colors.star} style={styles.starIcon} />
          <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.circularButton}>
        <Ionicons name="chevron-forward" size={18} color="#0D4B5B" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Featured (Home screen)
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F4F7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  featuredAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  specialty: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviewsCount: {
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  chevronWrap: {
    padding: 4,
  },

  // List (Select doctor screen)
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    backgroundColor: '#FFFFFF',
  },
  listAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E2E8F0',
  },
  listInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  experience: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  circularButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EDF5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
