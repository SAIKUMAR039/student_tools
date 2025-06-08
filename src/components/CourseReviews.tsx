import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, Search, Filter, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';

interface Review {
  id: string;
  courseName: string;
  courseCode: string;
  professor: string;
  rating: number;
  difficulty: number;
  workload: number;
  review: string;
  semester: string;
  year: number;
  helpful: number;
  notHelpful: number;
  tags: string[];
  anonymous: boolean;
  date: Date;
}

interface CourseReviewsProps {
  onBack?: () => void;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ onBack }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      courseName: 'Introduction to Computer Science',
      courseCode: 'CS101',
      professor: 'Dr. Smith',
      rating: 4,
      difficulty: 3,
      workload: 4,
      review: 'Great introductory course! Dr. Smith explains concepts clearly and the assignments are challenging but fair.',
      semester: 'Fall',
      year: 2024,
      helpful: 12,
      notHelpful: 2,
      tags: ['programming', 'beginner-friendly', 'good-professor'],
      anonymous: false,
      date: new Date('2024-01-15')
    }
  ]);

  const [showAddReview, setShowAddReview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [newReview, setNewReview] = useState({
    courseName: '',
    courseCode: '',
    professor: '',
    rating: 5,
    difficulty: 3,
    workload: 3,
    review: '',
    semester: 'Fall',
    year: new Date().getFullYear(),
    tags: '',
    anonymous: false
  });

  const semesters = ['Fall', 'Spring', 'Summer', 'Winter'];
  const commonTags = [
    'easy-A', 'challenging', 'heavy-workload', 'light-workload', 
    'good-professor', 'boring', 'interesting', 'practical', 
    'theoretical', 'group-projects', 'no-exams', 'multiple-choice'
  ];

  const addReview = () => {
    if (!newReview.courseName || !newReview.review) return;

    const review: Review = {
      id: Date.now().toString(),
      ...newReview,
      helpful: 0,
      notHelpful: 0,
      tags: newReview.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: new Date()
    };

    setReviews([review, ...reviews]);
    setNewReview({
      courseName: '',
      courseCode: '',
      professor: '',
      rating: 5,
      difficulty: 3,
      workload: 3,
      review: '',
      semester: 'Fall',
      year: new Date().getFullYear(),
      tags: '',
      anonymous: false
    });
    setShowAddReview(false);
  };

  const voteHelpful = (reviewId: string, helpful: boolean) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: helpful ? review.helpful + 1 : review.helpful,
            notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 0 || review.rating >= filterRating;
    return matchesSearch && matchesRating;
  });

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`}
      />
    ));
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-400';
    if (difficulty <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getWorkloadColor = (workload: number) => {
    if (workload <= 2) return 'text-green-400';
    if (workload <= 3) return 'text-yellow-400';
    return 'text-red-400';
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
                Course Reviews
              </h1>
              <p className="text-white/70">
                Share and discover honest reviews about courses and professors
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <MessageSquare size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                    <input
                      type="text"
                      placeholder="Course name, code, or professor"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Minimum Rating</label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value={0} className="bg-gray-800">All Ratings</option>
                    <option value={4} className="bg-gray-800">4+ Stars</option>
                    <option value={3} className="bg-gray-800">3+ Stars</option>
                    <option value={2} className="bg-gray-800">2+ Stars</option>
                    <option value={1} className="bg-gray-800">1+ Stars</option>
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Add Review</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddReview(true)}
                className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Write Review</span>
              </motion.button>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence>
              {showAddReview && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Course Name"
                      value={newReview.courseName}
                      onChange={(e) => setNewReview({...newReview, courseName: e.target.value})}
                      className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    />
                    <input
                      type="text"
                      placeholder="Course Code (e.g., CS101)"
                      value={newReview.courseCode}
                      onChange={(e) => setNewReview({...newReview, courseCode: e.target.value})}
                      className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    />
                    <input
                      type="text"
                      placeholder="Professor Name"
                      value={newReview.professor}
                      onChange={(e) => setNewReview({...newReview, professor: e.target.value})}
                      className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    />
                    <select
                      value={`${newReview.semester} ${newReview.year}`}
                      onChange={(e) => {
                        const [semester, year] = e.target.value.split(' ');
                        setNewReview({...newReview, semester, year: parseInt(year)});
                      }}
                      className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    >
                      {semesters.map(semester => 
                        [2024, 2023, 2022].map(year => (
                          <option key={`${semester}-${year}`} value={`${semester} ${year}`} className="bg-gray-800">
                            {semester} {year}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Overall Rating: {newReview.rating}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Difficulty: {newReview.difficulty}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newReview.difficulty}
                        onChange={(e) => setNewReview({...newReview, difficulty: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Workload: {newReview.workload}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newReview.workload}
                        onChange={(e) => setNewReview({...newReview, workload: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <textarea
                    placeholder="Write your review here..."
                    value={newReview.review}
                    onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent mb-4 backdrop-blur-sm"
                    rows={4}
                  />

                  <input
                    type="text"
                    placeholder="Tags (comma-separated, e.g., easy-A, challenging, good-professor)"
                    value={newReview.tags}
                    onChange={(e) => setNewReview({...newReview, tags: e.target.value})}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent mb-4 backdrop-blur-sm"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReview.anonymous}
                        onChange={(e) => setNewReview({...newReview, anonymous: e.target.checked})}
                        className="rounded border-white/30 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-white/80">Post anonymously</span>
                    </label>
                    
                    <div className="space-x-3">
                      <button
                        onClick={() => setShowAddReview(false)}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addReview}
                        className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <AnimatePresence>
                {filteredReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {review.courseName} ({review.courseCode})
                        </h3>
                        <p className="text-white/70">
                          {review.professor} • {review.semester} {review.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-white/70 ml-2">{review.rating}/5</span>
                        </div>
                        <div className="text-xs text-white/60">
                          {review.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className={`text-lg font-semibold ${getDifficultyColor(review.difficulty)}`}>
                          {review.difficulty}/5
                        </div>
                        <div className="text-xs text-white/70">Difficulty</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className={`text-lg font-semibold ${getWorkloadColor(review.workload)}`}>
                          {review.workload}/5
                        </div>
                        <div className="text-xs text-white/70">Workload</div>
                      </div>
                    </div>

                    <p className="text-white/90 mb-4 leading-relaxed">{review.review}</p>

                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-400/20 text-blue-300 text-xs rounded-full border border-blue-400/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/60">
                        {review.anonymous ? 'Anonymous' : 'Student Review'}
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => voteHelpful(review.id, true)}
                          className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <ThumbsUp size={16} />
                          <span className="text-sm">{review.helpful}</span>
                        </button>
                        <button
                          onClick={() => voteHelpful(review.id, false)}
                          className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <ThumbsDown size={16} />
                          <span className="text-sm">{review.notHelpful}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredReviews.length === 0 && (
                <div className="text-center py-12 text-white/70">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No reviews found. Be the first to write a review!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseReviews;