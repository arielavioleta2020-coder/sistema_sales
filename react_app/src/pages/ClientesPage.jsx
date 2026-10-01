import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../services/api';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    nombre_razon_social: '',
    ruc: '',
    direccion: '',
    telefono: '',
    tipo_cliente: 'Mayorista',
    condicion: 'Activo',
    id_distrito: 1
  });

  useEffect(() => {
    setClientes(getStorageData('clientes'));
  }, []);

  const handleGuardar = (e) => {
    e.preventDefault();
    if (formData.ruc.length !== 13) {
      alert('El RUC en Ecuador debe tener exactamente 13 dígitos.');
      return;
    }

    const nuevos = [...clientes];
    const nuevoId = nuevos.length > 0 ? Math.max(...nuevos.map(c => c.id_cliente)) + 1 : 1;
    nuevos.push({ ...formData, id_cliente: nuevoId });
    setStorageData('clientes', nuevos);
    setClientes(nuevos);
    setModalAbierto(false);
    setFormData({
      nombre_razon_social: '',
      ruc: '',
      direccion: '',
      telefono: '',
      tipo_cliente: 'Mayorista',
      condicion: 'Activo',
      id_distrito: 1
    });
    alert('Cliente registrado exitosamente.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Gestión de Clientes (React)</h2>
          <p style={{ color: '#64748b' }}>Administración de clientes comerciales y RUC (Ecuador)</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
          <i className="fa-solid fa-user-plus"></i> Registrar Cliente
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre / Razón Social</th>
              <th>RUC</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th>Condición</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id_cliente}>
                <td>#{c.id_cliente}</td>
                <td><strong>{c.nombre_razon_social}</strong></td>
                <td><code>{c.ruc}</code></td>
                <td>{c.direccion}</td>
                <td>{c.telefono}</td>
                <td><span className="badge badge-primary">{c.tipo_cliente}</span></td>
                <td><span className="badge badge-success">{c.condicion}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Registrar Cliente</h3>
              <button className="btn" style={{ background: 'none' }} onClick={() => setModalAbierto(false)}>&times;</button>
            </div>
            <form onSubmit={handleGuardar}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Razón Social *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.nombre_razon_social}
                    onChange={e => setFormData({ ...formData, nombre_razon_social: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>RUC (13 dígitos) *</label>
                    <input
                      type="text"
                      maxLength={13}
                      className="form-control"
                      required
                      value={formData.ruc}
                      onChange={e => setFormData({ ...formData, ruc: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Teléfono *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.telefono}
                      onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Dirección en Quito *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.direccion}
                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
