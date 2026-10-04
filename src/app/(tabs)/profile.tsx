import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/components/ui/colors';
import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/firebase';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface HealthProfile {
  age: number | null;
  bloodGroup: string | null;
  weightKg: number | null;
}

const EMPTY_HEALTH_PROFILE: HealthProfile = {
  age: null,
  bloodGroup: null,
  weightKg: null,
};

export default function ProfileScreen() {
  const router = useRouter();
  const { favoriteDoctorIds, appointments } = useApp();
  const { user, signOut } = useAuth();
  const [healthProfile, setHealthProfile] = useState(EMPTY_HEALTH_PROFILE);
  const [profileOwnerUid, setProfileOwnerUid] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState(false);
  const [showHealthEditor, setShowHealthEditor] = useState(false);
  const [ageInput, setAgeInput] = useState('');
  const [bloodGroupInput, setBloodGroupInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [editorError, setEditorError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    return onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        const data = snapshot.data();
        setHealthProfile({
          age: typeof data?.age === 'number' ? data.age : null,
          bloodGroup: typeof data?.bloodGroup === 'string' ? data.bloodGroup : null,
          weightKg: typeof data?.weightKg === 'number' ? data.weightKg : null,
        });
        setProfileOwnerUid(user.uid);
        setProfileLoadError(false);
        setIsProfileLoading(false);
      },
      () => {
        setHealthProfile(EMPTY_HEALTH_PROFILE);
        setProfileOwnerUid(user.uid);
        setProfileLoadError(true);
        setIsProfileLoading(false);
      }
    );
  }, [user]);

  const openHealthEditor = () => {
    setAgeInput(healthProfile.age?.toString() ?? '');
    setBloodGroupInput(healthProfile.bloodGroup ?? '');
    setWeightInput(healthProfile.weightKg?.toString() ?? '');
    setEditorError('');
    setShowHealthEditor(true);
  };

  const saveHealthProfile = async () => {
    if (!user) return;

    const age = ageInput.trim() ? Number(ageInput) : null;
    const weightKg = weightInput.trim() ? Number(weightInput) : null;
    if (age !== null && (!Number.isInteger(age) || age < 1 || age > 120)) {
      setEditorError('Enter an age between 1 and 120, or leave it blank.');
      return;
    }
    if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 1 || weightKg > 700)) {
      setEditorError('Enter a weight between 1 and 700 kg, or leave it blank.');
      return;
    }

    setEditorError('');
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          age,
          bloodGroup: bloodGroupInput || null,
          weightKg,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setShowHealthEditor(false);
    } catch {
      setEditorError('Could not save. Check that Firestore is enabled and your user-only rules are published.');
    } finally {
      setIsSaving(false);
    }
  };

  const isHealthProfileLoading = isProfileLoading || profileOwnerUid !== user?.uid;
  const currentHealthProfile =
    profileOwnerUid === user?.uid ? healthProfile : EMPTY_HEALTH_PROFILE;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert('Sign out failed', 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {(user?.displayName || user?.email || 'P').charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>
            {user?.displayName || user?.email?.split('@')[0] || 'Patient'}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.patientIdBadge}>
            <Text style={styles.patientIdText}>
              Patient ID: #HC-{user?.uid.slice(-6).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Health Metrics Row */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {isHealthProfileLoading ? '...' : currentHealthProfile.bloodGroup || 'Not set'}
            </Text>
            <Text style={styles.metricLabel}>Blood Group</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {isHealthProfileLoading
                ? '...'
                : currentHealthProfile.age ? `${currentHealthProfile.age} yrs` : 'Not set'}
            </Text>
            <Text style={styles.metricLabel}>Age</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {isHealthProfileLoading
                ? '...'
                : currentHealthProfile.weightKg !== null
                  ? `${currentHealthProfile.weightKg} kg`
                  : 'Not set'}
            </Text>
            <Text style={styles.metricLabel}>Weight</Text>
          </View>
        </View>

        {profileLoadError && (
          <Text style={styles.profileError}>
            Health details could not be loaded. Check Firestore setup and security rules.
          </Text>
        )}

        <TouchableOpacity
          style={styles.editHealthButton}
          onPress={openHealthEditor}
          disabled={isHealthProfileLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
          <Text style={styles.editHealthButtonText}>Edit health details</Text>
        </TouchableOpacity>

        {/* Quick Stats Banner */}
        <View style={styles.quickStatsRow}>
          <TouchableOpacity
            style={styles.quickStatCard}
            onPress={() => router.push('/(tabs)/appointments')}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.quickStatNumber}>{appointments.length}</Text>
            <Text style={styles.quickStatLabel}>Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickStatCard}
            onPress={() => router.push('/select-doctor')}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={20} color="#EF4444" />
            <Text style={styles.quickStatNumber}>{favoriteDoctorIds.length}</Text>
            <Text style={styles.quickStatLabel}>Saved Doctors</Text>
          </TouchableOpacity>
        </View>

        {/* Settings / Menu Options */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Health & Records</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Medical Records', 'All test results and electronic prescriptions are synced.')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#EBF5FB' }]}>
              <Ionicons name="document-text-outline" size={20} color="#0284C7" />
            </View>
            <Text style={styles.menuItemText}>Medical History & Prescriptions</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Emergency Contact', 'Emergency contact set to: Dr. Ramesh (+977-9801234567)')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="call-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.menuItemText}>Emergency Contacts</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Preferences</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Notifications', 'Push notifications enabled for consultation reminders.')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="notifications-outline" size={20} color="#9333EA" />
            </View>
            <Text style={styles.menuItemText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            </View>
            <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal
        visible={showHealthEditor}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHealthEditor(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.editorPanel}>
              <View style={styles.editorHeader}>
                <Text style={styles.editorTitle}>Health details</Text>
                <TouchableOpacity
                  onPress={() => setShowHealthEditor(false)}
                  accessibilityLabel="Close health details editor"
                >
                  <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={ageInput}
                onChangeText={setAgeInput}
                keyboardType="number-pad"
                placeholder="Age in years"
                maxLength={3}
              />

              <Text style={styles.inputLabel}>Blood group</Text>
              <View style={styles.bloodGroupGrid}>
                {BLOOD_GROUPS.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.bloodGroupOption,
                      bloodGroupInput === group && styles.bloodGroupOptionSelected,
                    ]}
                    onPress={() => setBloodGroupInput(bloodGroupInput === group ? '' : group)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.bloodGroupText,
                        bloodGroupInput === group && styles.bloodGroupTextSelected,
                      ]}
                    >
                      {group}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="decimal-pad"
                placeholder="Weight in kilograms"
                maxLength={6}
              />

              {!!editorError && <Text style={styles.profileError}>{editorError}</Text>}

              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={saveHealthProfile}
                disabled={isSaving}
                activeOpacity={0.85}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save details</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0D6273',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  patientIdBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  patientIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  editHealthButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0F9FA',
    borderRadius: 12,
    marginBottom: 20,
  },
  editHealthButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  profileError: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    padding: 20,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  editorPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  editorTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  inputLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    minHeight: 48,
    borderColor: '#D8E1E8',
    borderWidth: 1,
    borderRadius: 10,
    color: Colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 13,
  },
  bloodGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodGroupOption: {
    width: '22%',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FA',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
  },
  bloodGroupOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bloodGroupText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  bloodGroupTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  quickStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quickStatLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
