import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Plus, Trash2, TrendingDown, TrendingUp, PieChart } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const categories = {
    expense: ['food', 'transport', 'books', 'entertainment', 'housing', 'other'],
    income: ['allowance', 'job', 'scholarship', 'gift', 'other']
  };

  const categoryColors = {
    food: 'bg-red-500',
    transport: 'bg-blue-500',
    books: 'bg-green-500',
    entertainment: 'bg-purple-500',
    housing: 'bg-orange-500',
    allowance: 'bg-emerald-500',
    job: 'bg-indigo-500',
    scholarship: 'bg-yellow-500',
    gift: 'bg-pink-500',
    other: 'bg-gray-500'
  };

  const addExpense = () => {
    if (!amount || !description) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString().split('T')[0],
      type
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getMonthlyExpenses = () => {
    return expenses.filter(expense => {
      const expenseMonth = new Date(expense.date).getMonth();
      return expenseMonth === selectedMonth;
    });
  };

  const getTotalIncome = () => {
    return getMonthlyExpenses()
      .filter(expense => expense.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalExpenses = () => {
    return getMonthlyExpenses()
      .filter(expense => expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCategoryBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    getMonthlyExpenses()
      .filter(expense => expense.type === 'expense')
      .forEach(expense => {
        breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
      });
    return breakdown;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="pt-24 lg:pt-32 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <DollarSign size={48} className="mx-auto mb-4 text-green-600" />
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Student Budget Tracker
        </h1>
        <p className="text-gray-600">
          Track your income and expenses to manage your student budget
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    type === 'expense' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    type === 'income' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Income
                </button>
              </div>

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                step="0.01"
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories[type].map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addExpense}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Transaction</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Month</h3>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </motion.div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              layout
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${getTotalIncome().toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </motion.div>

            <motion.div
              layout
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${getTotalExpenses().toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="text-red-500" size={32} />
              </div>
            </motion.div>

            <motion.div
              layout
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${getBalance().toFixed(2)}
                  </p>
                </div>
                <PieChart className={getBalance() >= 0 ? 'text-green-500' : 'text-red-500'} size={32} />
              </div>
            </motion.div>
          </div>

          <motion.div
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {monthNames[selectedMonth]} Transactions
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {getMonthlyExpenses().map((expense) => (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${categoryColors[expense.category as keyof typeof categoryColors]}`} />
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-600">
                          {expense.category} • {expense.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-semibold ${
                        expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {getMonthlyExpenses().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No transactions for {monthNames[selectedMonth]}. Add your first transaction!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;