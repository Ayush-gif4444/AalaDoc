import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { useApp } from '@/src/context/AppContext';

const { width } = Dimensions.get('window');

export default function DoctorDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { doctors, isFavorite, toggleFavorite } = useApp();

  const doctor = doctors.find((d) => d.id === id) || doctors[0];
  const favorited = isFavorite(doctor.id);

  const [selectedDayId, setSelectedDayId] = useState<string>('today');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');

  const selectedDayObj =
    doctor.availableDays.find((d) => d.id === selectedDayId) ||
    doctor.availableDays[0];

  const handleBookAppointment = () => {
    router.push({
      pathname: '/confirm-appointment',
      params: {
        doctorId: doctor.id,
        date: selectedDayObj.fullDate,
        time: selectedTime,
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/select-doctor');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Banner Hero Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={doctor.banner}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            style={[styles.floatingCircleBtn, styles.backBtn, { top: insets.top + 10 }]}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Floating Favorite Button */}
          <TouchableOpacity
            style={[styles.floatingCircleBtn, styles.heartBtn, { top: insets.top + 10 }]}
            onPress={() => toggleFavorite(doctor.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Doctor Info Section */}
        <View style={styles.contentBody}>
          <View style={styles.nameRatingRow}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={15} color={Colors.star} style={{ marginRight: 4 }} />
              <Text style={styles.ratingValue}>{doctor.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsCount}> ({doctor.reviewsCount})</Text>
            </View>
          </View>

          <Text style={styles.specialtyText}>{doctor.specialty}</Text>

          <Text style={styles.bioText}>{doctor.bio}</Text>

          {/* Stats Row matching Screenshot 4 */}
          <View style={styles.statsContainer}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{doctor.patientsCount}</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{doctor.experienceYears} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{doctor.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Available for Consultation */}
          <Text style={styles.sectionHeading}>Available for consultation</Text>

          {/* Date Selector Row */}
          <View style={styles.daysRow}>
            {doctor.availableDays.map((day) => {
              const isSelected = selectedDayId === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayPill,
                    isSelected && styles.selectedDayPill,
                  ]}
                  onPress={() => setSelectedDayId(day.id)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.dayPillText,
                      isSelected && styles.selectedDayPillText,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Time Slots Grid (2 rows x 3 columns) */}
          <View style={styles.slotsGrid}>
            {doctor.availableSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTime(slot)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      isSelected && styles.selectedTimeSlotText,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Book Appointment CTA Button */}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookAppointment}
            activeOpacity={0.85}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bannerContainer: {
    width: '100%',
    height: 310,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  floatingCircleBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  backBtn: {
    left: 20,
  },
  heartBtn: {
    right: 20,
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  nameRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  specialtyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDF5F7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F3E4C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#55707D',
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  dayPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedDayPill: {
    borderColor: '#164E5E',
    borderWidth: 1.5,
    backgroundColor: '#EBF4F6',
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectedDayPillText: {
    color: '#164E5E',
    fontWeight: '700',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  timeSlot: {
    width: (width - 60) / 3,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedTimeSlot: {
    backgroundColor: '#164E5E',
    borderColor: '#164E5E',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bookButton: {
    backgroundColor: '#164E5E',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#164E5E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
