import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calculator, Calendar, Timer, TrendingUp, BookOpen, Brain, DollarSign, MessageSquare } from 'lucide-react';
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
    { id: 'home' as ActiveTool, icon: Home, label: 'Home' },
    { id: 'gpa' as ActiveTool, icon: Calculator, label: 'GPA' },
    { id: 'attendance' as ActiveTool, icon: Calendar, label: 'Attendance' },
    { id: 'timer' as ActiveTool, icon: Timer, label: 'Timer' },
    { id: 'grades' as ActiveTool, icon: TrendingUp, label: 'Grades' },
    { id: 'schedule' as ActiveTool, icon: BookOpen, label: 'Schedule' },
    { id: 'flashcards' as ActiveTool, icon: Brain, label: 'Flashcards' },
    { id: 'expenses' as ActiveTool, icon: DollarSign, label: 'Budget' },
    { id: 'reviews' as ActiveTool, icon: MessageSquare, label: 'Reviews' },
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
          className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-white/20"
        >
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onToolSelect(item.id)}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </nav>

      {/* User Profile - Desktop */}
      <div className="hidden lg:block fixed top-6 right-6 z-50">
        <UserProfile />
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl border-t border-white/20 px-2 py-2 overflow-x-auto"
        >
          <div className="flex space-x-1 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onToolSelect(item.id)}
                  className={`relative p-3 rounded-xl transition-colors flex-shrink-0 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex flex-col items-center">
                    <Icon size={20} />
                    <span className="text-xs mt-1">{item.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </nav>

      {/* User Profile - Mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <UserProfile />
      </div>
    </>
  );
};

export default Navigation;