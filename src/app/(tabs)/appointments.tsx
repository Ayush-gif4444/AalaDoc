import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { useApp } from '@/src/context/AppContext';
import { PAST_APPOINTMENTS, PastAppointmentItem } from '@/src/data/doctors';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments, rescheduleAppointment } = useApp();

  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  // Reschedule state
  const [reschedulingAppointmentId, setReschedulingAppointmentId] = useState<string | null>(null);
  const [newSelectedDate, setNewSelectedDate] = useState('Fri, 26 Sep 2025');
  const [newSelectedTime, setNewSelectedTime] = useState('11:00 AM');

  // Prescription modal state
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPastAppointment, setSelectedPastAppointment] = useState<PastAppointmentItem | null>(null);

  // Contact support modal state
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Upcoming confirmed appointments
  const upcomingAppointments = appointments.filter((apt) => apt.status === 'Upcoming');
  const primaryUpcoming = upcomingAppointments[0];

  const handleJoinCall = (doctorId?: string) => {
    router.push({
      pathname: '/video-consultation',
      params: { doctorId: doctorId || primaryUpcoming?.doctorId || 'dr-sushma-shrestha' },
    });
  };

  const handleOpenReschedule = (appointmentId: string) => {
    setReschedulingAppointmentId(appointmentId);
  };

  const handleConfirmReschedule = () => {
    if (reschedulingAppointmentId) {
      rescheduleAppointment(reschedulingAppointmentId, newSelectedDate, newSelectedTime);
      setReschedulingAppointmentId(null);
      Alert.alert(
        'Appointment Rescheduled',
        `Your consultation has been rescheduled to ${newSelectedDate} at ${newSelectedTime}.`
      );
    }
  };

  const handleViewDetails = (item: PastAppointmentItem) => {
    setSelectedPastAppointment(item);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
      </View>

      {/* Tabs matching Screenshot 1: Upcoming (underlined) vs Past */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Upcoming' && styles.activeTabItem]}
          onPress={() => setActiveTab('Upcoming')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
          {activeTab === 'Upcoming' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Past' && styles.activeTabItem]}
          onPress={() => setActiveTab('Past')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>
            Past
          </Text>
          {activeTab === 'Past' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Upcoming' ? (
          <>
            {/* Upcoming Appointment Card matching Screenshot 1 */}
            {primaryUpcoming ? (
              <View style={styles.appointmentCard}>
                {/* Card Top: Date & Time + Confirmed Badge */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.dateTimeText}>
                    {primaryUpcoming.date} · {primaryUpcoming.time}
                  </Text>
                  <View style={styles.confirmedBadge}>
                    <Text style={styles.confirmedBadgeText}>Confirmed</Text>
                  </View>
                </View>

                {/* Doctor Row */}
                <View style={styles.doctorRow}>
                  <Image source={primaryUpcoming.doctorAvatar} style={styles.doctorAvatar} />
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{primaryUpcoming.doctorName}</Text>
                    <Text style={styles.doctorSpecialty}>{primaryUpcoming.doctorSpecialty}</Text>
                  </View>
                </View>

                {/* Join Call & Reschedule Buttons matching Screenshot 1 */}
                <TouchableOpacity
                  style={styles.joinCallButton}
                  onPress={() => handleJoinCall(primaryUpcoming.doctorId)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="videocam-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.joinCallButtonText}>Join Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rescheduleButton}
                  onPress={() => handleOpenReschedule(primaryUpcoming.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <Ionicons name="calendar-outline" size={40} color={Colors.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>No Upcoming Consultations</Text>
                <Text style={styles.emptySubtitle}>
                  {"You don't have any pending appointments. Find a doctor to book a consultation."}
                </Text>
                <TouchableOpacity
                  style={styles.findDoctorBtn}
                  onPress={() => router.push('/select-doctor')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.findDoctorBtnText}>Book Appointment</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Actions matching Screenshot 1 */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionHeading}>Quick Actions</Text>

              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => setShowPrescriptionModal(true)}
                activeOpacity={0.75}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name="document-text-outline" size={22} color="#164E5E" />
                </View>
                <Text style={styles.actionLabel}>View Prescription</Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => setShowSupportModal(true)}
                activeOpacity={0.75}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name="headset-outline" size={22} color="#164E5E" />
                </View>
                <Text style={styles.actionLabel}>Contact Support</Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Past Appointments View matching Screenshot 3 */
          <View style={styles.pastListContainer}>
            <View style={styles.pastHeaderBanner}>
              <Text style={styles.pastBannerTitle}>Consultation History</Text>
              <TouchableOpacity onPress={() => router.push('/past-appointments')} activeOpacity={0.7}>
                <Text style={styles.expandText}>Open Full Page</Text>
              </TouchableOpacity>
            </View>

            {PAST_APPOINTMENTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.pastCard}
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.8}
              >
                <Image source={item.avatar} style={styles.pastAvatar} />
                <View style={styles.pastInfo}>
                  <Text style={styles.pastDoctorName}>{item.doctorName}</Text>
                  <Text style={styles.pastSpecialty}>{item.specialty}</Text>
                  <Text style={styles.pastDateStr}>{item.dateStr}</Text>
                  <TouchableOpacity
                    onPress={() => handleViewDetails(item)}
                    activeOpacity={0.7}
                    style={{ marginTop: 3 }}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Reschedule Modal */}
      <Modal
        visible={!!reschedulingAppointmentId}
        transparent
        animationType="slide"
        onRequestClose={() => setReschedulingAppointmentId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rescheduleModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reschedule Consultation</Text>
              <TouchableOpacity onPress={() => setReschedulingAppointmentId(null)}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubheading}>Select New Date</Text>
            <View style={styles.pillRow}>
              {['Thu, 25 Sep', 'Fri, 26 Sep 2025', 'Sat, 27 Sep', 'Mon, 29 Sep'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.modalPill, newSelectedDate === d && styles.activeModalPill]}
                  onPress={() => setNewSelectedDate(d)}
                >
                  <Text
                    style={[styles.modalPillText, newSelectedDate === d && styles.activeModalPillText]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubheading}>Select New Time Slot</Text>
            <View style={styles.pillRow}>
              {['9:30 AM', '10:00 AM', '11:00 AM', '2:30 PM', '4:00 PM', '5:00 PM'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.modalPill, newSelectedTime === t && styles.activeModalPill]}
                  onPress={() => setNewSelectedTime(t)}
                >
                  <Text
                    style={[styles.modalPillText, newSelectedTime === t && styles.activeModalPillText]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmRescheduleBtn}
              onPress={handleConfirmReschedule}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmRescheduleBtnText}>Confirm New Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Prescription Viewer Modal */}
      <Modal
        visible={showPrescriptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.prescriptionModalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Digital Prescription</Text>
                <Text style={styles.rxNumber}>Rx #HC-PRESC-92810</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPrescriptionModal(false)}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.rxDoctorBox}>
              <Text style={styles.rxDoctorName}>Dr. Sushma Shrestha</Text>
              <Text style={styles.rxDoctorSpec}>General Physician · Reg #38921-NMC</Text>
              <Text style={styles.rxDate}>Issued: Thu, 25 Sep 2025</Text>
            </View>

            <Text style={styles.rxSectionTitle}>Prescribed Medicines</Text>
            <View style={styles.rxItem}>
              <Text style={styles.rxMedName}>1. Paracetamol 650mg</Text>
              <Text style={styles.rxDosage}>1 tablet twice daily after food for 3 days</Text>
            </View>
            <View style={styles.rxItem}>
              <Text style={styles.rxMedName}>2. Cetirizine 10mg</Text>
              <Text style={styles.rxDosage}>1 tablet once daily at bedtime for 5 days</Text>
            </View>
            <View style={styles.rxItem}>
              <Text style={styles.rxMedName}>3. Vitamin C & Zinc Supplements</Text>
              <Text style={styles.rxDosage}>1 chewable tablet daily with breakfast for 14 days</Text>
            </View>

            <View style={styles.rxActions}>
              <TouchableOpacity
                style={styles.downloadRxBtn}
                onPress={() => {
                  setShowPrescriptionModal(false);
                  Alert.alert('Prescription Downloaded', 'Saved to your medical records.');
                }}
              >
                <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.downloadRxText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Support Modal */}
      <Modal
        visible={showSupportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSupportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.supportModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Support</Text>
              <TouchableOpacity onPress={() => setShowSupportModal(false)}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.supportIntro}>
              Our medical helpdesk and patient care team are available 24/7.
            </Text>

            <TouchableOpacity
              style={styles.supportOption}
              onPress={() => {
                setShowSupportModal(false);
                Alert.alert('Calling Emergency Helpline', 'Dialing +977-1-4422000...');
              }}
            >
              <View style={[styles.supportIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="call" size={20} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.supportOptionTitle}>Helpline Number</Text>
                <Text style={styles.supportOptionSub}>+977-1-4422000 (Toll-Free)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportOption}
              onPress={() => {
                setShowSupportModal(false);
                router.push('/(tabs)/messages');
              }}
            >
              <View style={[styles.supportIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="chatbubbles" size={20} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.supportOptionTitle}>Live Chat Support</Text>
                <Text style={styles.supportOptionSub}>Average reply time under 2 mins</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Past Appointment Details Modal */}
      {selectedPastAppointment && (
        <Modal
          visible={!!selectedPastAppointment}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedPastAppointment(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.prescriptionModalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Consultation Details</Text>
                  <Text style={styles.rxNumber}>{selectedPastAppointment.dateStr}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedPastAppointment(null)}>
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.rxDoctorBox}>
                <Text style={styles.rxDoctorName}>{selectedPastAppointment.doctorName}</Text>
                <Text style={styles.rxDoctorSpec}>{selectedPastAppointment.specialty}</Text>
              </View>

              <Text style={styles.rxSectionTitle}>Diagnosis & Clinical Notes</Text>
              <Text style={styles.diagnosisNote}>{selectedPastAppointment.diagnosis}</Text>

              <Text style={styles.rxSectionTitle}>Prescribed Treatment</Text>
              {selectedPastAppointment.prescription.map((rx, idx) => (
                <View key={idx} style={styles.rxItem}>
                  <Text style={styles.rxMedName}>{idx + 1}. {rx}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.downloadRxBtn}
                onPress={() => {
                  const docId = selectedPastAppointment.doctorId;
                  setSelectedPastAppointment(null);
                  router.push({
                    pathname: '/doctor/[id]',
                    params: { id: docId },
                  });
                }}
              >
                <Text style={styles.downloadRxText}>Book Follow-Up Consultation</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 28,
    position: 'relative',
  },
  activeTabItem: {},
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#164E5E',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#164E5E',
    borderRadius: 2,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 28,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  confirmedBadge: {
    backgroundColor: '#E6F7EF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  confirmedBadgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  doctorInfo: {
    marginLeft: 14,
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
  },
  joinCallButton: {
    backgroundColor: '#164E5E',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#164E5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  joinCallButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  rescheduleButton: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#164E5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButtonText: {
    color: '#164E5E',
    fontSize: 15,
    fontWeight: '700',
  },
  quickActionsSection: {
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E6F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  pastListContainer: {
    paddingTop: 4,
  },
  pastHeaderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pastBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  expandText: {
    fontSize: 13,
    color: '#164E5E',
    fontWeight: '600',
  },
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F4F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  pastAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  pastInfo: {
    flex: 1,
    marginLeft: 14,
  },
  pastDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pastSpecialty: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  pastDateStr: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#164E5E',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  findDoctorBtn: {
    backgroundColor: '#164E5E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  findDoctorBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  rescheduleModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  prescriptionModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  supportModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalSubheading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  modalPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  activeModalPill: {
    backgroundColor: '#164E5E',
  },
  modalPillText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeModalPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confirmRescheduleBtn: {
    backgroundColor: '#164E5E',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  confirmRescheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  rxNumber: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  rxDoctorBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  rxDoctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rxDoctorSpec: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rxDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  rxSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  rxItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rxMedName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rxDosage: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  diagnosisNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  rxActions: {
    marginTop: 16,
  },
  downloadRxBtn: {
    backgroundColor: '#164E5E',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadRxText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  supportIntro: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 18,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supportOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  supportOptionSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
