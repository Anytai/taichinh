import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Reports = () => {
  const { transactions, categories } = useFinance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Process data for Income vs Expense Bar Chart
  const monthlyData = useMemo(() => {
    const dataByMonth = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!dataByMonth[monthYear]) {
        dataByMonth[monthYear] = { name: monthYear, Thu: 0, Chi: 0 };
      }
      
      if (t.type === 'income') {
        dataByMonth[monthYear].Thu += t.amount;
      } else {
        dataByMonth[monthYear].Chi += t.amount;
      }
    });

    return Object.values(dataByMonth).sort((a, b) => {
      const [m1, y1] = a.name.split('/');
      const [m2, y2] = b.name.split('/');
      return new Date(y1, m1 - 1) - new Date(y2, m2 - 1);
    });
  }, [transactions]);

  // Process data for Category Distribution (All time)
  const categoryData = useMemo(() => {
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
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  return (
    <div className="flex flex-col gap-6">
      <h2>Báo cáo Phân tích</h2>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Thu vs Chi Chart */}
        <div className="glass card">
          <h3 style={{ marginBottom: '1.5rem' }}>Thu & Chi theo tháng</h3>
          <div style={{ height: '350px' }}>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="name" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" tickFormatter={(value) => `${value / 1000000}M`} />
                  <RechartsTooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)' }}
                  />
                  <Legend />
                  <Bar dataKey="Thu" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Chi" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                Chưa có dữ liệu giao dịch
              </div>
            )}
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="glass card">
          <h3 style={{ marginBottom: '1.5rem' }}>Cơ cấu Chi tiêu (Toàn thời gian)</h3>
          <div style={{ height: '350px' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                Chưa có dữ liệu chi tiêu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
