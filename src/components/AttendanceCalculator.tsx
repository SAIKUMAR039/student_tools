import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useDataTracker } from '../utils/DataTracker';

interface AttendanceRecord {
  id: string;
  course: string;
  totalClasses: number;
  attendedClasses: number;
}

const AttendanceCalculator: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: '1', course: '', totalClasses: 0, attendedClasses: 0 }
  ]);
  const dataTracker = useDataTracker();

  useEffect(() => {
    // Track tool usage when component mounts
    dataTracker.trackToolUsage('attendance');
    
    // Load saved data
    loadSavedData();
  }, []);

  useEffect(() => {
    // Auto-save data when records change
    if (records.some(record => record.course && record.totalClasses > 0)) {
      saveData();
    }
  }, [records]);

  const loadSavedData = async () => {
    try {
      const savedData = await dataTracker.getUserData('attendance');
      if (savedData && savedData.length > 0) {
        // Get the most recent data
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
    if (percentage >= 85) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 75) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 65) return { status: 'Warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const calculateOverallAttendance = () => {
    const validRecords = records.filter(r => r.course && r.totalClasses > 0);
    if (validRecords.length === 0) return 0;
    
    const totalClasses = validRecords.reduce((sum, record) => sum + record.totalClasses, 0);
    const totalAttended = validRecords.reduce((sum, record) => sum + record.attendedClasses, 0);
    
    return totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
  };

  return (
    <div className="pt-24 lg:pt-32 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <Calendar size={48} className="mx-auto mb-4 text-green-600" />
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Attendance Calculator
        </h1>
        <p className="text-gray-600">
          Track your class attendance and maintain good academic standing
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Attendance
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addRecord}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
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
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-12 md:col-span-4">
                          <input
                            type="text"
                            placeholder="Course name"
                            value={record.course}
                            onChange={(e) => updateRecord(record.id, 'course', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <input
                            type="number"
                            placeholder="Total"
                            value={record.totalClasses || ''}
                            onChange={(e) => updateRecord(record.id, 'totalClasses', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            min="0"
                          />
                          <label className="text-xs text-gray-500 mt-1 block">Total Classes</label>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <input
                            type="number"
                            placeholder="Attended"
                            value={record.attendedClasses || ''}
                            onChange={(e) => updateRecord(record.id, 'attendedClasses', Math.min(parseInt(e.target.value) || 0, record.totalClasses))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            min="0"
                            max={record.totalClasses}
                          />
                          <label className="text-xs text-gray-500 mt-1 block">Attended</label>
                        </div>
                        <div className="col-span-10 md:col-span-3">
                          {record.totalClasses > 0 && (
                            <div className="text-center">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                                {percentage >= 75 ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                                {percentage.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{status.status}</div>
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 md:col-span-1 flex justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeRecord(record.id)}
                            disabled={records.length === 1}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 sticky top-32"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {calculateOverallAttendance().toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  Average Attendance
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-1">Attendance Guidelines</div>
                <div className="text-xs text-green-700 space-y-1">
                  <div>• 85%+ Excellent</div>
                  <div>• 75%+ Good</div>
                  <div>• 65%+ Warning</div>
                  <div>• Below 65% Critical</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Courses:</span>
                  <span className="font-medium">
                    {records.filter(r => r.course && r.totalClasses > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Classes Today:</span>
                  <span className="font-medium">
                    {records.reduce((sum, r) => sum + r.totalClasses, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attended:</span>
                  <span className="font-medium">
                    {records.reduce((sum, r) => sum + r.attendedClasses, 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalculator;