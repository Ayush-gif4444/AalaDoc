import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/src/context/AppContext';

const { width, height } = Dimensions.get('window');

export default function VideoConsultationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { doctorId } = useLocalSearchParams<{ doctorId?: string }>();
  const { doctors } = useApp();

  const doctor =
    doctors.find((d) => d.id === doctorId) ||
    doctors.find((d) => d.id === 'dr-sushma-shrestha') ||
    doctors[0];

  // Call duration timer (starts from 12:34 like Screenshot 2)
  const [secondsElapsed, setSecondsElapsed] = useState(12 * 60 + 34);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEndCall = () => {
    setShowRatingModal(true);
  };

  const handleFinishRating = () => {
    setShowRatingModal(false);
    router.replace('/(tabs)/appointments');
  };

  const handleBack = () => {
    Alert.alert(
      'Leave Consultation?',
      'Are you sure you want to exit the video call room?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Doctor Full Screen Video Feed (matching Screenshot 2) */}
      <Image
        source={doctor.banner}
        style={styles.doctorVideoFeed}
        resizeMode="cover"
      />

      {/* Top Gradient Overlay */}
      <View style={[styles.topOverlay, { height: insets.top + 90 }]} />

      {/* Bottom Gradient Overlay */}
      <View style={styles.bottomOverlay} />

      {/* Top Header Bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.frostedCircleBtn}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.callInfoCenter}>
          <Text style={styles.doctorNameText}>{doctor.name}</Text>
          <Text style={styles.timerText}>{formatTimer(secondsElapsed)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.frostedCircleBtn, !isSpeakerOn && styles.mutedCircleBtn]}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Floating Picture-in-Picture (PiP) Window (top right) */}
      <View style={[styles.pipContainer, { top: insets.top + 70 }]}>
        {isCameraOff ? (
          <View style={styles.pipCameraOff}>
            <Ionicons name="videocam-off" size={24} color="#94A3B8" />
            <Text style={styles.pipCameraOffText}>Camera Off</Text>
          </View>
        ) : (
          <Image
            source={require('@/assets/images/video/patient_self.jpg')}
            style={styles.pipImage}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Bottom Controls Section */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.secureText}>Secure video consultation</Text>

        <View style={styles.actionButtonsRow}>
          {/* Mute Button */}
          <View style={styles.buttonCol}>
            <TouchableOpacity
              style={[styles.controlCircleBtn, isMuted && styles.activeControlBtn]}
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic-outline'}
                size={26}
                color={isMuted ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </View>

          {/* End Call Button */}
          <View style={styles.buttonCol}>
            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={handleEndCall}
              activeOpacity={0.85}
            >
              <Ionicons
                name="call"
                size={28}
                color="#FFFFFF"
                style={{ transform: [{ rotate: '135deg' }] }}
              />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>End</Text>
          </View>

          {/* Camera Button */}
          <View style={styles.buttonCol}>
            <TouchableOpacity
              style={[styles.controlCircleBtn, isCameraOff && styles.activeControlBtn]}
              onPress={() => setIsCameraOff(!isCameraOff)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isCameraOff ? 'videocam-off' : 'videocam-outline'}
                size={26}
                color={isCameraOff ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Camera</Text>
          </View>
        </View>
      </View>

      {/* Consultation Completed & Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        onRequestClose={handleFinishRating}
      >
        <View style={styles.ratingOverlay}>
          <View style={styles.ratingCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#164E5E" />
            </View>

            <Text style={styles.ratingTitle}>Consultation Completed</Text>
            <Text style={styles.ratingSubtitle}>
              Your session with {doctor.name} lasted {formatTimer(secondsElapsed)}.
            </Text>

            <Text style={styles.howWasVisitText}>How was your consultation experience?</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={{ padding: 6 }}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitRatingBtn}
              onPress={handleFinishRating}
              activeOpacity={0.85}
            >
              <Text style={styles.submitRatingBtnText}>Submit & Return</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  doctorVideoFeed: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  frostedCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
  },
  mutedCircleBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
  },
  callInfoCenter: {
    alignItems: 'center',
  },
  doctorNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pipContainer: {
    position: 'absolute',
    right: 16,
    width: 105,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  pipCameraOff: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  pipCameraOffText: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  secureText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    alignItems: 'center',
  },
  buttonCol: {
    alignItems: 'center',
  },
  controlCircleBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backdropFilter: 'blur(8px)',
  },
  activeControlBtn: {
    backgroundColor: '#FFFFFF',
  },
  endCallBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  ratingCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
  },
  howWasVisitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  submitRatingBtn: {
    width: '100%',
    backgroundColor: '#164E5E',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitRatingBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
