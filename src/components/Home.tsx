import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Timer, TrendingUp, BookOpen, GraduationCap } from 'lucide-react';
import Newsletter from './Newsletter';
import type { ActiveTool } from '../App';

interface HomeProps {
  onToolSelect: (tool: ActiveTool) => void;
}

const Home: React.FC<HomeProps> = ({ onToolSelect }) => {
  const tools = [
    {
      id: 'gpa' as ActiveTool,
      title: 'GPA Calculator',
      description: 'Calculate your semester and cumulative GPA with ease',
      icon: Calculator,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'attendance' as ActiveTool,
      title: 'Attendance Tracker',
      description: 'Track your class attendance and maintain good standing',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'timer' as ActiveTool,
      title: 'Study Timer',
      description: 'Pomodoro timer to boost your productivity and focus',
      icon: Timer,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 'grades' as ActiveTool,
      title: 'Grade Tracker',
      description: 'Monitor your grades and academic performance',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'schedule' as ActiveTool,
      title: 'Schedule Planner',
      description: 'Organize your classes and study sessions',
      icon: BookOpen,
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="pt-24 lg:pt-32 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-4"
        >
          <GraduationCap size={60} className="text-blue-600" />
        </motion.div>
        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Student Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Essential academic tools designed to help you succeed in your studies and manage your academic life efficiently.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          
          return (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => onToolSelect(tool.id)}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 h-full hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-16"
      >
        <Newsletter />
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center"
      >
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Built for Students, by Students
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our comprehensive suite of tools is designed to streamline your academic workflow, 
            helping you track progress, manage time effectively, and achieve your academic goals 
            with beautiful, intuitive interfaces.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;