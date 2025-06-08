import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import EmailGate from './components/EmailGate';
import Home from './components/Home';
import GPACalculator from './components/GPACalculator';
import AttendanceCalculator from './components/AttendanceCalculator';
import StudyTimer from './components/StudyTimer';
import GradeTracker from './components/GradeTracker';
import SchedulePlanner from './components/SchedulePlanner';

export type ActiveTool = 'home' | 'gpa' | 'attendance' | 'timer' | 'grades' | 'schedule';

const AppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('home');
  const { isAuthenticated } = useAuth();

  const renderContent = () => {
    switch (activeTool) {
      case 'home':
        return <Home onToolSelect={setActiveTool} />;
      case 'gpa':
        return <GPACalculator />;
      case 'attendance':
        return <AttendanceCalculator />;
      case 'timer':
        return <StudyTimer />;
      case 'grades':
        return <GradeTracker />;
      case 'schedule':
        return <SchedulePlanner />;
      default:
        return <Home onToolSelect={setActiveTool} />;
    }
  };

  if (!isAuthenticated) {
    return <EmailGate />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="relative min-h-screen">
        <Navigation activeTool={activeTool} onToolSelect={setActiveTool} />
        
        <main className="pb-20 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;