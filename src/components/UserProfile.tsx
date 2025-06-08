import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
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
    </motion.div>
  );
};

export default UserProfile;