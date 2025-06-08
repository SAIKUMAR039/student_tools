import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, BarChart3, Clock, TrendingUp, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataTracker } from '../utils/DataTracker';

const UserProfile: React.FC = () => {
  const { userEmail, logout } = useAuth();
  const dataTracker = useDataTracker();
  const [showDropdown, setShowDropdown] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (showDropdown && !analytics) {
      loadAnalytics();
    }
  }, [showDropdown]);

  const loadAnalytics = async () => {
    try {
      const userAnalytics = await dataTracker.getUserAnalytics();
      setAnalytics(userAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleDropdown}
        className="glass-card rounded-2xl p-4 shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="hidden lg:block">
            <div className="text-sm font-medium text-white">
              {userEmail?.split('@')[0] || 'Student'}
            </div>
            <div className="text-xs text-white/70">
              {userEmail}
            </div>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-white/70 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
          />
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 glass-card rounded-2xl p-6 shadow-xl border border-white/20 z-50"
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {userEmail?.split('@')[0] || 'Student'}
                </h3>
                <p className="text-white/70 text-sm truncate">{userEmail}</p>
              </div>
            </div>

            {/* Quick Stats */}
            {analytics ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white/10 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Clock size={16} className="text-blue-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    {Math.round((analytics.totalTimeSpent || 0) / 60)}h
                  </div>
                  <div className="text-xs text-white/70">Study Time</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp size={16} className="text-green-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    {analytics.totalSessions || 0}
                  </div>
                  <div className="text-xs text-white/70">Sessions</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"
                />
                <p className="text-sm text-white/70">Loading analytics...</p>
              </div>
            )}

            {/* Most Used Tool */}
            {analytics?.mostUsedTool && (
              <div className="mb-6 p-3 bg-white/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Most Used Tool</span>
                  <span className="font-medium text-white capitalize">
                    {analytics.mostUsedTool}
                  </span>
                </div>
              </div>
            )}

            {/* Tool Usage */}
            {analytics?.toolsUsed && Object.keys(analytics.toolsUsed).length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                  <BarChart3 size={16} className="mr-2" />
                  Tool Usage
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {Object.entries(analytics.toolsUsed)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([tool, count]) => (
                    <div key={tool} className="flex justify-between items-center text-sm">
                      <span className="text-white/70 capitalize">{tool}</span>
                      <span className="font-medium text-white">{count as number} times</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <div className="flex items-center text-xs text-white/50">
                <Clock size={12} className="mr-1" />
                <span>Data synced automatically</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;