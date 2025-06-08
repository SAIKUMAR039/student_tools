import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataTracker } from '../utils/DataTracker';

const UserProfile: React.FC = () => {
  const { userEmail, logout } = useAuth();
  const dataTracker = useDataTracker();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (showAnalytics && !analytics) {
      loadAnalytics();
    }
  }, [showAnalytics]);

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
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {userEmail?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500">
                {userEmail}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAnalytics}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
              title="View Analytics"
            >
              <BarChart3 size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Analytics Dropdown */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 glass-card rounded-2xl p-6 shadow-lg border border-white/20 z-50"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 size={20} className="mr-2 text-blue-600" />
              Your Analytics
            </h3>

            {analytics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalSessions}</div>
                    <div className="text-xs text-blue-700">Total Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{Math.round(analytics.totalTimeSpent)}</div>
                    <div className="text-xs text-green-700">Minutes Studied</div>
                  </div>
                </div>

                {analytics.mostUsedTool && (
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-700">Most Used Tool</span>
                      <span className="font-medium text-purple-900 capitalize">{analytics.mostUsedTool}</span>
                    </div>
                  </div>
                )}

                {Object.keys(analytics.toolsUsed).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tool Usage</h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.toolsUsed).slice(0, 5).map(([tool, count]) => (
                        <div key={tool} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 capitalize">{tool}</span>
                          <span className="font-medium text-gray-900">{count as number} times</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>Data synced automatically</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                />
                <p className="text-sm text-gray-500">Loading analytics...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;