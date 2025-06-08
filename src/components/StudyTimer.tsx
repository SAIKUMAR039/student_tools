import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Coffee, BookOpen } from 'lucide-react';

const StudyTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const workTime = 25 * 60; // 25 minutes
  const shortBreak = 5 * 60; // 5 minutes
  const longBreak = 15 * 60; // 15 minutes

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
      // Timer finished
      setIsActive(false);
      
      if (!isBreak) {
        // Work session completed
        setSessions(prev => prev + 1);
        setTotalStudyTime(prev => prev + workTime);
        
        // Start break
        if ((sessions + 1) % 4 === 0) {
          // Long break after 4 sessions
          setMinutes(Math.floor(longBreak / 60));
          setSeconds(longBreak % 60);
        } else {
          // Short break
          setMinutes(Math.floor(shortBreak / 60));
          setSeconds(shortBreak % 60);
        }
        setIsBreak(true);
      } else {
        // Break completed, start new work session
        setMinutes(Math.floor(workTime / 60));
        setSeconds(workTime % 60);
        setIsBreak(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, sessions]);

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
    <div className="pt-24 lg:pt-32 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <Timer size={48} className="mx-auto mb-4 text-orange-600" />
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Pomodoro Study Timer
        </h1>
        <p className="text-gray-600">
          Boost your productivity with focused study sessions
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 text-center"
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
                    stroke="#f3f4f6"
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
                    className="text-6xl font-bold text-gray-900 mb-2"
                  >
                    {formatTime(minutes, seconds)}
                  </motion.div>
                  <div className={`text-lg font-medium ${isBreak ? 'text-green-600' : 'text-orange-600'}`}>
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
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl text-white font-medium transition-colors ${
                  isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
                <span>{isActive ? 'Pause' : 'Start'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="flex items-center space-x-2 px-6 py-4 rounded-xl bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors"
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
                  <BookOpen size={20} className="text-blue-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{sessions}</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Coffee size={20} className="text-green-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor(sessions / 4)}
                </div>
                <div className="text-sm text-gray-600">Long Breaks</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Progress
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatTotalTime(totalStudyTime)}
                </div>
                <div className="text-sm text-gray-600">Total Study Time</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{sessions}</div>
                  <div className="text-xs text-orange-700">Completed</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{sessions % 4}</div>
                  <div className="text-xs text-blue-700">Until Long Break</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetSession}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Reset Session
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How It Works
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 text-xs font-bold">1</span>
                </div>
                <div>Work for 25 minutes with full focus</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <div>Take a 5-minute break</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <div>After 4 sessions, take a 15-minute long break</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;