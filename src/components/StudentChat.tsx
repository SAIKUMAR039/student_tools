import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Send, Plus, Hash, Lock, Search, Paperclip, 
  Download, Eye, Trash2, Edit3, MessageCircle, FileText,
  Image, Video, Music, Archive, X, Star, Pin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  type: 'text' | 'file' | 'note';
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  isPinned?: boolean;
  reactions?: { emoji: string; users: string[] }[];
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members: string[];
  messages: Message[];
  category: string;
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
}

const StudentChat: React.FC = () => {
  const { userEmail } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'general',
      description: 'General discussion for all students',
      type: 'public',
      members: ['student1@example.com', 'student2@example.com'],
      messages: [
        {
          id: '1',
          content: 'Welcome to AcademicFlow Chat! 🎓',
          author: 'System',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text'
        }
      ],
      category: 'General'
    },
    {
      id: '2',
      name: 'cs101-study-group',
      description: 'Computer Science 101 study group',
      type: 'public',
      members: ['student1@example.com'],
      messages: [],
      category: 'Computer Science'
    }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'CS101 - Introduction to Programming',
      content: '# Programming Basics\n\n## Variables\n- Variables store data\n- Use meaningful names\n\n## Functions\n- Reusable code blocks\n- Take parameters and return values',
      author: 'student1@example.com',
      course: 'CS101',
      tags: ['programming', 'basics', 'variables', 'functions'],
      timestamp: new Date(Date.now() - 86400000),
      isPublic: true,
      downloads: 15,
      rating: 4.5,
      reviews: []
    }
  ]);

  const [activeChannel, setActiveChannel] = useState('1');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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

  const categories = ['General', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature', 'History'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channels]);

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
        fileUrl: URL.createObjectURL(selectedFile)
      };
    } else {
      message = {
        id: Date.now().toString(),
        content: newMessage,
        author: userEmail || 'Anonymous',
        timestamp: new Date(),
        type: 'text'
      };
    }

    setChannels(channels.map(channel =>
      channel.id === activeChannel
        ? { ...channel, messages: [...channel.messages, message] }
        : channel
    ));

    setNewMessage('');
    setSelectedFile(null);
  };

  const createChannel = () => {
    if (!newChannel.name.trim()) return;

    const channel: Channel = {
      id: Date.now().toString(),
      name: newChannel.name.toLowerCase().replace(/\s+/g, '-'),
      description: newChannel.description,
      type: newChannel.type,
      members: [userEmail || 'Anonymous'],
      messages: [],
      category: newChannel.category
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} />;
    if (fileType.startsWith('video/')) return <Video size={16} />;
    if (fileType.startsWith('audio/')) return <Music size={16} />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText size={16} />;
    return <Archive size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    </div>
                    <p className="text-xs text-gray-600 truncate">{channel.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{channel.category}</span>
                      <span className="text-xs text-gray-500">{channel.messages.length} msgs</span>
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
                    <div className="text-sm text-gray-500">
                      {currentChannel.members.length} members
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChannel?.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex space-x-3"
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
                      </div>
                      
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
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
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
                    onChange={(e) => setNewMessage(e.target.value)}
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