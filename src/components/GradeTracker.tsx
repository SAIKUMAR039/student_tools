import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Plus, Trash2, Edit3, Check, X, BookOpen, ArrowLeft } from 'lucide-react';

interface Assignment {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  category: string;
}

interface Course {
  id: string;
  name: string;
  assignments: Assignment[];
}

interface GradeTrackerProps {
  onBack?: () => void;
}

const GradeTracker: React.FC<GradeTrackerProps> = ({ onBack }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', assignments: [] }
  ]);
  const [activeCourse, setActiveCourse] = useState('1');
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);

  const categories = ['Homework', 'Quiz', 'Exam', 'Project', 'Participation'];

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      assignments: []
    };
    setCourses([...courses, newCourse]);
    setActiveCourse(newCourse.id);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
      if (activeCourse === id) {
        setActiveCourse(courses.find(c => c.id !== id)?.id || '');
      }
    }
  };

  const updateCourseName = (id: string, name: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, name } : course
    ));
  };

  const addAssignment = () => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: '',
      score: 0,
      maxScore: 100,
      weight: 1,
      category: 'Homework'
    };
    
    setCourses(courses.map(course => 
      course.id === activeCourse 
        ? { ...course, assignments: [...course.assignments, newAssignment] }
        : course
    ));
    setEditingAssignment(newAssignment.id);
  };

  const removeAssignment = (assignmentId: string) => {
    setCourses(courses.map(course => 
      course.id === activeCourse 
        ? { ...course, assignments: course.assignments.filter(a => a.id !== assignmentId) }
        : course
    ));
  };

  const updateAssignment = (assignmentId: string, field: keyof Assignment, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === activeCourse 
        ? {
            ...course,
            assignments: course.assignments.map(assignment =>
              assignment.id === assignmentId 
                ? { ...assignment, [field]: value }
                : assignment
            )
          }
        : course
    ));
  };

  const calculateCourseGrade = (course: Course) => {
    if (course.assignments.length === 0) return 0;
    
    const totalWeightedScore = course.assignments.reduce((sum, assignment) => {
      const percentage = (assignment.score / assignment.maxScore) * 100;
      return sum + (percentage * assignment.weight);
    }, 0);
    
    const totalWeight = course.assignments.reduce((sum, assignment) => sum + assignment.weight, 0);
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-400';
    if (grade >= 80) return 'text-blue-400';
    if (grade >= 70) return 'text-yellow-400';
    if (grade >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getLetterGrade = (grade: number) => {
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 65) return 'D';
    return 'F';
  };

  const activeCourseData = courses.find(c => c.id === activeCourse);

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
                Grade Tracker
              </h1>
              <p className="text-white/70">
                Monitor your academic performance and track assignment grades
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <TrendingUp size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Courses</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addCourse}
                  className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                </motion.button>
              </div>

              <div className="space-y-2">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    layout
                    className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                      activeCourse === course.id
                        ? 'border-white/50 bg-white/20'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                    }`}
                    onClick={() => setActiveCourse(course.id)}
                  >
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="Course name"
                        value={course.name}
                        onChange={(e) => updateCourseName(course.id, e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 font-medium text-white placeholder-white/60"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {courses.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCourse(course.id);
                          }}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-white/70">
                        {course.assignments.length} assignments
                      </span>
                      <span className={`font-medium ${getGradeColor(calculateCourseGrade(course))}`}>
                        {calculateCourseGrade(course).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {activeCourseData && (
              <motion.div
                layout
                className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Course Summary
                </h3>
                
                <div className="text-center mb-4">
                  <div className={`text-3xl font-bold ${getGradeColor(calculateCourseGrade(activeCourseData))}`}>
                    {calculateCourseGrade(activeCourseData).toFixed(1)}%
                  </div>
                  <div className="text-lg font-medium text-white">
                    {getLetterGrade(calculateCourseGrade(activeCourseData))}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white/70">Total Assignments:</span>
                    <span className="font-medium text-white">{activeCourseData.assignments.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white/70">Average Score:</span>
                    <span className="font-medium text-white">
                      {activeCourseData.assignments.length > 0
                        ? (activeCourseData.assignments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / activeCourseData.assignments.length).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-3">
            {activeCourseData && (
              <motion.div
                layout
                className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {activeCourseData.name || 'Assignments'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addAssignment}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus size={16} />
                    <span>Add Assignment</span>
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {activeCourseData.assignments.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                      >
                        {editingAssignment === assignment.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                              <div className="col-span-12 md:col-span-6">
                                <input
                                  type="text"
                                  placeholder="Assignment name"
                                  value={assignment.name}
                                  onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                                />
                              </div>
                              <div className="col-span-6 md:col-span-3">
                                <input
                                  type="number"
                                  placeholder="Score"
                                  value={assignment.score}
                                  onChange={(e) => updateAssignment(assignment.id, 'score', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                                />
                              </div>
                              <div className="col-span-6 md:col-span-3">
                                <input
                                  type="number"
                                  placeholder="Max Score"
                                  value={assignment.maxScore}
                                  onChange={(e) => updateAssignment(assignment.id, 'maxScore', parseFloat(e.target.value) || 100)}
                                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-12 gap-4">
                              <div className="col-span-8">
                                <select
                                  value={assignment.category}
                                  onChange={(e) => updateAssignment(assignment.id, 'category', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                                >
                                  {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-4 flex space-x-2">
                                <button
                                  onClick={() => setEditingAssignment(null)}
                                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => removeAssignment(assignment.id)}
                                  className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <h4 className="font-medium text-white">
                                  {assignment.name || 'Untitled Assignment'}
                                </h4>
                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white border border-white/30">
                                  {assignment.category}
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-white/80">
                                {assignment.score}/{assignment.maxScore} points
                                <span className={`ml-2 font-medium ${getGradeColor((assignment.score / assignment.maxScore) * 100)}`}>
                                  ({((assignment.score / assignment.maxScore) * 100).toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingAssignment(assignment.id)}
                                className="p-2 text-white/70 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => removeAssignment(assignment.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {activeCourseData.assignments.length === 0 && (
                    <div className="text-center py-12 text-white/70">
                      <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No assignments yet. Add your first assignment to get started!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeTracker;