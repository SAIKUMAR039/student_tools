import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calculator, Calendar, Timer, TrendingUp, BookOpen, Brain, DollarSign, MessageSquare, Users, MessageCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import type { ActiveTool } from '../App';

interface NavigationProps {
  activeTool: ActiveTool;
  onToolSelect: (tool: ActiveTool) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTool, onToolSelect }) => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { id: 'dashboard' as ActiveTool, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'home' as ActiveTool, icon: Home, label: 'Home' },
    { id: 'gpa' as ActiveTool, icon: Calculator, label: 'GPA' },
    { id: 'attendance' as ActiveTool, icon: Calendar, label: 'Attendance' },
    { id: 'timer' as ActiveTool, icon: Timer, label: 'Timer' },
    { id: 'grades' as ActiveTool, icon: TrendingUp, label: 'Grades' },
    { id: 'schedule' as ActiveTool, icon: BookOpen, label: 'Schedule' },
    { id: 'flashcards' as ActiveTool, icon: Brain, label: 'Flashcards' },
    { id: 'expenses' as ActiveTool, icon: DollarSign, label: 'Budget' },
    { id: 'reviews' as ActiveTool, icon: MessageSquare, label: 'Reviews' },
    { id: 'chat' as ActiveTool, icon: Users, label: 'Chat' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl px-2 py-2 shadow-lg border border-white/20"
        >
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onToolSelect(item.id)}
                  className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-white bg-white/20 shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </nav>

      {/* Quick Chat Button - Desktop */}
      <div className="hidden lg:block fixed top-6 left-6 z-50">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onToolSelect('chat')}
          className={`glass-card rounded-2xl p-4 shadow-lg border border-white/20 transition-all duration-200 ${
            activeTool === 'chat'
              ? 'bg-white/20 text-white'
              : 'hover:bg-white/10 text-white/70 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Student Chat"
        >
          <MessageCircle size={24} />
        </motion.button>
      </div>

      {/* User Profile - Desktop */}
      <div className="hidden lg:block fixed top-6 right-6 z-50">
        <UserProfile />
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card border-t border-white/20 px-2 py-2 overflow-x-auto"
        >
          <div className="flex space-x-1 min-w-max px-2">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onToolSelect(item.id)}
                  className={`relative p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                    isActive 
                      ? 'text-white bg-white/20' 
                      : 'text-white/70'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center">
                    <Icon size={20} />
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileTab"
                      className="absolute inset-0 bg-white/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </nav>

      {/* Quick Chat Button - Mobile */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onToolSelect('chat')}
          className={`glass-card rounded-full p-4 shadow-lg border border-white/20 transition-all duration-200 ${
            activeTool === 'chat'
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle size={24} />
        </motion.button>
      </div>

      {/* User Profile - Mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <UserProfile />
      </div>
    </>
  );
};

export default Navigation;