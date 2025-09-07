import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const chatData = {
  '1': { name: 'Sarah Chen', type: 'personal', members: [], avatar: 'https://i.pravatar.cc/150?u=sarahchen' },
  '2': { name: 'AI Club Group', type: 'group', members: ['Alex Kumar', 'Maya Patel', 'Jordan Smith', 'You'], avatar: 'https://i.pravatar.cc/150?u=aiclub' },
  '3': { name: 'David Lee', type: 'personal', members: [], avatar: 'https://i.pravatar.cc/150?u=davidlee' },
  '4': { name: 'Hackathon Squad', type: 'group', members: ['Emma Wilson', 'Ryan Chen', 'Zoe Martinez', 'You'], avatar: 'https://i.pravatar.cc/150?u=hackathon' },
  '5': { name: 'Study Buddies', type: 'group', members: ['Lisa Park', 'Tom Anderson', 'Nina Rodriguez', 'You'], avatar: 'https://i.pravatar.cc/150?u=studybuddies' },
};

const initialMessages = [
  { id: '1', text: 'Hey! Are you coming to the meetup?', from: 'them', sender: 'Sarah Chen', timestamp: '2025-01-07T14:30:00Z' },
  { id: '2', text: 'Yes! Just finishing class now 😅', from: 'me', sender: 'You', timestamp: '2025-01-07T14:32:00Z' },
  { id: '3', text: 'Cool, see you there 🚀', from: 'them', sender: 'Sarah Chen', timestamp: '2025-01-07T14:33:00Z' },
  { id: '4', text: 'Can anyone help with the ML project?', from: 'them', sender: 'Alex Kumar', timestamp: '2025-01-08T09:15:00Z' },
  { id: '5', text: 'I can help! What do you need?', from: 'me', sender: 'You', timestamp: '2025-01-08T09:17:00Z' },
  { id: '6', text: 'Thanks! Need help with data preprocessing', from: 'them', sender: 'Alex Kumar', timestamp: '2025-01-08T09:18:00Z' },
];

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

const MessageBubble = ({ message, chatInfo, showSender }: { message: any, chatInfo: any, showSender: boolean }) => {
  const isMyMessage = message.from === 'me';
  const isGroupChat = chatInfo.type === 'group';
  
  return (
    <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.theirMessageRow]}>
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble]}>
        {isGroupChat && !isMyMessage && showSender && (
          <Text style={styles.senderName}>{message.sender}</Text>
        )}
        <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>{message.text}</Text>
        <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.theirMessageTime]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const DateDivider = ({ date }: { date: string }) => (
  <View style={styles.dateDivider}>
    <View style={styles.dateLine} />
    <Text style={styles.dateText}>{date}</Text>
    <View style={styles.dateLine} />
  </View>
);

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  
  const chatInfo = chatData[id as keyof typeof chatData] || chatData['1'];

  const sendMessage = () => {
    if (inputText.trim().length > 0) {
      setMessages([...messages, { id: Math.random().toString(), text: inputText, from: 'me', sender: 'You', timestamp: new Date().toISOString() }]);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topInfo}>
        <View style={styles.chatHeader}>
          <View style={styles.headerInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: chatInfo.avatar }} style={styles.headerAvatar} />
              {chatInfo.type === 'group' && (
                <View style={styles.groupBadge}>
                  <Ionicons name="people" size={12} color="#FFFFFF" />
                </View>
              )}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{chatInfo.name}</Text>
              {chatInfo.type === 'group' && (
                <Text style={styles.memberInfo}>{chatInfo.members.length} members</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton} onPress={() => {
            // Add functionality for three dot menu
            console.log('More options pressed');
            // You can add modal or action sheet here
          }}>
            <Ionicons name="ellipsis-vertical" size={24} color="#7f1d1d" />
          </TouchableOpacity>
        </View>

        {chatInfo.type === 'group' && (
          <View style={styles.membersContainer}>
            <Text style={styles.membersTitle}>Members:</Text>
            <View style={styles.membersList}>
              {chatInfo.members.map((member, index) => (
                <Text key={index} style={styles.memberName}>{member}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={messages}
        renderItem={({ item, index }) => {
          const prevMessage = messages[index + 1];
          const showSender = !prevMessage || prevMessage.sender !== item.sender;
          const showDateDivider = !prevMessage || formatDate(prevMessage.timestamp) !== formatDate(item.timestamp);
          
          return (
            <>
              {showDateDivider && <DateDivider date={formatDate(item.timestamp)} />}
              <MessageBubble message={item} chatInfo={chatInfo} showSender={showSender} />
            </>
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="arrow-up-circle" size={32} color="#7f1d1d" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2' },
  topInfo: { backgroundColor: '#FFFFFF' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  groupBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#7f1d1d', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFFFFF' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  memberInfo: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  moreButton: { padding: 4 },
  membersContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  membersTitle: { fontSize: 14, fontWeight: '600', color: '#7f1d1d', marginBottom: 8 },
  membersList: { flexDirection: 'row', flexWrap: 'wrap' },
  memberName: { backgroundColor: '#fed7aa', color: '#9a3412', fontSize: 12, fontWeight: '500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 },
  messageList: { paddingHorizontal: 16, flexDirection: 'column-reverse' },
  messageRow: { flexDirection: 'row', marginVertical: 4 },
  myMessageRow: { justifyContent: 'flex-end' },
  theirMessageRow: { justifyContent: 'flex-start' },
  messageBubble: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, maxWidth: '75%' },
  myMessageBubble: { backgroundColor: '#7f1d1d' },
  theirMessageBubble: { backgroundColor: '#F3F4F6' },
  myMessageText: { color: '#FFFFFF' },
  theirMessageText: { color: '#111827' },
  senderName: { fontSize: 12, fontWeight: '600', color: '#7f1d1d', marginBottom: 4 },
  messageTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  myMessageTime: { color: 'rgba(255, 255, 255, 0.7)' },
  theirMessageTime: { color: '#9CA3AF' },
  dateDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, paddingHorizontal: 16 },
  dateLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dateText: { marginHorizontal: 16, fontSize: 12, color: '#6B7280', backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  textInput: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, fontSize: 16 },
  sendButton: { padding: 4 },
});
