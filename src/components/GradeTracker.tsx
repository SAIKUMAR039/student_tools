import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Plus, Trash2, Edit3, Check, X, BookOpen } from 'lucide-react';

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

const GradeTracker: React.FC = () => {
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
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
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
    <div className="pt-24 lg:pt-32 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <TrendingUp size={48} className="mx-auto mb-4 text-purple-600" />
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Grade Tracker
        </h1>
        <p className="text-gray-600">
          Monitor your academic performance and track assignment grades
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addCourse}
                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setActiveCourse(course.id)}
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Course name"
                      value={course.name}
                      onChange={(e) => updateCourseName(course.id, e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {courses.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCourse(course.id);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-600">
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Summary
              </h3>
              
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold ${getGradeColor(calculateCourseGrade(activeCourseData))}`}>
                  {calculateCourseGrade(activeCourseData).toFixed(1)}%
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {getLetterGrade(calculateCourseGrade(activeCourseData))}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Assignments:</span>
                  <span className="font-medium">{activeCourseData.assignments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score:</span>
                  <span className="font-medium">
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeCourseData.name || 'Assignments'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAssignment}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors"
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
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      {editingAssignment === assignment.id ? (
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 md:col-span-4">
                            <input
                              type="text"
                              placeholder="Assignment name"
                              value={assignment.name}
                              onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <input
                              type="number"
                              placeholder="Score"
                              value={assignment.score}
                              onChange={(e) => updateAssignment(assignment.id, 'score', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <input
                              type="number"
                              placeholder="Max Score"
                              value={assignment.maxScore}
                              onChange={(e) => updateAssignment(assignment.id, 'maxScore', parseFloat(e.target.value) || 100)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <select
                              value={assignment.category}
                              onChange={(e) => updateAssignment(assignment.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-6 md:col-span-2 flex space-x-2">
                            <button
                              onClick={() => setEditingAssignment(null)}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => removeAssignment(assignment.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <h4 className="font-medium text-gray-900">
                                {assignment.name || 'Untitled Assignment'}
                              </h4>
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                {assignment.category}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              {assignment.score}/{assignment.maxScore} points
                              <span className={`ml-2 font-medium ${getGradeColor((assignment.score / assignment.maxScore) * 100)}`}>
                                ({((assignment.score / assignment.maxScore) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingAssignment(assignment.id)}
                              className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => removeAssignment(assignment.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                  <div className="text-center py-12 text-gray-500">
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
  );
};

export default GradeTracker;