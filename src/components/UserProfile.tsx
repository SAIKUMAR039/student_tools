import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { userEmail, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {userEmail?.split('@')[0]}
            </div>
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Mail size={12} />
              <span>{userEmail}</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserProfile;