import React from 'react';

export default function KpiCard({ title, value, note, icon, colorClass }) {
  return (
    <div className={`kpi-card ${colorClass}`}>
      <div>
        <span style={{ fontSize: '0.85rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 600 }}>
          {title}
        </span>
        <div className="kpi-value">{value}</div>
        <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>{note}</span>
      </div>
      <div style={{ fontSize: '2.5rem', opacity: 0.25 }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
    </div>
  );
}
