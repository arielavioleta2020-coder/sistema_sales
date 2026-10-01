import React, { useState, useEffect } from 'react';
import { getStorageData } from '../services/api';

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    setProductos(getStorageData('productos'));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Control de Inventario y Alertas de Stock Mínimo</h2>
        <p style={{ color: '#64748b' }}>Requerimiento RF09: Marcado preventivo de productos en nivel crítico</p>
      </div>

      <div style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <strong>Regla de Negocio RN11:</strong>
        <p>Los artículos con existencias iguales o inferiores al stock mínimo de seguridad se destacan para su reposición inmediata.</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Déficit</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => {
              const esCritico = p.stock_actual <= p.stock_minimo;
              const deficit = Math.max(0, p.stock_minimo - p.stock_actual);
              return (
                <tr key={p.id_producto} style={{ backgroundColor: esCritico ? '#fffbeb' : 'transparent' }}>
                  <td>#{p.id_producto}</td>
                  <td><strong>{p.descripcion}</strong></td>
                  <td>{p.marca}</td>
                  <td><strong>{p.stock_actual}</strong> unid.</td>
                  <td>{p.stock_minimo} unid.</td>
                  <td>{deficit > 0 ? <span className="badge badge-danger">-{deficit} unid.</span> : '0'}</td>
                  <td>
                    <span className={`badge ${esCritico ? 'badge-danger' : 'badge-success'}`}>
                      {p.stock_actual === 0 ? 'AGOTADO' : (esCritico ? 'STOCK CRÍTICO' : 'NORMAL')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
