import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useDataTracker } from '../utils/DataTracker';

interface AttendanceRecord {
  id: string;
  course: string;
  totalClasses: number;
  attendedClasses: number;
}

interface AttendanceCalculatorProps {
  onBack?: () => void;
}

const AttendanceCalculator: React.FC<AttendanceCalculatorProps> = ({ onBack }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: '1', course: '', totalClasses: 0, attendedClasses: 0 }
  ]);
  const dataTracker = useDataTracker();

  useEffect(() => {
    dataTracker.trackToolUsage('attendance');
    loadSavedData();
  }, []);

  useEffect(() => {
    if (records.some(record => record.course && record.totalClasses > 0)) {
      saveData();
    }
  }, [records]);

  const loadSavedData = async () => {
    try {
      const savedData = await dataTracker.getUserData('attendance');
      if (savedData && savedData.length > 0) {
        const latestData = savedData[savedData.length - 1];
        if (latestData.records) {
          setRecords(latestData.records);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async () => {
    try {
      const validRecords = records.filter(record => record.course && record.totalClasses > 0);
      if (validRecords.length > 0) {
        await dataTracker.saveAttendanceData(validRecords);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addRecord = () => {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      course: '',
      totalClasses: 0,
      attendedClasses: 0
    };
    setRecords([...records, newRecord]);
  };

  const removeRecord = (id: string) => {
    if (records.length > 1) {
      setRecords(records.filter(record => record.id !== id));
    }
  };

  const updateRecord = (id: string, field: keyof AttendanceRecord, value: string | number) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const getAttendancePercentage = (record: AttendanceRecord) => {
    if (record.totalClasses === 0) return 0;
    return (record.attendedClasses / record.totalClasses) * 100;
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { status: 'Excellent', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (percentage >= 75) return { status: 'Good', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (percentage >= 65) return { status: 'Warning', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { status: 'Critical', color: 'text-red-400', bg: 'bg-red-400/20' };
  };

  const calculateOverallAttendance = () => {
    const validRecords = records.filter(r => r.course && r.totalClasses > 0);
    if (validRecords.length === 0) return 0;
    
    const totalClasses = validRecords.reduce((sum, record) => sum + record.totalClasses, 0);
    const totalAttended = validRecords.reduce((sum, record) => sum + record.attendedClasses, 0);
    
    return totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
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
                Attendance Tracker
              </h1>
              <p className="text-white/70">
                Track your class attendance and maintain good academic standing
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Calendar size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Course Attendance
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addRecord}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Add Course</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {records.map((record) => {
                    const percentage = getAttendancePercentage(record);
                    const status = getAttendanceStatus(percentage);

                    return (
                      <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-12 md:col-span-4">
                            <input
                              type="text"
                              placeholder="Course name"
                              value={record.course}
                              onChange={(e) => updateRecord(record.id, 'course', e.target.value)}
                              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <input
                              type="number"
                              placeholder="Total"
                              value={record.totalClasses || ''}
                              onChange={(e) => updateRecord(record.id, 'totalClasses', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              min="0"
                            />
                            <label className="text-xs text-white/60 mt-1 block">Total Classes</label>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <input
                              type="number"
                              placeholder="Attended"
                              value={record.attendedClasses || ''}
                              onChange={(e) => updateRecord(record.id, 'attendedClasses', Math.min(parseInt(e.target.value) || 0, record.totalClasses))}
                              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              min="0"
                              max={record.totalClasses}
                            />
                            <label className="text-xs text-white/60 mt-1 block">Attended</label>
                          </div>
                          <div className="col-span-10 md:col-span-3">
                            {record.totalClasses > 0 && (
                              <div className="text-center">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color} border border-white/20`}>
                                  {percentage >= 75 ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                                  {percentage.toFixed(1)}%
                                </div>
                                <div className="text-xs text-white/60 mt-1">{status.status}</div>
                              </div>
                            )}
                          </div>
                          <div className="col-span-2 md:col-span-1 flex justify-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeRecord(record.id)}
                              disabled={records.length === 1}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 sticky top-8 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Overall Attendance
              </h3>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-6"
              >
                <motion.div
                  key={calculateOverallAttendance()}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="text-3xl font-bold text-white mb-2">
                    {calculateOverallAttendance().toFixed(1)}%
                  </div>
                  <div className="text-sm text-white/70">
                    Average Attendance
                  </div>
                </motion.div>
              </motion.div>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg border border-white/20">
                  <div className="text-sm font-medium text-white mb-1">Attendance Guidelines</div>
                  <div className="text-xs text-white/80 space-y-1">
                    <div>• 85%+ Excellent</div>
                    <div>• 75%+ Good</div>
                    <div>• 65%+ Warning</div>
                    <div>• Below 65% Critical</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Total Courses:</span>
                  <span className="font-medium text-white">
                    {records.filter(r => r.course && r.totalClasses > 0).length}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Total Classes:</span>
                  <span className="font-medium text-white">
                    {records.reduce((sum, r) => sum + r.totalClasses, 0)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Attended:</span>
                  <span className="font-medium text-white">
                    {records.reduce((sum, r) => sum + r.attendedClasses, 0)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalculator;