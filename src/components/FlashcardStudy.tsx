import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Trash2, RotateCcw, CheckCircle, X, Edit3, Save } from 'lucide-react';

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

const FlashcardStudy: React.FC = () => {
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
      <div className="pt-24 lg:pt-32 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Studying: {currentDeck?.name}
          </h1>
          <p className="text-gray-600">
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
              className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 flex items-center justify-center cursor-pointer"
              style={{ backfaceVisibility: 'hidden' }}
              onClick={() => setShowAnswer(true)}
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Question</h3>
                <p className="text-lg text-gray-700">{currentCard.front}</p>
                <p className="text-sm text-gray-500 mt-4">Click to reveal answer</p>
              </div>
            </div>
            
            <div 
              className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 flex items-center justify-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Answer</h3>
                <p className="text-lg text-gray-700">{currentCard.back}</p>
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
                className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors"
              >
                <X size={20} />
                <span>Incorrect</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => markCard(true)}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors"
              >
                <CheckCircle size={20} />
                <span>Correct</span>
              </motion.button>
            </motion.div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => setStudyMode(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Exit Study Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <Brain size={48} className="mx-auto mb-4 text-purple-600" />
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Flashcard Study
        </h1>
        <p className="text-gray-600">
          Create and study flashcards to improve memory retention
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Decks</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addDeck}
                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setActiveDeck(deck.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${deck.color}`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{deck.name}</div>
                      <div className="text-sm text-gray-600">{deck.cards.length} cards</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {currentDeck && (
            <motion.div
              layout
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startStudy}
                disabled={currentDeck.cards.length === 0}
                className="w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Studying
              </motion.button>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentDeck.name}
                </h2>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Front of card (question)"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Back of card (answer)"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addCard}
                  className="md:col-span-2 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors"
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
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Front</label>
                          <p className="text-gray-900 mt-1">{card.front}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Back</label>
                          <p className="text-gray-900 mt-1">{card.back}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>✓ {card.correctCount}</span>
                          <span>✗ {card.incorrectCount}</span>
                          {card.lastReviewed && (
                            <span>Last: {card.lastReviewed.toLocaleDateString()}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeCard(card.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {currentDeck.cards.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
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
  );
};

export default FlashcardStudy;