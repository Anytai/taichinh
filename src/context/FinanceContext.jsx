import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // Try to load from localStorage first
  const loadData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const defaultCategories = [
    { id: 'c1', name: 'Lương', type: 'income', color: '#10b981' },
    { id: 'c2', name: 'Thưởng', type: 'income', color: '#3b82f6' },
    { id: 'c3', name: 'Ăn uống', type: 'expense', color: '#ef4444' },
    { id: 'c4', name: 'Đi lại', type: 'expense', color: '#f59e0b' },
    { id: 'c5', name: 'Mua sắm', type: 'expense', color: '#8b5cf6' },
    { id: 'c6', name: 'Hóa đơn', type: 'expense', color: '#6366f1' },
    { id: 'c7', name: 'Giải trí', type: 'expense', color: '#ec4899' },
  ];

  const [transactions, setTransactions] = useState(() => loadData('finance_transactions', []));
  const [categories, setCategories] = useState(() => loadData('finance_categories', defaultCategories));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: uuidv4(), date: new Date(transaction.date).toISOString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updatedData } : t)));
  };

  const value = {
    transactions,
    categories,
    theme,
    toggleTheme,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
