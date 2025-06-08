import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Calendar, BarChart3, Clock, Target, 
  TrendingUp, Award, BookOpen, Timer, Calculator,
  ChevronRight, Settings, Bell, Search, Plus,
  Activity, Users, Zap, Star, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onToolSelect?: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onToolSelect }) => {
  const { userEmail } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: User, label: 'Profile' },
    { icon: Calendar, label: 'Schedule' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: BookOpen, label: 'Courses' },
    { icon: Target, label: 'Goals' },
    { icon: Settings, label: 'Settings' }
  ];

  const quickActions = [
    { icon: Calculator, label: 'GPA Calculator', color: 'bg-blue-500', tool: 'gpa' },
    { icon: Calendar, label: 'Attendance', color: 'bg-green-500', tool: 'attendance' },
    { icon: Timer, label: 'Study Timer', color: 'bg-purple-500', tool: 'timer' },
    { icon: TrendingUp, label: 'Grades', color: 'bg-orange-500', tool: 'grades' }
  ];

  const stats = [
    { label: 'Study Hours', value: '142.904', change: '+12%', trend: 'up' },
    { label: 'GPA', value: '3.85', change: '+0.2', trend: 'up' },
    { label: 'Attendance', value: '94.2%', change: '-1.2%', trend: 'down' },
    { label: 'Assignments', value: '23', change: '+5', trend: 'up' }
  ];

  const recentActivity = [
    { action: 'Completed Math Assignment', time: '2 hours ago', type: 'assignment' },
    { action: 'Study Session - Physics', time: '4 hours ago', type: 'study' },
    { action: 'Attended Chemistry Lab', time: '1 day ago', type: 'attendance' },
    { action: 'Quiz Score: 95%', time: '2 days ago', type: 'grade' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 lg:p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Home size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">AcadFlow</h1>
                <p className="text-white/70 text-sm">Academic Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-white/90 text-sm">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                <Search size={18} className="text-white" />
              </button>
              <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                <Bell size={18} className="text-white" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-4 lg:p-6">
              <div className="space-y-2">
                {sidebarItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        item.active 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                      {item.active && <ChevronRight size={16} className="ml-auto" />}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Upgrade Plan</p>
                    <p className="text-white/60 text-xs">Get premium features</p>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                  Upgrade Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToolSelect?.(action.tool)}
                    className="glass-card rounded-2xl p-4 lg:p-6 text-center hover:bg-white/20 transition-all"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <p className="text-white font-medium text-sm lg:text-base">{action.label}</p>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/70 text-xs lg:text-sm">{stat.label}</p>
                    <div className={`flex items-center space-x-1 ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      <span className="text-xs">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-white text-xl lg:text-2xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Main Dashboard Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Study Time Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 glass-card rounded-2xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-semibold">Study Time Analytics</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm">Week</button>
                    <button className="px-3 py-1 text-white/70 text-sm hover:bg-white/10 rounded-lg">Month</button>
                  </div>
                </div>
                
                <div className="relative h-48 lg:h-64">
                  {/* Simulated Chart */}
                  <div className="absolute inset-0 flex items-end justify-between space-x-2">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.random() * 80 + 20}%` }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className="w-full bg-gradient-to-t from-blue-400 to-purple-400 rounded-t-lg mb-2"
                        />
                        <span className="text-white/60 text-xs">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-white/70">Study Hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-white/70">Break Time</span>
                    </div>
                  </div>
                  <span className="text-white">Total: 42.5h</span>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
                  <button className="text-white/70 hover:text-white">
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'assignment' ? 'bg-blue-500' :
                        activity.type === 'study' ? 'bg-purple-500' :
                        activity.type === 'attendance' ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {activity.type === 'assignment' && <BookOpen size={14} className="text-white" />}
                        {activity.type === 'study' && <Clock size={14} className="text-white" />}
                        {activity.type === 'attendance' && <Users size={14} className="text-white" />}
                        {activity.type === 'grade' && <Star size={14} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{activity.action}</p>
                        <p className="text-white/60 text-xs">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <button className="w-full mt-4 py-2 text-white/70 hover:text-white text-sm font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-all">
                  View All Activity
                </button>
              </motion.div>
            </div>

            {/* Bottom Cards */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Ring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-4 lg:p-6"
              >
                <h3 className="text-white text-lg font-semibold mb-6">Weekly Progress</h3>
                
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.75) }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white text-2xl font-bold">75%</p>
                        <p className="text-white/60 text-xs">Complete</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white text-lg font-bold">12</p>
                    <p className="text-white/60 text-xs">Completed</p>
                  </div>
                  <div>
                    <p className="text-white text-lg font-bold">4</p>
                    <p className="text-white/60 text-xs">In Progress</p>
                  </div>
                  <div>
                    <p className="text-white text-lg font-bold">2</p>
                    <p className="text-white/60 text-xs">Pending</p>
                  </div>
                </div>
              </motion.div>

              {/* Study Timer Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-2xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-semibold">Study Timer</h3>
                  <button 
                    onClick={() => onToolSelect?.('timer')}
                    className="text-white/70 hover:text-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-white text-4xl font-bold mb-2">25:00</div>
                  <p className="text-white/60 mb-6">Focus Session</p>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                      <Timer size={20} className="text-white" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Settings size={20} className="text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="text-white font-medium">4</p>
                    <p className="text-white/60 text-xs">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">2.5h</p>
                    <p className="text-white/60 text-xs">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">15m</p>
                    <p className="text-white/60 text-xs">Break</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;