import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

const TransactionForm = ({ isOpen, onClose, transactionToEdit = null }) => {
  const { addTransaction, updateTransaction, categories } = useFinance();
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        ...transactionToEdit,
        date: new Date(transactionToEdit.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
  }, [transactionToEdit, isOpen]);

  // Set default category when type changes
  useEffect(() => {
    const filteredCategories = categories.filter(c => c.type === formData.type);
    if (filteredCategories.length > 0 && !filteredCategories.find(c => c.id === formData.category)) {
      setFormData(prev => ({ ...prev, category: filteredCategories[0].id }));
    }
  }, [formData.type, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, submitData);
    } else {
      addTransaction(submitData);
    }
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass animate-slide-up" style={{
        width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative'
      }}>
        <button 
          onClick={onClose} 
          className="btn-icon" 
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem' }}>
          {transactionToEdit ? 'Chỉnh sửa Giao dịch' : 'Thêm Giao dịch'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <label style={{ flex: 1 }}>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ display: 'none' }}
              />
              <div className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'glass'}`} style={{ width: '100%', background: formData.type === 'expense' ? 'var(--danger)' : '' }}>
                Chi Tiền
              </div>
            </label>
            <label style={{ flex: 1 }}>
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ display: 'none' }}
              />
              <div className={`btn ${formData.type === 'income' ? 'btn-primary' : 'glass'}`} style={{ width: '100%', background: formData.type === 'income' ? 'var(--success)' : '' }}>
                Thu Tiền
              </div>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Số tiền</label>
            <input 
              type="number" 
              required
              min="0"
              className="input" 
              placeholder="VD: 500000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Danh mục</label>
              <select 
                className="input" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ color: '#000' }}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ngày</label>
              <input 
                type="date" 
                className="input" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ghi chú (Tùy chọn)</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Nhập ghi chú..."
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
            {transactionToEdit ? 'Cập nhật' : 'Lưu giao dịch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
