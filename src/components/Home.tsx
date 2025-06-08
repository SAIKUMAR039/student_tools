import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, Calendar, Timer, TrendingUp, BookOpen, Brain, 
  DollarSign, MessageSquare, Users, ArrowRight, Play, Github,
  Mail, MessageCircle, FileText, Bug, Star, ExternalLink,
  React as ReactIcon, Palette, Zap, Database, Grid, Send
} from 'lucide-react';
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
      description: 'Calculate semester and cumulative GPA with precision. Support for multiple grading scales and credit hour weighting.',
      icon: Calculator,
      color: 'bg-blue-500',
      features: ['Real-time GPA updates', 'Multiple grading scales', 'Credit hour weighting']
    },
    {
      id: 'attendance' as ActiveTool,
      title: 'Attendance Tracker',
      description: 'Monitor class attendance with visual indicators and color-coded status system for all courses.',
      icon: Calendar,
      color: 'bg-green-500',
      features: ['Visual percentage indicators', 'Color-coded status', 'Overall statistics']
    },
    {
      id: 'timer' as ActiveTool,
      title: 'Pomodoro Timer',
      description: 'Scientifically-proven 25-minute focus sessions with automatic break scheduling and productivity analytics.',
      icon: Timer,
      color: 'bg-red-500',
      features: ['25-minute focus sessions', 'Automatic breaks', 'Session tracking']
    },
    {
      id: 'grades' as ActiveTool,
      title: 'Grade Tracker',
      description: 'Comprehensive assignment and exam grade management with weighted scoring and performance trends.',
      icon: TrendingUp,
      color: 'bg-purple-500',
      features: ['Assignment tracking', 'Weighted scoring', 'Performance analytics']
    },
    {
      id: 'schedule' as ActiveTool,
      title: 'Schedule Planner',
      description: 'Weekly schedule organization with multiple event types and color-coded visualization.',
      icon: BookOpen,
      color: 'bg-orange-500',
      features: ['Weekly organization', 'Multiple event types', 'Color-coded display']
    },
    {
      id: 'chat' as ActiveTool,
      title: 'Secure Access',
      description: 'Email-gated access system with Google Sheets integration and persistent login sessions.',
      icon: Users,
      color: 'bg-indigo-500',
      features: ['Email authentication', 'Secure sessions', 'Data protection']
    }
  ];

  const technologies = [
    { name: 'React 18', description: 'TypeScript', icon: ReactIcon, color: 'bg-blue-100 text-blue-600' },
    { name: 'Tailwind CSS', description: 'Styling', icon: Palette, color: 'bg-cyan-100 text-cyan-600' },
    { name: 'Framer Motion', description: 'Animations', icon: Zap, color: 'bg-purple-100 text-purple-600' },
    { name: 'Apps Script', description: 'Backend', icon: Database, color: 'bg-green-100 text-green-600' },
    { name: 'Google Sheets', description: 'Database', icon: Grid, color: 'bg-orange-100 text-orange-600' },
    { name: 'Netlify', description: 'Deployment', icon: Send, color: 'bg-teal-100 text-teal-600' }
  ];

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get direct help from our support team',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
      action: 'support@academicflow.com',
      link: 'mailto:support@academicflow.com'
    },
    {
      title: 'Discord Community',
      description: 'Join our active community of students',
      icon: MessageCircle,
      color: 'bg-purple-100 text-purple-600',
      action: 'Join Discord',
      link: '#'
    },
    {
      title: 'Documentation',
      description: 'Complete setup and usage guides',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
      action: 'View Docs',
      link: '#'
    },
    {
      title: 'Bug Reports',
      description: 'Report issues and request features',
      icon: Bug,
      color: 'bg-red-100 text-red-600',
      action: 'GitHub Issues',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Calculator size={20} className="text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">AcademicFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              <a href="#technology" className="text-gray-600 hover:text-gray-900 transition-colors">Technology</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToolSelect('home')}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The Complete Academic Success Platform
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                AcademicFlow provides everything students need to track progress, manage time, 
                and achieve educational goals with beautiful, iOS-inspired design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToolSelect('home')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play size={20} />
                  <span>Try Live Demo</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Github size={20} />
                  <span>View on GitHub</span>
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-500 h-20 rounded-lg flex items-center justify-center">
                        <Calculator size={24} className="text-white" />
                      </div>
                      <div className="bg-green-500 h-20 rounded-lg flex items-center justify-center">
                        <Calendar size={24} className="text-white" />
                      </div>
                      <div className="bg-purple-500 h-20 rounded-lg flex items-center justify-center">
                        <Timer size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-32 rounded-lg flex items-center justify-center">
                      <TrendingUp size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Academic Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to excel in your studies, beautifully designed and scientifically proven.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => onToolSelect(tool.id)}
                >
                  <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by cutting-edge tools and frameworks for optimal performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${tech.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              See AcademicFlow in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the beautiful, intuitive interface designed for student success.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-white">
                        <Calendar size={16} />
                        <span className="text-sm">Miércoles</span>
                      </div>
                      <div className="space-y-2">
                        {['Reading', 'Sociales', 'Carnings', 'Rehome', 'Grades'].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-gray-300 text-sm">
                            <span>{item}</span>
                            <ArrowRight size={12} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Study Timer</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        ['Tapl', '150', '123', '293', 'Mai'],
                        ['Time', '150', '123', '293', 'Mai'],
                        ['Fno', '68', '151', '861', '847'],
                        ['Acce', '155', '122', '415', 'Mai'],
                        ['Fdo', '116', '184', '203', '512'],
                        ['Cay', '90', '59', '5.0', '547'],
                        ['Stoe', '109', '937', '299', '4405']
                      ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-2 text-xs">
                          {row.map((cell, cellIdx) => (
                            <span key={cellIdx} className={cellIdx === 0 ? 'font-medium' : 'text-gray-600'}>
                              {cell}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white">
                    <h3 className="font-semibold mb-4">Grade</h3>
                    <div className="space-y-2">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className="flex items-end space-x-1">
                          <div className={`bg-yellow-400 rounded-sm ${
                            i === 6 ? 'h-12' : `h-${4 + i}`
                          } w-6`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToolSelect('home')}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <ExternalLink size={20} />
                <span>Launch Live Demo</span>
              </motion.button>
              <p className="text-gray-600 mt-4">
                No registration required • Full feature access
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you succeed with comprehensive documentation and community support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {option.description}
                  </p>
                  <a
                    href={option.link}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    {option.action}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Academic Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using AcademicFlow to achieve their educational goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToolSelect('home')}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <ArrowRight size={20} />
                <span>Get Started Free</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Star size={20} />
                <span>Star on GitHub</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Newsletter />
        </div>
      </section>
    </div>
  );
};

export default Home;