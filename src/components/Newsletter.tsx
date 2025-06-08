import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // Google Apps Script Web App URL - replace with your actual URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyD7Q7DMJAMlo0f8eo8EKSQwFDPwx-DGMVebUYeYrv2VCTWa5B2CHtdFvKi5_rp5hnNsQ/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          source: 'academicflow-website'
        })
      });

      // Since we're using no-cors mode, we can't read the response
      // We'll assume success if no error is thrown
      setStatus('success');
      setMessage('Thank you for subscribing! You\'ll receive updates about new tools and features.');
      setEmail('');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-8 lg:p-12 text-center"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-block mb-6"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Mail size={32} className="text-blue-600" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-600 mb-8 font-light leading-relaxed">
          Get notified about new study tools, features, and productivity tips 
          to help you succeed academically.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={status === 'loading'}
              />
            </div>
            <motion.button
              type="submit"
              disabled={status === 'loading' || !email}
              whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
              className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Subscribing...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-4 rounded-2xl flex items-center space-x-3 ${
                  status === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span className="text-sm">{message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-6">
          <p className="text-gray-500 text-sm font-light">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Newsletter;