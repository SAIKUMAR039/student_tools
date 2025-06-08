import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Timer, TrendingUp, BookOpen, Brain, DollarSign, MessageSquare, Users, ArrowRight } from 'lucide-react';
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
      description: 'Calculate semester and cumulative GPA with precision',
      icon: Calculator,
      category: 'Academic',
    },
    {
      id: 'attendance' as ActiveTool,
      title: 'Attendance Tracker',
      description: 'Monitor class attendance and maintain requirements',
      icon: Calendar,
      category: 'Academic',
    },
    {
      id: 'timer' as ActiveTool,
      title: 'Study Timer',
      description: 'Pomodoro technique for focused study sessions',
      icon: Timer,
      category: 'Productivity',
    },
    {
      id: 'grades' as ActiveTool,
      title: 'Grade Tracker',
      description: 'Track assignments and monitor performance',
      icon: TrendingUp,
      category: 'Academic',
    },
    {
      id: 'schedule' as ActiveTool,
      title: 'Schedule Planner',
      description: 'Organize classes and study sessions',
      icon: BookOpen,
      category: 'Planning',
    },
    {
      id: 'flashcards' as ActiveTool,
      title: 'Flashcard Study',
      description: 'Create and study flashcards for better retention',
      icon: Brain,
      category: 'Study',
    },
    {
      id: 'expenses' as ActiveTool,
      title: 'Budget Tracker',
      description: 'Track expenses and manage student budget',
      icon: DollarSign,
      category: 'Finance',
    },
    {
      id: 'reviews' as ActiveTool,
      title: 'Course Reviews',
      description: 'Share and discover honest course reviews',
      icon: MessageSquare,
      category: 'Community',
    },
    {
      id: 'chat' as ActiveTool,
      title: 'Student Chat',
      description: 'Connect with peers and share study notes',
      icon: Users,
      category: 'Community',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="pt-20 lg:pt-24 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16 lg:mb-20"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-6 tracking-tight">
            Academic
            <span className="font-medium text-blue-600"> Flow</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            The complete academic success platform designed for modern students. 
            Track progress, manage time, collaborate with peers, and excel in your studies.
          </p>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-auto-fit gap-6 mb-20"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          
          return (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="cursor-pointer group"
              onClick={() => onToolSelect(tool.id)}
            >
              <div className="glass-card glass-card-hover rounded-2xl p-8 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-blue-50 transition-colors duration-200">
                    <Icon size={24} className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {tool.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
                
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                  <span>Open tool</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mb-20"
      >
        <Newsletter />
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-center pb-16"
      >
        <div className="glass-card rounded-2xl p-12 max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4">
            Built for Students, by Students
          </h2>
          <p className="text-gray-600 leading-relaxed font-light">
            Our comprehensive suite of tools streamlines your academic workflow, 
            helping you track progress, manage time effectively, collaborate with peers,
            and achieve your academic goals with beautiful, intuitive interfaces.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;