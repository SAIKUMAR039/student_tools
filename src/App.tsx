import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import EmailGate from './components/EmailGate';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import GPACalculator from './components/GPACalculator';
import AttendanceCalculator from './components/AttendanceCalculator';
import StudyTimer from './components/StudyTimer';
import GradeTracker from './components/GradeTracker';
import SchedulePlanner from './components/SchedulePlanner';
import FlashcardStudy from './components/FlashcardStudy';
import ExpenseTracker from './components/ExpenseTracker';
import CourseReviews from './components/CourseReviews';
import StudentChat from './components/StudentChat';

export type ActiveTool = 'home' | 'dashboard' | 'gpa' | 'attendance' | 'timer' | 'grades' | 'schedule' | 'flashcards' | 'expenses' | 'reviews' | 'chat';

const AppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('dashboard');
  const { isAuthenticated } = useAuth();

  const renderContent = () => {
    switch (activeTool) {
      case 'home':
        return <Home onToolSelect={setActiveTool} />;
      case 'dashboard':
        return <Dashboard onToolSelect={setActiveTool} />;
      case 'gpa':
        return <GPACalculator onBack={() => setActiveTool('dashboard')} />;
      case 'attendance':
        return <AttendanceCalculator onBack={() => setActiveTool('dashboard')} />;
      case 'timer':
        return <StudyTimer onBack={() => setActiveTool('dashboard')} />;
      case 'grades':
        return <GradeTracker onBack={() => setActiveTool('dashboard')} />;
      case 'schedule':
        return <SchedulePlanner onBack={() => setActiveTool('dashboard')} />;
      case 'flashcards':
        return <FlashcardStudy onBack={() => setActiveTool('dashboard')} />;
      case 'expenses':
        return <ExpenseTracker onBack={() => setActiveTool('dashboard')} />;
      case 'reviews':
        return <CourseReviews onBack={() => setActiveTool('dashboard')} />;
      case 'chat':
        return <StudentChat onBack={() => setActiveTool('dashboard')} />;
      default:
        return <Dashboard onToolSelect={setActiveTool} />;
    }
  };

  if (!isAuthenticated) {
    return <EmailGate />;
  }

  const isDashboardOrHome = activeTool === 'dashboard' || activeTool === 'home';
  const isToolPage = !isDashboardOrHome;

  return (
    <div className={`min-h-screen ${isDashboardOrHome ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600' : 'bg-gray-50'}`}>
      <div className="relative min-h-screen">
        {!isDashboardOrHome && (
          <Navigation activeTool={activeTool} onToolSelect={setActiveTool} />
        )}
        
        <main className={!isDashboardOrHome ? 'pb-20 lg:pb-8' : ''}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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