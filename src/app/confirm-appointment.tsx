import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { useApp } from '@/src/context/AppContext';

export default function ConfirmAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    doctorId?: string;
    date?: string;
    time?: string;
  }>();

  const { doctors, bookAppointment } = useApp();

  const doctor =
    doctors.find((d) => d.id === params.doctorId) ||
    doctors.find((d) => d.id === 'dr-sushma-shrestha') ||
    doctors[0];

  const appointmentDate = params.date || 'Thu, 25 Sep 2025';
  const appointmentTime = params.time || '10:00 AM';

  const [consultationType, setConsultationType] = useState<
    'Video Call' | 'In-Person Clinic Visit' | 'Audio Call'
  >('Video Call');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [reason, setReason] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [bookingRef, setBookingRef] = useState('HC-APPT-#782194');

  const handleConfirm = () => {
    const generatedRef = `HC-APPT-#${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(generatedRef);
    bookAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorRating: doctor.rating,
      doctorReviews: doctor.reviewsCount,
      doctorAvatar: doctor.avatar,
      date: appointmentDate,
      time: appointmentTime,
      consultationType,
      fee: doctor.fee,
      currency: doctor.currency,
      reason: reason.trim() || undefined,
    });

    setIsSuccessModalVisible(true);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoToAppointments = () => {
    setIsSuccessModalVisible(false);
    router.replace('/(tabs)/appointments');
  };

  const handleGoHome = () => {
    setIsSuccessModalVisible(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Doctor Card (matching Screenshot 5) */}
          <View style={styles.doctorCard}>
            <Image source={doctor.avatar} style={styles.doctorAvatar} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={Colors.star} style={{ marginRight: 4 }} />
                <Text style={styles.ratingText}>
                  {doctor.rating.toFixed(1)} <Text style={styles.reviewsCount}>({doctor.reviewsCount})</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Details Group Card (matching Screenshot 5) */}
          <View style={styles.detailsCard}>
            {/* Date Row */}
            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <Ionicons name="calendar-outline" size={20} color="#164E5E" />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{appointmentDate}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Time Row */}
            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <Ionicons name="time-outline" size={20} color="#164E5E" />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{appointmentTime}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Consultation Type Row */}
            <TouchableOpacity
              style={styles.detailRow}
              onPress={() => setShowTypeSelector(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Ionicons
                  name={
                    consultationType === 'Video Call'
                      ? 'videocam-outline'
                      : consultationType === 'Audio Call'
                      ? 'call-outline'
                      : 'business-outline'
                  }
                  size={20}
                  color="#164E5E"
                />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Consultation Type</Text>
                <Text style={styles.detailValue}>{consultationType}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Reason for Visit (Optional) */}
          <View style={styles.reasonSection}>
            <Text style={styles.reasonLabelHeading}>
              Reason for visit <Text style={styles.optionalText}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="e.g. fever, cough, general checkup..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={reason}
              onChangeText={setReason}
            />
          </View>

          {/* Fee Row */}
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Consultation fee</Text>
            <Text style={styles.feeAmount}>
              {doctor.currency} {doctor.fee}
            </Text>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Consultation Type Modal */}
      <Modal
        visible={showTypeSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.typeModalCard}>
            <Text style={styles.typeModalTitle}>Select Consultation Type</Text>
            {(['Video Call', 'In-Person Clinic Visit', 'Audio Call'] as const).map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    consultationType === type && styles.selectedTypeOption,
                  ]}
                  onPress={() => {
                    setConsultationType(type);
                    setShowTypeSelector(false);
                  }}
                >
                  <Ionicons
                    name={
                      type === 'Video Call'
                        ? 'videocam'
                        : type === 'Audio Call'
                        ? 'call'
                        : 'business'
                    }
                    size={20}
                    color={consultationType === type ? '#164E5E' : Colors.textSecondary}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      consultationType === type && styles.selectedTypeOptionText,
                    ]}
                  >
                    {type}
                  </Text>
                  {consultationType === type && (
                    <Ionicons name="checkmark" size={20} color="#164E5E" />
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </Modal>

      {/* Confirmation Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleGoHome}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={40} color="#164E5E" />
            </View>

            <Text style={styles.successTitle}>Appointment Confirmed!</Text>
            <Text style={styles.successSubtitle}>
              Your {consultationType.toLowerCase()} with {doctor.name} has been
              booked for {appointmentDate} at {appointmentTime}.
            </Text>

            <View style={styles.bookingRefCard}>
              <Text style={styles.bookingRefLabel}>Booking Reference</Text>
              <Text style={styles.bookingRefCode}>{bookingRef}</Text>
            </View>

            <TouchableOpacity
              style={styles.viewApptsBtn}
              onPress={handleGoToAppointments}
              activeOpacity={0.85}
            >
              <Text style={styles.viewApptsBtnText}>View in Appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backHomeBtn}
              onPress={handleGoHome}
              activeOpacity={0.7}
            >
              <Text style={styles.backHomeBtnText}>Back to Home</Text>
            </TouchableOpacity>
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
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F4F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E2E8F0',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E6F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  reasonSection: {
    marginBottom: 28,
  },
  reasonLabelHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  optionalText: {
    color: Colors.textSecondary,
    fontWeight: '400',
    fontSize: 13,
  },
  reasonInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 110,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  feeLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  confirmButton: {
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
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  typeModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  typeModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 8,
  },
  selectedTypeOption: {
    backgroundColor: '#E6F4F5',
    borderColor: '#164E5E',
  },
  typeOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  selectedTypeOptionText: {
    color: '#164E5E',
  },
  successModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E6F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  bookingRefCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  bookingRefLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bookingRefCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#164E5E',
  },
  viewApptsBtn: {
    backgroundColor: '#164E5E',
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  viewApptsBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backHomeBtn: {
    paddingVertical: 10,
  },
  backHomeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
