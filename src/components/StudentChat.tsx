import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Send, Plus, Hash, Lock, Search, Paperclip, 
  Download, Eye, Trash2, Edit3, MessageCircle, FileText,
  Image, Video, Music, Archive, X, Star, Pin, Bell, BellOff,
  UserPlus, Settings, Volume2, VolumeX, Copy, Share2,
  CheckCircle, AlertCircle, Info, Smile, Heart, ThumbsUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  type: 'text' | 'file' | 'note' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  isPinned?: boolean;
  reactions?: { emoji: string; users: string[]; count: number }[];
  replyTo?: string;
  edited?: boolean;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members: string[];
  messages: Message[];
  category: string;
  unreadCount: number;
  lastActivity: Date;
  notifications: boolean;
  isJoined: boolean;
  memberCount: number;
  onlineMembers: string[];
}

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  course: string;
  tags: string[];
  timestamp: Date;
  isPublic: boolean;
  downloads: number;
  rating: number;
  reviews: { user: string; rating: number; comment: string }[];
  attachments?: { name: string; url: string; type: string; size: number }[];
}

interface Notification {
  id: string;
  type: 'message' | 'mention' | 'file' | 'join' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  channelId: string;
  read: boolean;
  avatar?: string;
}

const StudentChat: React.FC = () => {
  const { userEmail } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'general',
      description: 'General discussion for all students',
      type: 'public',
      members: ['student1@example.com', 'student2@example.com', userEmail || ''],
      messages: [
        {
          id: '1',
          content: 'Welcome to AcademicFlow Chat! 🎓 Connect with fellow students and share knowledge.',
          author: 'System',
          timestamp: new Date(Date.now() - 3600000),
          type: 'system'
        }
      ],
      category: 'General',
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 3600000),
      notifications: true,
      isJoined: true,
      memberCount: 3,
      onlineMembers: ['student1@example.com', userEmail || '']
    },
    {
      id: '2',
      name: 'cs101-study-group',
      description: 'Computer Science 101 study group - Join to collaborate!',
      type: 'public',
      members: ['student1@example.com'],
      messages: [
        {
          id: '2',
          content: 'Anyone working on the recursion assignment? Let\'s help each other! 💻',
          author: 'student1@example.com',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text'
        }
      ],
      category: 'Computer Science',
      unreadCount: 1,
      lastActivity: new Date(Date.now() - 1800000),
      notifications: true,
      isJoined: false,
      memberCount: 1,
      onlineMembers: ['student1@example.com']
    },
    {
      id: '3',
      name: 'math201-help',
      description: 'Calculus II help and study sessions',
      type: 'public',
      members: ['student2@example.com', 'student3@example.com'],
      messages: [],
      category: 'Mathematics',
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 7200000),
      notifications: false,
      isJoined: false,
      memberCount: 2,
      onlineMembers: ['student2@example.com']
    }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'CS101 - Introduction to Programming',
      content: '# Programming Basics\n\n## Variables\n- Variables store data\n- Use meaningful names\n\n## Functions\n- Reusable code blocks\n- Take parameters and return values\n\n## Best Practices\n- Write clean, readable code\n- Comment your code\n- Test thoroughly',
      author: 'student1@example.com',
      course: 'CS101',
      tags: ['programming', 'basics', 'variables', 'functions'],
      timestamp: new Date(Date.now() - 86400000),
      isPublic: true,
      downloads: 15,
      rating: 4.5,
      reviews: [
        { user: 'student2@example.com', rating: 5, comment: 'Very helpful notes!' },
        { user: 'student3@example.com', rating: 4, comment: 'Clear and concise.' }
      ],
      attachments: [
        { name: 'code-examples.py', url: '#', type: 'text/python', size: 2048 }
      ]
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message in cs101-study-group',
      message: 'student1: Anyone working on the recursion assignment?',
      timestamp: new Date(Date.now() - 1800000),
      channelId: '2',
      read: false
    }
  ]);

  const [activeChannel, setActiveChannel] = useState('1');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    type: 'public' as 'public' | 'private',
    category: 'General'
  });

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    course: '',
    tags: '',
    isPublic: true
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const categories = ['General', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature', 'History'];
  const commonReactions = ['👍', '❤️', '😊', '🎉', '🤔', '👏'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channels]);

  // Notification sound effect
  const playNotificationSound = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if audio can't play
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show browser notification
  const showBrowserNotification = (title: string, body: string, channelId: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: channelId
      });
      
      notification.onclick = () => {
        window.focus();
        setActiveChannel(channelId);
        notification.close();
      };
      
      setTimeout(() => notification.close(), 5000);
    }
  };

  const joinChannel = (channelId: string) => {
    setChannels(channels.map(channel => {
      if (channel.id === channelId) {
        const updatedChannel = {
          ...channel,
          isJoined: true,
          members: [...channel.members, userEmail || 'Anonymous'],
          memberCount: channel.memberCount + 1,
          onlineMembers: [...channel.onlineMembers, userEmail || 'Anonymous']
        };
        
        // Add system message
        const joinMessage: Message = {
          id: Date.now().toString(),
          content: `${userEmail?.split('@')[0] || 'Anonymous'} joined the channel`,
          author: 'System',
          timestamp: new Date(),
          type: 'system'
        };
        
        updatedChannel.messages.push(joinMessage);
        
        // Add notification
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'join',
          title: `Joined ${channel.name}`,
          message: `You are now a member of ${channel.name}`,
          timestamp: new Date(),
          channelId,
          read: false
        };
        
        setNotifications(prev => [notification, ...prev]);
        playNotificationSound();
        
        return updatedChannel;
      }
      return channel;
    }));
    
    setActiveChannel(channelId);
  };

  const leaveChannel = (channelId: string) => {
    setChannels(channels.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          isJoined: false,
          members: channel.members.filter(member => member !== userEmail),
          memberCount: Math.max(0, channel.memberCount - 1),
          onlineMembers: channel.onlineMembers.filter(member => member !== userEmail)
        };
      }
      return channel;
    }));
    
    if (activeChannel === channelId) {
      setActiveChannel('1'); // Switch to general channel
    }
  };

  const toggleChannelNotifications = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, notifications: !channel.notifications }
        : channel
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const currentChannel = channels.find(c => c.id === activeChannel);
    if (!currentChannel || !currentChannel.isJoined) return;

    let messages: Message[] = [];

    // Handle text message
    if (newMessage.trim()) {
      const textMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        author: userEmail || 'Anonymous',
        timestamp: new Date(),
        type: 'text',
        replyTo: replyingTo || undefined,
        reactions: []
      };
      messages.push(textMessage);
    }

    // Handle file uploads
    selectedFiles.forEach((file, index) => {
      const fileMessage: Message = {
        id: (Date.now() + index + 1).toString(),
        content: `Shared file: ${file.name}`,
        author: userEmail || 'Anonymous',
        timestamp: new Date(),
        type: 'file',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file),
        reactions: []
      };
      messages.push(fileMessage);
    });

    setChannels(channels.map(channel => {
      if (channel.id === activeChannel) {
        const updatedChannel = {
          ...channel,
          messages: [...channel.messages, ...messages],
          lastActivity: new Date()
        };
        
        // Update unread count for other members
        const otherMembers = channel.members.filter(member => member !== userEmail);
        if (otherMembers.length > 0) {
          // Simulate notifications for other users
          playNotificationSound();
          
          if (channel.notifications) {
            showBrowserNotification(
              `New message in ${channel.name}`,
              newMessage || `${selectedFiles.length} file(s) shared`,
              channel.id
            );
          }
        }
        
        return updatedChannel;
      }
      return channel;
    }));

    setNewMessage('');
    setSelectedFiles([]);
    setReplyingTo(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addReaction = (messageId: string, emoji: string) => {
    setChannels(channels.map(channel => {
      if (channel.id === activeChannel) {
        return {
          ...channel,
          messages: channel.messages.map(message => {
            if (message.id === messageId) {
              const reactions = message.reactions || [];
              const existingReaction = reactions.find(r => r.emoji === emoji);
              
              if (existingReaction) {
                if (existingReaction.users.includes(userEmail || '')) {
                  // Remove reaction
                  return {
                    ...message,
                    reactions: reactions.map(r => 
                      r.emoji === emoji 
                        ? { 
                            ...r, 
                            users: r.users.filter(u => u !== userEmail),
                            count: r.count - 1
                          }
                        : r
                    ).filter(r => r.count > 0)
                  };
                } else {
                  // Add reaction
                  return {
                    ...message,
                    reactions: reactions.map(r => 
                      r.emoji === emoji 
                        ? { 
                            ...r, 
                            users: [...r.users, userEmail || ''],
                            count: r.count + 1
                          }
                        : r
                    )
                  };
                }
              } else {
                // New reaction
                return {
                  ...message,
                  reactions: [...reactions, {
                    emoji,
                    users: [userEmail || ''],
                    count: 1
                  }]
                };
              }
            }
            return message;
          })
        };
      }
      return channel;
    }));
  };

  const createChannel = () => {
    if (!newChannel.name.trim()) return;

    const channel: Channel = {
      id: Date.now().toString(),
      name: newChannel.name.toLowerCase().replace(/\s+/g, '-'),
      description: newChannel.description,
      type: newChannel.type,
      members: [userEmail || 'Anonymous'],
      messages: [{
        id: '1',
        content: `Channel created by ${userEmail?.split('@')[0] || 'Anonymous'}`,
        author: 'System',
        timestamp: new Date(),
        type: 'system'
      }],
      category: newChannel.category,
      unreadCount: 0,
      lastActivity: new Date(),
      notifications: true,
      isJoined: true,
      memberCount: 1,
      onlineMembers: [userEmail || 'Anonymous']
    };

    setChannels([...channels, channel]);
    setNewChannel({ name: '', description: '', type: 'public', category: 'General' });
    setShowCreateChannel(false);
    setActiveChannel(channel.id);
  };

  const createNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      author: userEmail || 'Anonymous',
      course: newNote.course,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      timestamp: new Date(),
      isPublic: newNote.isPublic,
      downloads: 0,
      rating: 0,
      reviews: []
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', course: '', tags: '', isPublic: true });
    setShowCreateNote(false);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} className="text-blue-600" />;
    if (fileType.startsWith('video/')) return <Video size={16} className="text-purple-600" />;
    if (fileType.startsWith('audio/')) return <Music size={16} className="text-green-600" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText size={16} className="text-red-600" />;
    return <Archive size={16} className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentChannel = channels.find(c => c.id === activeChannel);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="pt-20 lg:pt-24 px-4 max-w-7xl mx-auto h-screen">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <Users size={48} className="mx-auto mb-4 text-blue-600" />
        <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">
          Student <span className="font-medium text-blue-600">Chat</span>
        </h1>
        <p className="text-gray-600 font-light">
          Connect with peers, share notes, and collaborate on studies
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Header with Notifications */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">AcademicFlow Chat</h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    soundEnabled ? 'text-blue-600 bg-blue-50' : 'text-gray-400 bg-gray-50'
                  }`}
                  title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Bell size={16} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'chat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'notes'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Notes
              </button>
            </div>
          </div>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-2xl p-4 max-h-80 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => {
                        markNotificationAsRead(notification.id);
                        setActiveChannel(notification.channelId);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`p-1 rounded-full ${
                          notification.type === 'message' ? 'bg-blue-100' :
                          notification.type === 'mention' ? 'bg-orange-100' :
                          notification.type === 'file' ? 'bg-green-100' :
                          notification.type === 'join' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {notification.type === 'message' && <MessageCircle size={12} className="text-blue-600" />}
                          {notification.type === 'mention' && <Bell size={12} className="text-orange-600" />}
                          {notification.type === 'file' && <Paperclip size={12} className="text-green-600" />}
                          {notification.type === 'join' && <UserPlus size={12} className="text-purple-600" />}
                          {notification.type === 'system' && <Info size={12} className="text-gray-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Bell size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <div className="glass-card rounded-2xl p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              />
            </div>
          </div>

          {/* Channels/Notes List */}
          <div className="glass-card rounded-2xl p-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">
                {activeTab === 'chat' ? 'Channels' : 'Study Notes'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => activeTab === 'chat' ? setShowCreateChannel(true) : setShowCreateNote(true)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
              </motion.button>
            </div>

            <div className="space-y-2">
              {activeTab === 'chat' ? (
                filteredChannels.map((channel) => (
                  <motion.div
                    key={channel.id}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      activeChannel === channel.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="flex items-center space-x-2 flex-1"
                        onClick={() => {
                          if (channel.isJoined) {
                            setActiveChannel(channel.id);
                          }
                        }}
                      >
                        {channel.type === 'private' ? <Lock size={14} /> : <Hash size={14} />}
                        <span className="font-medium text-gray-900 text-sm">{channel.name}</span>
                        {channel.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {channel.isJoined && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChannelNotifications(channel.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              channel.notifications 
                                ? 'text-blue-600 hover:bg-blue-100' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {channel.notifications ? <Bell size={12} /> : <BellOff size={12} />}
                          </button>
                        )}
                        
                        {!channel.isJoined ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              joinChannel(channel.id);
                            }}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Join
                          </motion.button>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-gray-500">{channel.onlineMembers.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{channel.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{channel.category}</span>
                      <div className="flex items-center space-x-2">
                        <span>{channel.memberCount} members</span>
                        <span>•</span>
                        <span>{formatTime(channel.lastActivity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">{note.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{note.course}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{note.downloads} downloads</span>
                      <div className="flex items-center space-x-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span>{note.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          {activeTab === 'chat' ? (
            <div className="glass-card rounded-2xl h-full flex flex-col">
              {/* Chat Header */}
              {currentChannel && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {currentChannel.type === 'private' ? <Lock size={20} /> : <Hash size={20} />}
                      <div>
                        <h2 className="font-medium text-gray-900">{currentChannel.name}</h2>
                        <p className="text-sm text-gray-600">{currentChannel.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>{currentChannel.onlineMembers.length} online</span>
                        </div>
                        <span>•</span>
                        <span>{currentChannel.memberCount} members</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChannelSettings(true)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div 
                ref={dropZoneRef}
                className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors ${
                  dragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 z-10">
                    <div className="text-center">
                      <Paperclip size={48} className="mx-auto mb-4 text-blue-600" />
                      <p className="text-lg font-medium text-blue-900">Drop files to share</p>
                      <p className="text-sm text-blue-700">Files will be uploaded to the channel</p>
                    </div>
                  </div>
                )}

                {currentChannel?.isJoined ? (
                  currentChannel.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      {message.type === 'system' ? (
                        <div className="text-center">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            {message.content}
                          </span>
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">
                              {message.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">
                                {message.author === userEmail ? 'You' : message.author.split('@')[0]}
                              </span>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.edited && (
                                <span className="text-xs text-gray-400">(edited)</span>
                              )}
                            </div>
                            
                            {message.replyTo && (
                              <div className="mb-2 pl-3 border-l-2 border-gray-300 bg-gray-50 rounded p-2">
                                <p className="text-xs text-gray-600">Replying to message</p>
                              </div>
                            )}
                            
                            {message.type === 'file' ? (
                              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-w-sm">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white rounded-lg border">
                                    {getFileIcon(message.fileType || '')}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{message.fileName}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(message.fileSize || 0)}</p>
                                  </div>
                                  <div className="flex space-x-1">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                      <Eye size={16} />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                      <Download size={16} />
                                    </motion.button>
                                  </div>
                                </div>
                                {message.content !== `Shared file: ${message.fileName}` && (
                                  <p className="text-gray-700 text-sm mt-2">{message.content}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
                            )}

                            {/* Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {message.reactions.map((reaction, index) => (
                                  <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addReaction(message.id, reaction.emoji)}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                      reaction.users.includes(userEmail || '')
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    <span>{reaction.emoji}</span>
                                    <span>{reaction.count}</span>
                                  </motion.button>
                                ))}
                              </div>
                            )}

                            {/* Message Actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                              <div className="flex items-center space-x-1">
                                {commonReactions.map((emoji) => (
                                  <motion.button
                                    key={emoji}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => addReaction(message.id, emoji)}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-sm"
                                  >
                                    {emoji}
                                  </motion.button>
                                ))}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setReplyingTo(message.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                >
                                  <MessageCircle size={14} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Lock size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Join Channel to Chat</h3>
                      <p className="text-gray-600 mb-4">You need to join this channel to see messages and participate.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => joinChannel(activeChannel)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Join Channel
                      </motion.button>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {currentChannel?.isJoined && (
                <div className="p-4 border-t border-gray-200">
                  {/* Reply indicator */}
                  {replyingTo && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-blue-700">Replying to message</span>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* File previews */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getFileIcon(file.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Paperclip size={20} />
                    </motion.button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={!newMessage.trim() && selectedFiles.length === 0}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 h-full overflow-y-auto">
              <div className="grid gap-6">
                {filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{note.title}</h3>
                        <p className="text-sm text-gray-600">{note.course} • {note.author.split('@')[0]}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Download size={16} />
                          <span>{note.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span>{note.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none mb-4">
                      <div className="bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{note.content}</pre>
                      </div>
                    </div>

                    {note.attachments && note.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                        <div className="space-y-2">
                          {note.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                              <div className="p-1 bg-white rounded">
                                {getFileIcon(attachment.type)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Download size={16} />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {note.timestamp.toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                        >
                          View Full
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                        >
                          Download
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Share2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Channel Modal */}
      <AnimatePresence>
        {showCreateChannel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Channel</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Channel name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <textarea
                  placeholder="Channel description"
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                
                <select
                  value={newChannel.category}
                  onChange={(e) => setNewChannel({...newChannel, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={newChannel.type === 'public'}
                      onChange={() => setNewChannel({...newChannel, type: 'public'})}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Public</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={newChannel.type === 'private'}
                      onChange={() => setNewChannel({...newChannel, type: 'private'})}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Private</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createChannel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Note Modal */}
      <AnimatePresence>
        {showCreateNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share Study Notes</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <input
                  type="text"
                  placeholder="Course (e.g., CS101, MATH201)"
                  value={newNote.course}
                  onChange={(e) => setNewNote({...newNote, course: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <textarea
                  placeholder="Write your notes here... (Markdown supported)"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                />
                
                <input
                  type="text"
                  placeholder="Tags (comma-separated, e.g., programming, loops, functions)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newNote.isPublic}
                    onChange={(e) => setNewNote({...newNote, isPublic: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Make notes public (visible to all students)</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateNote(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Share Notes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Channel Settings Modal */}
      <AnimatePresence>
        {showChannelSettings && currentChannel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Channel Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Notifications</span>
                  <button
                    onClick={() => toggleChannelNotifications(currentChannel.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentChannel.notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentChannel.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Channel Info</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Type: {currentChannel.type}</div>
                    <div>Category: {currentChannel.category}</div>
                    <div>Members: {currentChannel.memberCount}</div>
                    <div>Created: {currentChannel.lastActivity.toLocaleDateString()}</div>
                  </div>
                </div>
                
                {currentChannel.id !== '1' && (
                  <div className="border-t border-gray-200 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        leaveChannel(currentChannel.id);
                        setShowChannelSettings(false);
                      }}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Leave Channel
                    </motion.button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowChannelSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentChat;