import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Trash2, RotateCcw, CheckCircle, X, Edit3, Save, ArrowLeft } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: Date | null;
  correctCount: number;
  incorrectCount: number;
}

interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
  color: string;
}

interface FlashcardStudyProps {
  onBack?: () => void;
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ onBack }) => {
  const [decks, setDecks] = useState<Deck[]>([
    {
      id: '1',
      name: 'Sample Deck',
      color: 'bg-blue-500',
      cards: [
        {
          id: '1',
          front: 'What is the capital of France?',
          back: 'Paris',
          difficulty: 'easy',
          lastReviewed: null,
          correctCount: 0,
          incorrectCount: 0
        }
      ]
    }
  ]);
  const [activeDeck, setActiveDeck] = useState<string>('1');
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  const addDeck = () => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: 'New Deck',
      color: colors[Math.floor(Math.random() * colors.length)],
      cards: []
    };
    setDecks([...decks, newDeck]);
    setActiveDeck(newDeck.id);
  };

  const addCard = () => {
    if (!newCardFront.trim() || !newCardBack.trim()) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: newCardFront,
      back: newCardBack,
      difficulty: 'medium',
      lastReviewed: null,
      correctCount: 0,
      incorrectCount: 0
    };

    setDecks(decks.map(deck => 
      deck.id === activeDeck 
        ? { ...deck, cards: [...deck.cards, newCard] }
        : deck
    ));

    setNewCardFront('');
    setNewCardBack('');
  };

  const removeCard = (cardId: string) => {
    setDecks(decks.map(deck => 
      deck.id === activeDeck 
        ? { ...deck, cards: deck.cards.filter(card => card.id !== cardId) }
        : deck
    ));
  };

  const startStudy = () => {
    const currentDeck = decks.find(d => d.id === activeDeck);
    if (currentDeck && currentDeck.cards.length > 0) {
      setStudyMode(true);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  };

  const markCard = (correct: boolean) => {
    const currentDeck = decks.find(d => d.id === activeDeck);
    if (!currentDeck) return;

    const updatedCards = [...currentDeck.cards];
    const currentCard = updatedCards[currentCardIndex];
    
    if (correct) {
      currentCard.correctCount++;
    } else {
      currentCard.incorrectCount++;
    }
    currentCard.lastReviewed = new Date();

    setDecks(decks.map(deck => 
      deck.id === activeDeck 
        ? { ...deck, cards: updatedCards }
        : deck
    ));

    // Move to next card
    if (currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
      setCurrentCardIndex(0);
    }
  };

  const currentDeck = decks.find(d => d.id === activeDeck);
  const currentCard = currentDeck?.cards[currentCardIndex];

  if (studyMode && currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => setStudyMode(false)}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              <h1 className="text-3xl font-bold text-white">
                Studying: {currentDeck?.name}
              </h1>
            </div>
            <p className="text-white/70">
              Card {currentCardIndex + 1} of {currentDeck?.cards.length}
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              key={currentCard.id}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: showAnswer ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 mb-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="absolute inset-0 glass-card rounded-2xl p-8 shadow-xl border border-white/20 flex items-center justify-center cursor-pointer backdrop-blur-xl"
                style={{ backfaceVisibility: 'hidden' }}
                onClick={() => setShowAnswer(true)}
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Question</h3>
                  <p className="text-lg text-white/90">{currentCard.front}</p>
                  <p className="text-sm text-white/60 mt-4">Click to reveal answer</p>
                </div>
              </div>
              
              <div 
                className="absolute inset-0 glass-card rounded-2xl p-8 shadow-xl border border-white/20 flex items-center justify-center backdrop-blur-xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Answer</h3>
                  <p className="text-lg text-white/90">{currentCard.back}</p>
                </div>
              </div>
            </motion.div>

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => markCard(false)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  <X size={20} />
                  <span>Incorrect</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => markCard(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  <CheckCircle size={20} />
                  <span>Correct</span>
                </motion.button>
              </motion.div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => setStudyMode(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                Exit Study Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Flashcard Study
              </h1>
              <p className="text-white/70">
                Create and study flashcards to improve memory retention
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Brain size={24} className="text-white" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              layout
              className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 mb-6 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Decks</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addDeck}
                  className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                </motion.button>
              </div>

              <div className="space-y-2">
                {decks.map((deck) => (
                  <motion.div
                    key={deck.id}
                    layout
                    className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                      activeDeck === deck.id
                        ? 'border-white/50 bg-white/20'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                    }`}
                    onClick={() => setActiveDeck(deck.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${deck.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-white">{deck.name}</div>
                        <div className="text-sm text-white/70">{deck.cards.length} cards</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {currentDeck && (
              <motion.div
                layout
                className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Study</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startStudy}
                  disabled={currentDeck.cards.length === 0}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Studying
                </motion.button>
                <div className="mt-4 text-sm text-white/80 space-y-1">
                  <div>Total Cards: {currentDeck.cards.length}</div>
                  <div>Studied: {currentDeck.cards.filter(c => c.lastReviewed).length}</div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-3">
            {currentDeck && (
              <motion.div
                layout
                className="glass-card rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {currentDeck.name}
                  </h2>
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Front of card (question)"
                    value={newCardFront}
                    onChange={(e) => setNewCardFront(e.target.value)}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                  <input
                    type="text"
                    placeholder="Back of card (answer)"
                    value={newCardBack}
                    onChange={(e) => setNewCardBack(e.target.value)}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addCard}
                    className="md:col-span-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Add Card
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {currentDeck.cards.map((card) => (
                      <motion.div
                        key={card.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-white/80">Front</label>
                            <p className="text-white mt-1">{card.front}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-white/80">Back</label>
                            <p className="text-white mt-1">{card.back}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex space-x-4 text-sm text-white/70">
                            <span>✓ {card.correctCount}</span>
                            <span>✗ {card.incorrectCount}</span>
                            {card.lastReviewed && (
                              <span>Last: {card.lastReviewed.toLocaleDateString()}</span>
                            )}
                          </div>
                          <button
                            onClick={() => removeCard(card.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {currentDeck.cards.length === 0 && (
                    <div className="text-center py-12 text-white/70">
                      <Brain size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No flashcards yet. Add your first card to get started!</p>
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

export default FlashcardStudy;