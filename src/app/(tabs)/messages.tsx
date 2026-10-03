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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';

interface MessageThread {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  avatar: any;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
}

export default function MessagesScreen() {
  const [threads] = useState<MessageThread[]>([
    {
      id: 'thread-1',
      doctorId: 'dr-sushma-shrestha',
      doctorName: 'Dr. Sushma Shrestha',
      specialty: 'General Physician',
      avatar: require('@/assets/images/doctors/sushma.jpg'),
      lastMessage: 'Please remember to take your prescription with meals. Let me know if symptoms persist.',
      time: '10:45 AM',
      unreadCount: 1,
      online: true,
    },
    {
      id: 'thread-2',
      doctorId: 'dr-ramesh-adhikari',
      doctorName: 'Dr. Ramesh Adhikari',
      specialty: 'General Physician',
      avatar: require('@/assets/images/doctors/ramesh.jpg'),
      lastMessage: 'Your blood pressure report looks great! Keep following the prescribed diet.',
      time: 'Yesterday',
      unreadCount: 0,
      online: false,
    },
    {
      id: 'thread-3',
      doctorId: 'dr-anisha-nepal',
      doctorName: 'Dr. Anisha Nepal',
      specialty: 'General Physician',
      avatar: require('@/assets/images/doctors/anisha.jpg'),
      lastMessage: 'We can reschedule your video consultation to Friday if that works better.',
      time: '23 Sep',
      unreadCount: 0,
      online: true,
    },
  ]);

  const [activeChat, setActiveChat] = useState<MessageThread | null>(null);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'user' | 'doctor'; text: string; time: string }[]>([
    { id: 'm1', sender: 'doctor', text: 'Hello! How are you feeling today?', time: '10:30 AM' },
    { id: 'm2', sender: 'user', text: 'Much better doctor, but I have a quick question about the morning dosage.', time: '10:32 AM' },
    { id: 'm3', sender: 'doctor', text: 'Please remember to take your prescription with meals. Let me know if symptoms persist.', time: '10:45 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      text: inputText.trim(),
      time: 'Just now',
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate doctor quick reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'doctor',
          text: 'Thank you for updating me. I have noted this down in your health records.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {threads.map((thread) => (
          <TouchableOpacity
            key={thread.id}
            style={styles.threadItem}
            onPress={() => setActiveChat(thread)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarWrap}>
              <Image source={thread.avatar} style={styles.avatar} />
              {thread.online && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.threadContent}>
              <View style={styles.threadTopRow}>
                <Text style={styles.doctorName}>{thread.doctorName}</Text>
                <Text style={styles.timeText}>{thread.time}</Text>
              </View>
              <Text style={styles.specialtyText}>{thread.specialty}</Text>
              <View style={styles.threadBottomRow}>
                <Text
                  style={[
                    styles.lastMessageText,
                    thread.unreadCount > 0 && styles.unreadMessageText,
                  ]}
                  numberOfLines={1}
                >
                  {thread.lastMessage}
                </Text>
                {thread.unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{thread.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Interactive Chat Modal */}
      {activeChat && (
        <Modal
          visible={!!activeChat}
          animationType="slide"
          onRequestClose={() => setActiveChat(null)}
        >
          <SafeAreaView style={styles.chatSafeArea} edges={['top', 'bottom']}>
            <View style={styles.chatHeader}>
              <TouchableOpacity
                onPress={() => setActiveChat(null)}
                style={styles.chatBackBtn}
              >
                <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Image source={activeChat.avatar} style={styles.chatAvatar} />
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatDoctorName}>{activeChat.doctorName}</Text>
                <Text style={styles.chatStatus}>
                  {activeChat.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.chatBody}
              contentContainerStyle={styles.chatBodyContent}
            >
              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.sender === 'user' ? styles.userBubble : styles.doctorBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.sender === 'user'
                        ? styles.userMessageText
                        : styles.doctorMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTimestamp,
                      msg.sender === 'user'
                        ? styles.userTimestamp
                        : styles.doctorTimestamp,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={styles.inputBar}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type a message..."
                  placeholderTextColor={Colors.textTertiary}
                  value={inputText}
                  onChangeText={setInputText}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  activeOpacity={0.85}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    paddingVertical: 8,
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadContent: {
    flex: 1,
    marginLeft: 14,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  specialtyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  threadBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadMessageText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  chatSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chatBackBtn: {
    padding: 6,
    marginRight: 8,
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E2E8F0',
  },
  chatHeaderInfo: {
    marginLeft: 12,
  },
  chatDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chatStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatBodyContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  doctorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  doctorMessageText: {
    color: Colors.textPrimary,
  },
  messageTimestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  doctorTimestamp: {
    color: Colors.textTertiary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
