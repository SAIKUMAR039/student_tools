import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EmailGate: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      return;
    }

    setStatus('loading');

    try {
      const success = await login(email);
      if (success) {
        // Authentication successful - the context will handle the state change
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection error. Please check your internet and try again.');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const features = [
    'GPA Calculator',
    'Attendance Tracker', 
    'Study Timer',
    'Grade Tracker',
    'Schedule Planner',
    'Flashcard Study',
    'Budget Tracker',
    'Course Reviews',
    'Student Chat & Notes'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-card rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Mail size={32} className="text-blue-600" />
              </div>
            </motion.div>
            
            <h1 className="text-2xl lg:text-3xl font-light text-gray-900 mb-3">
              Welcome to <span className="font-medium text-blue-600">AcademicFlow</span>
            </h1>
            <p className="text-gray-600 font-light">
              Enter your email to access all academic tools and features
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={status === 'loading'}
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading' || !email}
              whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Accessing Tools...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <span>Access Tools</span>
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl flex items-center space-x-3 ${
                    status === 'error' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {status === 'error' ? (
                    <AlertCircle size={20} />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  <span className="text-sm">{message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">What you'll get access to:</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              We respect your privacy. Your email is only used for access and updates.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailGate;