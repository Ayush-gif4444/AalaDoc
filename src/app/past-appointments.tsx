import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { PAST_APPOINTMENTS, PastAppointmentItem } from '@/src/data/doctors';

export default function PastAppointmentsScreen() {
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] = useState<PastAppointmentItem | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/appointments');
    }
  };

  const handleViewDetails = (item: PastAppointmentItem) => {
    setSelectedAppointment(item);
  };

  const handleBookFollowUp = (doctorId: string) => {
    setSelectedAppointment(null);
    router.push({
      pathname: '/doctor/[id]',
      params: { id: doctorId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header matching Screenshot 3 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Appointments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PAST_APPOINTMENTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleViewDetails(item)}
            activeOpacity={0.8}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.doctorName}>{item.doctorName}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <Text style={styles.dateStr}>{item.dateStr}</Text>
              <TouchableOpacity
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.7}
                style={{ marginTop: 2 }}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Appointment Details & Prescription Modal */}
      {selectedAppointment && (
        <Modal
          visible={!!selectedAppointment}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedAppointment(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalHeading}>Consultation Summary</Text>
                  <Text style={styles.modalSubdate}>{selectedAppointment.dateStr}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedAppointment(null)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.doctorHeaderBox}>
                <Image source={selectedAppointment.avatar} style={styles.modalDoctorAvatar} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.modalDoctorName}>{selectedAppointment.doctorName}</Text>
                  <Text style={styles.modalDoctorSpec}>{selectedAppointment.specialty}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Diagnosis & Symptoms</Text>
              <Text style={styles.diagnosisBox}>{selectedAppointment.diagnosis}</Text>

              <Text style={styles.sectionTitle}>Prescribed Medications</Text>
              {selectedAppointment.prescription.map((rx, idx) => (
                <View key={idx} style={styles.rxCard}>
                  <Text style={styles.rxText}>{idx + 1}. {rx}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.followUpBtn}
                onPress={() => handleBookFollowUp(selectedAppointment.doctorId)}
                activeOpacity={0.85}
              >
                <Text style={styles.followUpBtnText}>Book Follow-Up Consultation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dateStr: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#164E5E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalSubdate: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  doctorHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  modalDoctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalDoctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalDoctorSpec: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 6,
  },
  diagnosisBox: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rxCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rxText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  followUpBtn: {
    backgroundColor: '#164E5E',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  followUpBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
