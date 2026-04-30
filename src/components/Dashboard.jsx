import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const Dashboard = () => {
  const { transactions, categories } = useFinance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
        acc.balance += curr.amount;
      } else {
        acc.totalExpense += curr.amount;
        acc.balance -= curr.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.keys(grouped).map(catId => {
      const category = categories.find(c => c.id === catId) || { name: 'Khác', color: '#94a3b8' };
      return {
        name: category.name,
        value: grouped[catId],
        color: category.color
      };
    }).sort((a, b) => b.value - a.value); // Sort by highest expense
  }, [transactions, categories]);

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Tổng quan Tài chính</h2>

      {/* Summary Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="glass card flex flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>Tổng số dư</span>
            <Wallet size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            {formatCurrency(balance)}
          </div>
        </div>

        <div className="glass card flex flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>Tổng thu (Tháng này)</span>
            <ArrowUpRight size={24} className="text-success" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div className="glass card flex flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>Tổng chi (Tháng này)</span>
            <ArrowDownRight size={24} className="text-danger" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>
            {formatCurrency(totalExpense)}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Expense Chart */}
        <div className="glass card">
          <h3 style={{ marginBottom: '1.5rem' }}>Cơ cấu Chi tiêu</h3>
          <div style={{ height: '300px' }}>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                Chưa có dữ liệu chi tiêu
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
            <h3>Giao dịch gần đây</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentTransactions.length > 0 ? recentTransactions.map(t => {
              const category = categories.find(c => c.id === t.category) || { name: 'Khác', color: '#94a3b8' };
              const isIncome = t.type === 'income';
              
              return (
                <div key={t.id} className="flex justify-between items-center" style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(128,128,128,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: `${category.color}20`, color: category.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '1.2rem'
                    }}>
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{category.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {format(new Date(t.date), 'dd/MM/yyyy', { locale: vi })}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: isIncome ? 'var(--success)' : 'var(--danger)' }}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              );
            }) : (
              <div className="text-muted text-center py-4">Chưa có giao dịch</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
