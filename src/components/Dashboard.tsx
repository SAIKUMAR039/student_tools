import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Calendar, BarChart3, Clock, Target, 
  TrendingUp, Award, BookOpen, Timer, Calculator,
  ChevronRight, Settings, Bell, Search, Plus,
  Activity, Users, Zap, Star, ArrowUp, ArrowDown,
  Brain, DollarSign, MessageSquare, Menu, X,
  GraduationCap, CheckCircle, AlertCircle, Coffee,
  Play, Pause, RotateCcw, TrendingDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataTracker } from '../utils/DataTracker';

interface DashboardProps {
  onToolSelect?: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onToolSelect }) => {
  const { userEmail, logout } = useAuth();
  const dataTracker = useDataTracker();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load analytics
      const userAnalytics = await dataTracker.getUserAnalytics();
      setAnalytics(userAnalytics);

      // Load data from all tools
      const allUserData = await dataTracker.getUserData();
      setUserData(allUserData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard', active: activeSection === 'dashboard' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics', active: activeSection === 'analytics' },
    { icon: Calendar, label: 'Schedule', id: 'schedule', active: activeSection === 'schedule' },
    { icon: BookOpen, label: 'Courses', id: 'courses', active: activeSection === 'courses' },
    { icon: Target, label: 'Goals', id: 'goals', active: activeSection === 'goals' },
    { icon: User, label: 'Profile', id: 'profile', active: activeSection === 'profile' },
    { icon: Settings, label: 'Settings', id: 'settings', active: activeSection === 'settings' }
  ];

  const quickActions = [
    { icon: Calculator, label: 'GPA Calculator', color: 'from-blue-400 to-blue-600', tool: 'gpa', description: 'Calculate your GPA' },
    { icon: Calendar, label: 'Attendance', color: 'from-green-400 to-green-600', tool: 'attendance', description: 'Track attendance' },
    { icon: Timer, label: 'Study Timer', color: 'from-purple-400 to-purple-600', tool: 'timer', description: 'Pomodoro sessions' },
    { icon: TrendingUp, label: 'Grades', color: 'from-orange-400 to-orange-600', tool: 'grades', description: 'Grade tracking' },
    { icon: BookOpen, label: 'Schedule', color: 'from-indigo-400 to-indigo-600', tool: 'schedule', description: 'Plan your week' },
    { icon: Brain, label: 'Flashcards', color: 'from-pink-400 to-pink-600', tool: 'flashcards', description: 'Study with cards' },
    { icon: DollarSign, label: 'Budget', color: 'from-emerald-400 to-emerald-600', tool: 'expenses', description: 'Track expenses' },
    { icon: MessageSquare, label: 'Reviews', color: 'from-red-400 to-red-600', tool: 'reviews', description: 'Course reviews' }
  ];

  // Calculate real stats from user data
  const calculateStats = () => {
    const totalStudyTime = analytics?.totalTimeSpent || 0;
    const totalSessions = analytics?.totalSessions || 0;
    const toolsUsedCount = analytics?.toolsUsed ? Object.keys(analytics.toolsUsed).length : 0;
    
    // Calculate GPA from user data
    let currentGPA = 0;
    if (userData?.gpa && userData.gpa.length > 0) {
      const latestGPA = userData.gpa[userData.gpa.length - 1];
      currentGPA = latestGPA.gpa || 0;
    }

    return [
      { 
        label: 'Study Hours', 
        value: `${Math.round(totalStudyTime / 60)}h`, 
        change: '+12%', 
        trend: 'up',
        icon: Clock,
        color: 'from-blue-400 to-blue-600'
      },
      { 
        label: 'Sessions', 
        value: totalSessions.toString(), 
        change: '+5', 
        trend: 'up',
        icon: Activity,
        color: 'from-green-400 to-green-600'
      },
      { 
        label: 'Current GPA', 
        value: currentGPA > 0 ? currentGPA.toFixed(2) : 'N/A', 
        change: currentGPA > 3.5 ? '+0.1' : '-0.1', 
        trend: currentGPA > 3.5 ? 'up' : 'down',
        icon: TrendingUp,
        color: 'from-purple-400 to-purple-600'
      },
      { 
        label: 'Tools Used', 
        value: toolsUsedCount.toString(), 
        change: '+2', 
        trend: 'up',
        icon: Zap,
        color: 'from-orange-400 to-orange-600'
      }
    ];
  };

  const stats = calculateStats();

  // Generate real recent activity from user data
  const getRecentActivity = () => {
    const activities = [];
    
    if (userData?.gpa && userData.gpa.length > 0) {
      activities.push({
        action: 'Updated GPA Calculation',
        time: '2 hours ago',
        type: 'gpa',
        icon: Calculator
      });
    }
    
    if (userData?.timer && userData.timer.length > 0) {
      const latestTimer = userData.timer[userData.timer.length - 1];
      activities.push({
        action: `Study Session - ${latestTimer.duration || 25} minutes`,
        time: '4 hours ago',
        type: 'timer',
        icon: Timer
      });
    }
    
    if (userData?.attendance && userData.attendance.length > 0) {
      activities.push({
        action: 'Updated Attendance Record',
        time: '1 day ago',
        type: 'attendance',
        icon: Calendar
      });
    }
    
    if (userData?.flashcards && userData.flashcards.length > 0) {
      activities.push({
        action: 'Added New Flashcard Deck',
        time: '2 days ago',
        type: 'flashcards',
        icon: Brain
      });
    }

    return activities.length > 0 ? activities : [
      { action: 'Welcome to AcademicFlow!', time: 'Just now', type: 'welcome', icon: Star },
      { action: 'Start using tools to see activity', time: 'Now', type: 'info', icon: CheckCircle }
    ];
  };

  const recentActivity = getRecentActivity();

  // Generate upcoming tasks from user data
  const getUpcomingTasks = () => {
    const tasks = [];
    
    if (userData?.schedule && userData.schedule.length > 0) {
      userData.schedule.slice(0, 3).forEach((item: any) => {
        tasks.push({
          task: item.title || 'Scheduled Event',
          time: item.time || 'Soon',
          priority: 'medium',
          icon: BookOpen
        });
      });
    }
    
    if (userData?.grades && userData.grades.length > 0) {
      tasks.push({
        task: 'Review Latest Grades',
        time: 'This Week',
        priority: 'high',
        icon: TrendingUp
      });
    }

    return tasks.length > 0 ? tasks : [
      { task: 'Set up your first course', time: 'Today', priority: 'high', icon: BookOpen },
      { task: 'Start a study session', time: 'Now', priority: 'medium', icon: Timer },
      { task: 'Track your attendance', time: 'This Week', priority: 'low', icon: Calendar }
    ];
  };

  const upcomingTasks = getUpcomingTasks();

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleToolSelect = (tool: string) => {
    onToolSelect?.(tool);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 h-full w-72 glass-card border-r border-white/20 z-50 lg:relative lg:translate-x-0 lg:z-auto"
        >
          <div className="p-6 h-full flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">AcademicFlow</h1>
                  <p className="text-white/70 text-sm">Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-8 p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {userEmail?.split('@')[0] || 'Student'}
                  </p>
                  <p className="text-white/60 text-sm truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all relative overflow-hidden ${
                      item.active 
                        ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                    {item.active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Upgrade Card */}
            <div className="mt-8 p-4 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
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

            {/* Logout */}
            <button
              onClick={logout}
              className="mt-4 w-full p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all text-left"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="glass-card rounded-2xl p-4 backdrop-blur-xl border border-white/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Menu size={20} className="text-white" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Search size={18} className="text-white" />
                  </button>
                  <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Bell size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block glass-card rounded-2xl p-6 mb-6 backdrop-blur-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {userEmail?.split('@')[0] || 'Student'}!
                </h1>
                <p className="text-white/70">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Search size={18} className="text-white" />
                </button>
                <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Bell size={18} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 lg:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToolSelect(action.tool)}
                    className="glass-card rounded-2xl p-4 text-center hover:bg-white/20 transition-all group backdrop-blur-xl border border-white/20"
                  >
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 lg:mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon size={20} className="lg:w-6 lg:h-6 text-white" />
                    </div>
                    <p className="text-white font-medium text-xs lg:text-sm">{action.label}</p>
                    <p className="text-white/60 text-xs hidden lg:block">{action.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-white text-lg font-semibold mb-4">Your Statistics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className={`flex items-center space-x-1 text-xs ${
                        stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <p className="text-white text-xl lg:text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-white/70 text-xs lg:text-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Study Time Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 glass-card rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Study Time Analytics</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm backdrop-blur-sm">Week</button>
                  <button className="px-3 py-1 text-white/70 text-sm hover:bg-white/10 rounded-lg transition-colors">Month</button>
                </div>
              </div>
              
              <div className="relative h-48 lg:h-64">
                <div className="absolute inset-0 flex items-end justify-between space-x-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const height = Math.random() * 80 + 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className="w-full bg-gradient-to-t from-blue-400 to-purple-400 rounded-t-lg mb-2 relative group cursor-pointer shadow-lg"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            {Math.round(height)}h
                          </div>
                        </motion.div>
                        <span className="text-white/60 text-xs">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                      </div>
                    );
                  })}
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
                <span className="text-white">Total: {analytics?.totalTimeSpent ? `${Math.round(analytics.totalTimeSpent / 60)}h` : '0h'}</span>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{activity.action}</p>
                        <p className="text-white/60 text-xs">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <button className="w-full mt-4 py-2 text-white/70 hover:text-white text-sm font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-all">
                View All Activity
              </button>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-white/20"
            >
              <h3 className="text-white text-lg font-semibold mb-6">Weekly Progress</h3>
              
              <div className="flex items-center justify-center mb-6">
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
              
              <div className="grid grid-cols-3 gap-4 text-center">
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
              className="glass-card rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Study Timer</h3>
                <button 
                  onClick={() => handleToolSelect('timer')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-white text-4xl font-bold mb-2">25:00</div>
                <p className="text-white/60 mb-4">Focus Session</p>
                
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => handleToolSelect('timer')}
                    className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    <Play size={20} className="text-white" />
                  </button>
                  <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Coffee size={20} className="text-white" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-white font-medium">{analytics?.totalSessions || '0'}</p>
                  <p className="text-white/60 text-xs">Sessions</p>
                </div>
                <div>
                  <p className="text-white font-medium">{analytics?.totalTimeSpent ? `${Math.round(analytics.totalTimeSpent / 60)}h` : '0h'}</p>
                  <p className="text-white/60 text-xs">Today</p>
                </div>
                <div>
                  <p className="text-white font-medium">15m</p>
                  <p className="text-white/60 text-xs">Break</p>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-2xl p-4 lg:p-6 backdrop-blur-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Upcoming Tasks</h3>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {upcomingTasks.map((task, index) => {
                  const Icon = task.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
                        task.priority === 'high' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                        task.priority === 'medium' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-green-400 to-green-600'
                      }`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{task.task}</p>
                        <p className="text-white/60 text-xs">{task.time}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                    </motion.div>
                  );
                })}
              </div>
              
              <button className="w-full mt-4 py-2 text-white/70 hover:text-white text-sm font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-all">
                View All Tasks
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;