import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator, ArrowLeft } from 'lucide-react';
import { useDataTracker } from '../utils/DataTracker';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface GPACalculatorProps {
  onBack?: () => void;
}

const GPACalculator: React.FC<GPACalculatorProps> = ({ onBack }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: 3, grade: '' }
  ]);
  const [gpa, setGPA] = useState<number | null>(null);
  const dataTracker = useDataTracker();

  const gradePoints: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  useEffect(() => {
    dataTracker.trackToolUsage('gpa');
    loadSavedData();
  }, []);

  useEffect(() => {
    calculateGPA();
  }, [courses]);

  useEffect(() => {
    if (courses.some(course => course.name && course.grade) && gpa !== null) {
      saveData();
    }
  }, [courses, gpa]);

  const loadSavedData = async () => {
    try {
      const savedData = await dataTracker.getUserData('gpa');
      if (savedData && savedData.length > 0) {
        const latestData = savedData[savedData.length - 1];
        if (latestData.courses) {
          setCourses(latestData.courses);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async () => {
    try {
      const validCourses = courses.filter(course => course.name && course.grade);
      if (validCourses.length > 0 && gpa !== null) {
        await dataTracker.saveGPAData(validCourses, gpa);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      credits: 3,
      grade: ''
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    const validCourses = courses.filter(course => course.grade && course.credits > 0);
    
    if (validCourses.length === 0) {
      setGPA(null);
      return;
    }

    const totalPoints = validCourses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] * course.credits);
    }, 0);

    const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    
    setGPA(totalPoints / totalCredits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                GPA Calculator
              </h1>
              <p className="text-white/70">
                Calculate your semester GPA by entering your courses and grades
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Calculator size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Your Courses
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addCourse}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Add Course</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-12 gap-4 mb-4 items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Course name"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Credits"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                        min="0"
                        max="10"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                      >
                        <option value="" className="bg-gray-800">Grade</option>
                        {Object.keys(gradePoints).map(grade => (
                          <option key={grade} value={grade} className="bg-gray-800">{grade}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length === 1}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 sticky top-8 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Your GPA
              </h3>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-6"
              >
                {gpa !== null ? (
                  <motion.div
                    key={gpa}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6"
                  >
                    <div className="text-4xl font-bold text-white mb-2">
                      {gpa.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/70">
                      Current GPA
                    </div>
                    <div className={`text-sm mt-2 ${
                      gpa >= 3.7 ? 'text-green-400' :
                      gpa >= 3.0 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {gpa >= 3.7 ? 'Excellent' :
                       gpa >= 3.0 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </motion.div>
                ) : (
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-white/40 mb-2">
                      --
                    </div>
                    <div className="text-sm text-white/50">
                      Add courses to calculate
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Total Courses:</span>
                  <span className="font-medium text-white">{courses.filter(c => c.grade).length}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Total Credits:</span>
                  <span className="font-medium text-white">
                    {courses.filter(c => c.grade).reduce((sum, c) => sum + c.credits, 0)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl border border-white/20">
                <h4 className="font-medium text-white mb-3">Grade Scale</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(gradePoints).slice(0, 6).map(([grade, points]) => (
                    <div key={grade} className="flex justify-between text-white/80">
                      <span>{grade}</span>
                      <span>{points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;