import React from 'react';

export default function Navbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <div>
        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h1>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>SISTEMA_SALES S.A. / {subtitle}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="badge badge-success" style={{ padding: '0.4rem 0.8rem' }}>
          <i className="fa-brands fa-react"></i> React App • MySQL Workbench
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <i className="fa-solid fa-location-dot" style={{ color: '#1d4ed8' }}></i> Quito, Ecuador
        </div>
      </div>
    </header>
  );
}
