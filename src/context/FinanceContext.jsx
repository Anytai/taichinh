import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
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

  const [categories, setCategories] = useState(() => loadData('finance_categories', defaultCategories));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Transactions now from Firebase
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync Categories & Theme with LocalStorage
  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch Transactions from Firebase Realtime
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transData = [];
      snapshot.forEach((docSnapshot) => {
        transData.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });
      setTransactions(transData);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi khi tải dữ liệu từ Firebase: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Firebase Add
  const addTransaction = async (transaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        date: new Date(transaction.date).toISOString()
      });
    } catch (e) {
      console.error("Lỗi khi thêm giao dịch: ", e);
      alert("Không thể thêm giao dịch. Vui lòng kiểm tra quyền truy cập (Rules) trên Firebase Firestore.");
    }
  };

  // Firebase Delete
  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.error("Lỗi khi xóa giao dịch: ", e);
    }
  };

  // Firebase Update
  const updateTransaction = async (id, updatedData) => {
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, {
        ...updatedData,
        date: new Date(updatedData.date).toISOString()
      });
    } catch (e) {
      console.error("Lỗi khi cập nhật giao dịch: ", e);
    }
  };

  const value = {
    transactions,
    categories,
    theme,
    loading,
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
