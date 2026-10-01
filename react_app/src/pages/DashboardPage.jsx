import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import { getStorageData } from '../services/api';

export default function DashboardPage({ setCurrentView }) {
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    setProductos(getStorageData('productos'));
    setFacturas(getStorageData('facturas'));
  }, []);

  const bajoStockCount = productos.filter(p => p.stock_actual <= p.stock_minimo).length;

  return (
    <div>
      {/* Banner de Bienvenida */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #38bdf8)',
        borderRadius: '16px',
        color: 'white',
        padding: '2rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '0.4rem' }}>
            Panel de Control Integral - SISTEMA_SALES S.A.
          </h2>
          <p style={{ opacity: 0.9 }}>
            Aplicación Web en <strong>React</strong> conectada con la base de datos <strong>MySQL Workbench</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" style={{ background: 'white', color: '#1d4ed8' }} onClick={() => setCurrentView('facturacion')}>
            <i className="fa-solid fa-plus"></i> Nueva Venta
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentView('productos')}>
            <i className="fa-solid fa-boxes-stacked"></i> Ver Productos
          </button>
        </div>
      </div>

      {/* Tarjetas de KPIs (Figura 6 de la tesis) */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Ventas"
          value="$15,480.00"
          note="+14.8% este mes"
          icon="fa-wallet"
          colorClass="kpi-blue"
        />
        <KpiCard
          title="Facturas Hoy"
          value="32"
          note="Transacciones validadas"
          icon="fa-receipt"
          colorClass="kpi-teal"
        />
        <KpiCard
          title="Productos Bajo Stock"
          value={String(bajoStockCount)}
          note="Alerta preventiva (RF09)"
          icon="fa-box-open"
          colorClass="kpi-orange"
        />
        <KpiCard
          title="Órdenes de Compra"
          value="2"
          note="Pendientes de atención"
          icon="fa-truck-loading"
          colorClass="kpi-purple"
        />
      </div>

      {/* Tabla de Ventas Recientes */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Ventas (Figura 6)</h3>
          <button className="btn btn-sm btn-outline" onClick={() => setCurrentView('facturas')}>Ver Todas</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>IVA Aplicado</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map(f => (
              <tr key={f.numero_factura}>
                <td><strong>{f.numero_factura}</strong></td>
                <td>{f.fecha_registro}</td>
                <td><span className="badge badge-success">{f.estado}</span></td>
                <td>{f.iva}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
