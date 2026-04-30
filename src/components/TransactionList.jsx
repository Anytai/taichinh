import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const TransactionList = ({ onEdit, onAdd }) => {
  const { transactions, categories, deleteTransaction } = useFinance();
  const [filterType, setFilterType] = useState('all');

  const getCategory = (id) => categories.find(c => c.id === id) || { name: 'Khác', color: '#94a3b8' };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2>Lịch sử Giao dịch</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={20} /> Thêm Giao dịch
        </button>
      </div>

      <div className="glass p-4" style={{ padding: '1.5rem' }}>
        <div className="flex gap-4 mb-6">
          <button 
            className={`btn ${filterType === 'all' ? 'btn-primary' : 'glass'}`}
            onClick={() => setFilterType('all')}
          >
            Tất cả
          </button>
          <button 
            className={`btn ${filterType === 'income' ? 'btn-primary' : 'glass'}`}
            onClick={() => setFilterType('income')}
          >
            Thu Tiền
          </button>
          <button 
            className={`btn ${filterType === 'expense' ? 'btn-primary' : 'glass'}`}
            onClick={() => setFilterType('expense')}
          >
            Chi Tiền
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Chưa có giao dịch nào.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Ngày</th>
                  <th style={{ padding: '1rem' }}>Danh mục</th>
                  <th style={{ padding: '1rem' }}>Ghi chú</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Số tiền</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => {
                  const category = getCategory(t.category);
                  const isIncome = t.type === 'income';
                  
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>
                        {format(new Date(t.date), 'dd/MM/yyyy', { locale: vi })}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '99px',
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}>
                          {category.name}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t.note || '-'}</td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        fontWeight: 600,
                        color: isIncome ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div className="flex justify-center gap-2">
                          <button className="btn-icon" onClick={() => onEdit(t)} title="Sửa">
                            <Edit2 size={18} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteTransaction(t.id)} title="Xóa" style={{ color: 'var(--danger)' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
