import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout({ currentView, setCurrentView, title, subtitle, children }) {
  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="main-wrapper">
        <Navbar title={title} subtitle={subtitle} />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
