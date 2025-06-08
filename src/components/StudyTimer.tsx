import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Coffee, BookOpen, ArrowLeft } from 'lucide-react';
import { useDataTracker } from '../utils/DataTracker';

interface StudyTimerProps {
  onBack?: () => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onBack }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const dataTracker = useDataTracker();

  const workTime = 25 * 60; // 25 minutes
  const shortBreak = 5 * 60; // 5 minutes
  const longBreak = 15 * 60; // 15 minutes

  useEffect(() => {
    dataTracker.trackToolUsage('timer');
    loadSavedData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      setIsActive(false);
      
      if (!isBreak) {
        const newSessions = sessions + 1;
        const newTotalTime = totalStudyTime + workTime;
        setSessions(newSessions);
        setTotalStudyTime(newTotalTime);
        
        saveSessionData('work', workTime / 60, true, newSessions, newTotalTime / 60);
        
        if (newSessions % 4 === 0) {
          setMinutes(Math.floor(longBreak / 60));
          setSeconds(longBreak % 60);
        } else {
          setMinutes(Math.floor(shortBreak / 60));
          setSeconds(shortBreak % 60);
        }
        setIsBreak(true);
      } else {
        setMinutes(Math.floor(workTime / 60));
        setSeconds(workTime % 60);
        setIsBreak(false);
        
        const breakDuration = sessions % 4 === 0 ? longBreak : shortBreak;
        saveSessionData('break', breakDuration / 60, true, sessions, totalStudyTime / 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, sessions, totalStudyTime]);

  const loadSavedData = async () => {
    try {
      const savedData = await dataTracker.getUserData('timer');
      if (savedData && savedData.length > 0) {
        const latestData = savedData[savedData.length - 1];
        if (latestData['Total Sessions']) {
          setSessions(latestData['Total Sessions']);
        }
        if (latestData['Total Study Time']) {
          setTotalStudyTime(latestData['Total Study Time'] * 60);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveSessionData = async (sessionType: string, duration: number, completed: boolean, totalSessions: number, totalStudyTimeMinutes: number) => {
    try {
      await dataTracker.saveTimerData(sessionType, duration, completed, totalSessions, totalStudyTimeMinutes);
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(Math.floor(workTime / 60));
    setSeconds(workTime % 60);
    setIsBreak(false);
  };

  const resetSession = () => {
    resetTimer();
    setSessions(0);
    setTotalStudyTime(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const progress = isBreak 
    ? ((shortBreak - (minutes * 60 + seconds)) / shortBreak) * 100
    : ((workTime - (minutes * 60 + seconds)) / workTime) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
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
                Pomodoro Study Timer
              </h1>
              <p className="text-white/70">
                Boost your productivity with focused study sessions
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Timer size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              layout
              className="glass-card rounded-2xl p-8 shadow-xl border border-white/20 text-center backdrop-blur-xl"
            >
              <motion.div
                animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                className="mb-8"
              >
                <div className="relative w-64 h-64 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={isBreak ? "#10b981" : "#f97316"}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      key={`${minutes}-${seconds}`}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-bold text-white mb-2"
                    >
                      {formatTime(minutes, seconds)}
                    </motion.div>
                    <div className={`text-lg font-medium ${isBreak ? 'text-green-400' : 'text-orange-400'}`}>
                      {isBreak ? 'Break Time' : 'Focus Time'}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`flex items-center space-x-2 px-8 py-4 rounded-xl text-white font-medium transition-all shadow-lg ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700' 
                      : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'
                  }`}
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isActive ? 'Pause' : 'Start'}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="flex items-center space-x-2 px-6 py-4 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  <RotateCcw size={20} />
                  <span>Reset</span>
                </motion.button>
              </div>

              <motion.div 
                className="mt-8 flex justify-center space-x-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center mr-2">
                      <BookOpen size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{sessions}</div>
                  <div className="text-sm text-white/70">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center mr-2">
                      <Coffee size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(sessions / 4)}
                  </div>
                  <div className="text-sm text-white/70">Long Breaks</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Today's Progress
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {formatTotalTime(totalStudyTime)}
                  </div>
                  <div className="text-sm text-white/70">Total Study Time</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-orange-400/20 rounded-lg border border-white/20">
                    <div className="text-xl font-bold text-orange-400">{sessions}</div>
                    <div className="text-xs text-white/70">Completed</div>
                  </div>
                  <div className="p-3 bg-blue-400/20 rounded-lg border border-white/20">
                    <div className="text-xl font-bold text-blue-400">{sessions % 4}</div>
                    <div className="text-xs text-white/70">Until Long Break</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetSession}
                  className="w-full bg-white/20 text-white py-2 rounded-lg text-sm hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Reset Session
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                How It Works
              </h3>
              
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-xs font-bold">1</span>
                  </div>
                  <div>Work for 25 minutes with full focus</div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-xs font-bold">2</span>
                  </div>
                  <div>Take a 5-minute break</div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-xs font-bold">3</span>
                  </div>
                  <div>After 4 sessions, take a 15-minute long break</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;