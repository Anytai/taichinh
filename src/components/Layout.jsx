import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LayoutDashboard, Receipt, PieChart, Settings, Moon, Sun, Wallet } from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useFinance();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Giao dịch', icon: Receipt },
    { id: 'reports', label: 'Báo cáo', icon: PieChart },
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '250px', margin: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '2rem', color: 'var(--primary)' }}>
          <Wallet size={32} />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>FamilyFin</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn ${isActive ? 'btn-primary' : ''}`}
                style={{ 
                  justifyContent: 'flex-start', 
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-color)',
                  width: '100%'
                }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            className="btn" 
            onClick={toggleTheme}
            style={{ width: '100%', justifyContent: 'center', background: 'rgba(128,128,128,0.1)' }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1rem', paddingLeft: 0, overflowY: 'auto' }}>
        <div className="glass animate-fade-in" style={{ minHeight: 'calc(100vh - 2rem)', padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
