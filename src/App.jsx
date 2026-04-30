import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Reports from './components/Reports';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fade-in">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && (
          <TransactionList onEdit={handleEdit} onAdd={handleAdd} />
        )}
        {activeTab === 'reports' && <Reports />}
      </div>
      
      <TransactionForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionToEdit={transactionToEdit}
      />
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
