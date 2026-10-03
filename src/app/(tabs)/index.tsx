import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { SPECIALTIES } from '@/src/data/doctors';
import { SpecialtyCard } from '@/components/ui/SpecialtyCard';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { useApp } from '@/src/context/AppContext';

export default function HomeScreen() {
  const router = useRouter();
  const {
    doctors,
    setSelectedSpecialty,
    unreadNotifications,
    clearNotifications,
    appointments,
  } = useApp();

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const handleSelectSpecialty = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    router.push({
      pathname: '/select-doctor',
      params: { specialty: specialtyId },
    });
  };

  const handleSeeAllSpecialties = () => {
    setSelectedSpecialty('all');
    router.push('/select-doctor');
  };

  const handleSeeAllDoctors = () => {
    setSelectedSpecialty('all');
    router.push('/select-doctor');
  };

  const handleOpenDoctor = (doctorId: string) => {
    router.push({
      pathname: '/doctor/[id]',
      params: { id: doctorId },
    });
  };

  const handleOpenNotifications = () => {
    setShowNotificationsModal(true);
    clearNotifications();
  };

  // Top doctor from Screenshot 2: Dr. Sushma Shrestha
  const topDoctor = doctors.find((d) => d.id === 'dr-sushma-shrestha') || doctors[0];
  const otherDoctors = doctors.filter((d) => d.id !== topDoctor.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.healthMattersText}>Your health matters</Text>
            <Text style={styles.headerHeadline}>
              Book appointments with the best doctors, anytime.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={handleOpenNotifications}
            activeOpacity={0.75}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.textPrimary}
            />
            {unreadNotifications > 0 && <View style={styles.unreadBadge} />}
          </TouchableOpacity>
        </View>

        {/* Specialties Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <TouchableOpacity onPress={handleSeeAllSpecialties} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialtiesScroll}
        >
          {SPECIALTIES.map((spec) => (
            <SpecialtyCard
              key={spec.id}
              specialty={spec}
              onPress={() => handleSelectSpecialty(spec.id)}
            />
          ))}
        </ScrollView>

        {/* Top Doctors Section */}
        <View style={[styles.sectionHeaderRow, styles.topDoctorsHeader]}>
          <Text style={styles.sectionTitle}>Top Doctors</Text>
          <TouchableOpacity onPress={handleSeeAllDoctors} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Doctor Card (matching screenshot 2) */}
        <DoctorCard
          doctor={topDoctor}
          variant="featured"
          onPress={() => handleOpenDoctor(topDoctor.id)}
        />

        {/* Additional Top Doctors */}
        {otherDoctors.slice(0, 3).map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            variant="featured"
            onPress={() => handleOpenDoctor(doc.id)}
          />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                onPress={() => setShowNotificationsModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              {appointments.length > 0 && (
                <View style={styles.notificationItem}>
                  <View style={styles.notificationIconWrap}>
                    <Ionicons name="calendar" size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notificationHeading}>
                      Upcoming Appointment
                    </Text>
                    <Text style={styles.notificationBody}>
                      {appointments[0].doctorName} • {appointments[0].date} at{' '}
                      {appointments[0].time}
                    </Text>
                    <Text style={styles.notificationTime}>Just now</Text>
                  </View>
                </View>
              )}

              <View style={styles.notificationItem}>
                <View
                  style={[
                    styles.notificationIconWrap,
                    { backgroundColor: '#EEF2FF' },
                  ]}
                >
                  <Ionicons name="shield-checkmark" size={20} color="#6366F1" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notificationHeading}>Health Tip</Text>
                  <Text style={styles.notificationBody}>
                    Stay hydrated! Drink at least 8 glasses of water daily to maintain energy.
                  </Text>
                  <Text style={styles.notificationTime}>2 hours ago</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  healthMattersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0D6273',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  headerHeadline: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    marginTop: 4,
  },
  unreadBadge: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  topDoctorsHeader: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6273',
  },
  specialtiesScroll: {
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notificationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  notificationBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
