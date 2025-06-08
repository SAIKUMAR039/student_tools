import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Send, Plus, Hash, Lock, Search, Paperclip, 
  Download, Eye, Trash2, Edit3, MessageCircle, FileText,
  Image, Video, Music, Archive, X, Star, Pin, Bell, BellOff,
  UserPlus, Settings, MoreVertical, Smile, AtSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataTracker } from '../utils/DataTracker';

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
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members: string[];
  messages: Message[];
  category: string;
  createdBy: string;
  createdAt: Date;
  notifications: boolean;
  lastActivity: Date;
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
  fileAttachments?: { name: string; url: string; type: string }[];
}

const StudentChat: React.FC = () => {
  const { userEmail } = useAuth();
  const dataTracker = useDataTracker();
  
  // State management
  const [channels, setChannels] = useState<Channel[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Modal states
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  
  // Form states
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
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const categories = ['General', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature', 'History'];
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏'];

  // Load data on component mount
  useEffect(() => {
    dataTracker.trackToolUsage('chat');
    loadChatData();
    loadNotesData();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channels]);

  // Auto-save data when it changes
  useEffect(() => {
    if (channels.length > 0) {
      saveChatData();
    }
  }, [channels]);

  useEffect(() => {
    if (notes.length > 0) {
      saveNotesData();
    }
  }, [notes]);

  // Load saved chat data
  const loadChatData = async () => {
    try {
      const savedData = await dataTracker.getUserData('chat');
      if (savedData && savedData.length > 0) {
        const latestData = savedData[savedData.length - 1];
        if (latestData.channels) {
          const loadedChannels = latestData.channels.map((channel: any) => ({
            ...channel,
            createdAt: new Date(channel.createdAt),
            lastActivity: new Date(channel.lastActivity),
            messages: channel.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
              editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined
            }))
          }));
          setChannels(loadedChannels);
          if (loadedChannels.length > 0 && !activeChannel) {
            setActiveChannel(loadedChannels[0].id);
          }
        }
      } else {
        // Create default general channel if no data exists
        createDefaultChannel();
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
      createDefaultChannel();
    }
  };

  // Load saved notes data
  const loadNotesData = async () => {
    try {
      const savedData = await dataTracker.getUserData('notes');
      if (savedData && savedData.length > 0) {
        const latestData = savedData[savedData.length - 1];
        if (latestData.notes) {
          const loadedNotes = latestData.notes.map((note: any) => ({
            ...note,
            timestamp: new Date(note.timestamp)
          }));
          setNotes(loadedNotes);
        }
      }
    } catch (error) {
      console.error('Error loading notes data:', error);
    }
  };

  // Create default general channel
  const createDefaultChannel = () => {
    const defaultChannel: Channel = {
      id: '1',
      name: 'general',
      description: 'General discussion for all students',
      type: 'public',
      members: [userEmail || 'anonymous'],
      messages: [
        {
          id: '1',
          content: 'Welcome to AcademicFlow Chat! 🎓 Connect with fellow students, share notes, and collaborate on your studies.',
          author: 'System',
          timestamp: new Date(),
          type: 'system'
        }
      ],
      category: 'General',
      createdBy: 'System',
      createdAt: new Date(),
      notifications: true,
      lastActivity: new Date()
    };
    setChannels([defaultChannel]);
    setActiveChannel(defaultChannel.id);
  };

  // Save chat data to Google Sheets
  const saveChatData = async () => {
    try {
      await dataTracker.saveChatData('all_channels', 'mixed', channels);
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  // Save notes data to Google Sheets
  const saveNotesData = async () => {
    try {
      await dataTracker.saveNotesData(notes);
    } catch (error) {
      console.error('Error saving notes data:', error);
    }
  };

  // Send message with enhanced features
  const sendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;

    const currentChannel = channels.find(c => c.id === activeChannel);
    if (!currentChannel) return;

    let message: Message;

    if (selectedFile) {
      message = {
        id: Date.now().toString(),
        content: newMessage || `Shared file: ${selectedFile.name}`,
        author: userEmail || 'Anonymous',
        timestamp: new Date(),
        type: 'file',
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileUrl: URL.createObjectURL(selectedFile),
        replyTo: replyingTo || undefined
      };
    } else {
      message = {
        id: Date.now().toString(),
        content: newMessage,
        author: userEmail || 'Anonymous',
        timestamp: new Date(),
        type: 'text',
        replyTo: replyingTo || undefined
      };
    }

    // Update channel with new message
    const updatedChannels = channels.map(channel =>
      channel.id === activeChannel
        ? { 
            ...channel, 
            messages: [...channel.messages, message],
            lastActivity: new Date()
          }
        : channel
    );

    setChannels(updatedChannels);
    setNewMessage('');
    setSelectedFile(null);
    setReplyingTo(null);

    // Clear typing indicator
    clearTypingIndicator();
  };

  // Handle typing indicators
  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Add current user to typing list (simulate for demo)
    const currentUser = userEmail || 'Anonymous';
    if (!isTyping.includes(currentUser)) {
      setIsTyping([...isTyping, currentUser]);
    }

    // Remove after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      clearTypingIndicator();
    }, 3000);
  };

  const clearTypingIndicator = () => {
    const currentUser = userEmail || 'Anonymous';
    setIsTyping(isTyping.filter(user => user !== currentUser));
  };

  // Create new channel
  const createChannel = () => {
    if (!newChannel.name.trim()) return;

    const channel: Channel = {
      id: Date.now().toString(),
      name: newChannel.name.toLowerCase().replace(/\s+/g, '-'),
      description: newChannel.description,
      type: newChannel.type,
      members: [userEmail || 'Anonymous'],
      messages: [],
      category: newChannel.category,
      createdBy: userEmail || 'Anonymous',
      createdAt: new Date(),
      notifications: true,
      lastActivity: new Date()
    };

    setChannels([...channels, channel]);
    setNewChannel({ name: '', description: '', type: 'public', category: 'General' });
    setShowCreateChannel(false);
    setActiveChannel(channel.id);
  };

  // Create new note
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

  // Add reaction to message
  const addReaction = (messageId: string, emoji: string) => {
    const currentUser = userEmail || 'Anonymous';
    
    setChannels(channels.map(channel => 
      channel.id === activeChannel
        ? {
            ...channel,
            messages: channel.messages.map(message => {
              if (message.id === messageId) {
                const reactions = message.reactions || [];
                const existingReaction = reactions.find(r => r.emoji === emoji);
                
                if (existingReaction) {
                  if (existingReaction.users.includes(currentUser)) {
                    // Remove reaction
                    existingReaction.users = existingReaction.users.filter(u => u !== currentUser);
                    if (existingReaction.users.length === 0) {
                      return {
                        ...message,
                        reactions: reactions.filter(r => r.emoji !== emoji)
                      };
                    }
                  } else {
                    // Add reaction
                    existingReaction.users.push(currentUser);
                  }
                } else {
                  // New reaction
                  reactions.push({ emoji, users: [currentUser] });
                }
                
                return { ...message, reactions };
              }
              return message;
            })
          }
        : channel
    ));
    
    setShowEmojiPicker(null);
  };

  // Pin/unpin message
  const togglePinMessage = (messageId: string) => {
    setChannels(channels.map(channel => 
      channel.id === activeChannel
        ? {
            ...channel,
            messages: channel.messages.map(message =>
              message.id === messageId
                ? { ...message, isPinned: !message.isPinned }
                : message
            )
          }
        : channel
    ));
  };

  // Delete message
  const deleteMessage = (messageId: string) => {
    setChannels(channels.map(channel => 
      channel.id === activeChannel
        ? {
            ...channel,
            messages: channel.messages.filter(message => message.id !== messageId)
          }
        : channel
    ));
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video size={16} className="text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music size={16} className="text-green-500" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText size={16} className="text-red-500" />;
    return <Archive size={16} className="text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter functions
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
  const pinnedMessages = currentChannel?.messages.filter(m => m.isPinned) || [];

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
          {/* Tab Switcher */}
          <div className="glass-card rounded-2xl p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'chat'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageCircle size={16} className="inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'notes'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText size={16} className="inline mr-2" />
                Notes
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="glass-card rounded-2xl p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  <motion.button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      activeChannel === channel.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {channel.type === 'private' ? <Lock size={14} /> : <Hash size={14} />}
                      <span className="font-medium text-gray-900">{channel.name}</span>
                      {channel.notifications && (
                        <Bell size={12} className="text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{channel.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{channel.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{channel.messages.length} msgs</span>
                        <span className="text-xs text-gray-500">{channel.members.length} members</span>
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{note.title}</h4>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {currentChannel.members.length} members
                      </span>
                      <button
                        onClick={() => setShowChannelSettings(true)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Pinned Messages */}
                  {pinnedMessages.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Pin size={14} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Pinned Messages</span>
                      </div>
                      {pinnedMessages.slice(0, 2).map(msg => (
                        <p key={msg.id} className="text-xs text-yellow-700 truncate">
                          {msg.author}: {msg.content}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChannel?.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex space-x-3 group ${message.isPinned ? 'bg-yellow-50 p-2 rounded-lg' : ''}`}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">
                        {message.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {message.author === userEmail ? 'You' : message.author.split('@')[0]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.isPinned && <Pin size={12} className="text-yellow-500" />}
                        {message.edited && <span className="text-xs text-gray-400">(edited)</span>}
                      </div>
                      
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className="mb-2 p-2 bg-gray-50 border-l-2 border-gray-300 rounded text-sm text-gray-600">
                          Replying to previous message
                        </div>
                      )}

                      {/* Message content */}
                      {message.type === 'file' ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-w-sm">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getFileIcon(message.fileType || '')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{message.fileName}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(message.fileSize || 0)}</p>
                            </div>
                            <div className="flex space-x-1">
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Eye size={16} />
                              </button>
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                          {message.content !== `Shared file: ${message.fileName}` && (
                            <p className="text-gray-700 text-sm mt-2">{message.content}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-700">{message.content}</p>
                      )}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 transition-colors ${
                                reaction.users.includes(userEmail || 'Anonymous')
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={() => setShowEmojiPicker(message.id)}
                        className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                      >
                        <Smile size={14} />
                      </button>
                      <button
                        onClick={() => setReplyingTo(message.id)}
                        className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                      >
                        <MessageCircle size={14} />
                      </button>
                      <button
                        onClick={() => togglePinMessage(message.id)}
                        className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                      >
                        <Pin size={14} />
                      </button>
                      {message.author === userEmail && (
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Emoji picker */}
                    {showEmojiPicker === message.id && (
                      <div className="absolute bg-white border border-gray-200 rounded-lg p-2 shadow-lg z-10 flex space-x-1">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(message.id, emoji)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping.length > 0 && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span>{isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                {/* Reply indicator */}
                {replyingTo && (
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                    <span className="text-sm text-blue-700">Replying to message</span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* File preview */}
                {selectedFile && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getFileIcon(selectedFile.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            /* Notes Section */
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
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">{note.content}</pre>
                      </div>
                    </div>
                    
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
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">
                          View Full
                        </button>
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredNotes.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No study notes yet. Create your first note to get started!</p>
                  </div>
                )}
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
                <button
                  onClick={createChannel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
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
                <button
                  onClick={createNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Share Notes
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