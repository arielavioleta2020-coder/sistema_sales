import React from 'react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', section: 'PRINCIPAL' },
    { id: 'facturacion', label: 'Nueva Venta (Facturar)', icon: 'fa-cash-register', section: 'COMERCIAL' },
    { id: 'facturas', label: 'Facturas Emitidas', icon: 'fa-file-invoice-dollar' },
    { id: 'clientes', label: 'Clientes', icon: 'fa-users' },
    { id: 'vendedores', label: 'Vendedores', icon: 'fa-user-tie' },
    { id: 'productos', label: 'Productos (Catálogo)', icon: 'fa-box-archive', section: 'LOGÍSTICA & INVENTARIO' },
    { id: 'inventario', label: 'Control de Inventario', icon: 'fa-warehouse' },
    { id: 'ordenes', label: 'Órdenes de Compra', icon: 'fa-truck-ramp-box' },
    { id: 'reportes', label: 'Reportes Gerenciales', icon: 'fa-chart-column', section: 'GESTIÓN' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-icon">
          <i className="fa-solid fa-shapes"></i>
        </div>
        <div>
          <span className="brand-title">SISTEMA_SALES</span>
          <span className="brand-subtitle">S. A. • Quito, EC</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.section && <div className="nav-section-title">{item.section}</div>}
            <div
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">KF</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Karina Figueroa</div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Administrador (React)</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
