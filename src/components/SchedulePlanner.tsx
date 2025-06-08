import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, Clock, MapPin, Edit3, Check, X, Calendar, ArrowLeft } from 'lucide-react';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'class' | 'study' | 'assignment' | 'exam' | 'other';
  day: string;
}

interface SchedulePlannerProps {
  onBack?: () => void;
}

const SchedulePlanner: React.FC<SchedulePlannerProps> = ({ onBack }) => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const types = [
    { value: 'class', label: 'Class', color: 'bg-blue-500' },
    { value: 'study', label: 'Study Session', color: 'bg-green-500' },
    { value: 'assignment', label: 'Assignment Due', color: 'bg-orange-500' },
    { value: 'exam', label: 'Exam', color: 'bg-red-500' },
    { value: 'other', label: 'Other', color: 'bg-purple-500' },
  ];

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      title: '',
      time: '09:00',
      location: '',
      type: 'class',
      day: selectedDay
    };
    setScheduleItems([...scheduleItems, newItem]);
    setEditingItem(newItem.id);
  };

  const removeScheduleItem = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  const updateScheduleItem = (id: string, field: keyof ScheduleItem, value: string) => {
    setScheduleItems(scheduleItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getTodayItems = () => {
    return scheduleItems
      .filter(item => item.day === selectedDay)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getTypeColor = (type: string) => {
    return types.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const getWeekOverview = () => {
    return days.map(day => ({
      day,
      count: scheduleItems.filter(item => item.day === day).length
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Schedule Planner
              </h1>
              <p className="text-white/70">
                Organize your classes, study sessions, and academic commitments
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <BookOpen size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Days</h3>
              
              <div className="space-y-2">
                {days.map((day) => (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      selectedDay === day
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{day}</span>
                      <span className={`text-sm ${
                        selectedDay === day ? 'text-white/80' : 'text-white/60'
                      }`}>
                        {scheduleItems.filter(item => item.day === day).length}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Week Overview</h3>
              
              <div className="space-y-3">
                {getWeekOverview().map(({ day, count }) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-sm text-white/80">{day.slice(0, 3)}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.max(1, count) }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < count ? 'bg-indigo-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {selectedDay} Schedule
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addScheduleItem}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {getTodayItems().map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                    >
                      {editingItem === item.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-6">
                              <input
                                type="text"
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) => updateScheduleItem(item.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                              <input
                                type="time"
                                value={item.time}
                                onChange={(e) => updateScheduleItem(item.id, 'time', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                              <select
                                value={item.type}
                                onChange={(e) => updateScheduleItem(item.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              >
                                {types.map(type => (
                                  <option key={type.value} value={type.value} className="bg-gray-800">{type.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-8">
                              <input
                                type="text"
                                placeholder="Location"
                                value={item.location}
                                onChange={(e) => updateScheduleItem(item.id, 'location', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              />
                            </div>
                            <div className="col-span-4 flex space-x-2">
                              <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => removeScheduleItem(item.id)}
                                className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex space-x-4">
                            <div className={`w-1 h-16 rounded-full ${getTypeColor(item.type)}`} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-white">
                                  {item.title || 'Untitled'}
                                </h4>
                                <span className={`px-2 py-1 text-white text-xs rounded-full ${getTypeColor(item.type)}`}>
                                  {types.find(t => t.value === item.type)?.label}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-white/80">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{item.time}</span>
                                </div>
                                {item.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin size={14} />
                                    <span>{item.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingItem(item.id)}
                              className="p-2 text-white/70 hover:bg-white/20 rounded-lg transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => removeScheduleItem(item.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {getTodayItems().length === 0 && (
                  <div className="text-center py-12 text-white/70">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No items scheduled for {selectedDay}. Add your first item to get started!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePlanner;