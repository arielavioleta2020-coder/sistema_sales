import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../services/api';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [lineaFiltro, setLineaFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    marca: '',
    linea_producto: 'Laptops y Portátiles',
    precio: '',
    stock_actual: '',
    stock_minimo: 5,
    importado: true
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setProductos(getStorageData('productos'));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    const nuevos = [...productos];
    const nuevoId = nuevos.length > 0 ? Math.max(...nuevos.map(p => p.id_producto)) + 1 : 1;
    const nuevoProd = {
      ...formData,
      id_producto: nuevoId,
      precio: parseFloat(formData.precio),
      stock_actual: parseInt(formData.stock_actual),
      stock_minimo: parseInt(formData.stock_minimo)
    };
    nuevos.push(nuevoProd);
    setStorageData('productos', nuevos);
    setProductos(nuevos);
    setModalAbierto(false);
    setFormData({
      descripcion: '',
      marca: '',
      linea_producto: 'Laptops y Portátiles',
      precio: '',
      stock_actual: '',
      stock_minimo: 5,
      importado: true
    });
    alert('Producto agregado exitosamente al catálogo.');
  };

  const handleEliminar = (id) => {
    if (confirm('¿Desea eliminar este producto?')) {
      const actualizados = productos.filter(p => p.id_producto !== id);
      setStorageData('productos', actualizados);
      setProductos(actualizados);
    }
  };

  const productosFiltrados = productos.filter(p => {
    const matchLinea = !lineaFiltro || p.linea_producto === lineaFiltro;
    const matchBusqueda = !busqueda ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase());
    return matchLinea && matchBusqueda;
  });

  return (
    <div>
      {/* Encabezado según Figura 7 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Gestión de Productos</h2>
          <p style={{ color: '#64748b' }}>Catálogo maestro en React conectado a base de datos MySQL Workbench</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
          <i className="fa-solid fa-plus"></i> Agregar Producto
        </button>
      </div>

      {/* Barra de Filtros idéntica a la Figura 7 */}
      <div className="filters-bar">
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Línea de Producto:
          </label>
          <select className="form-select" value={lineaFiltro} onChange={e => setLineaFiltro(e.target.value)}>
            <option value="">Todas las Líneas</option>
            <option value="Laptops y Portátiles">Laptops y Portátiles</option>
            <option value="Monitores y Pantallas">Monitores y Pantallas</option>
            <option value="Impresión y Digitalización">Impresión y Digitalización</option>
            <option value="Periféricos y Accesorios">Periféricos y Accesorios</option>
            <option value="Almacenamiento">Almacenamiento</option>
            <option value="Redes y Conectividad">Redes y Conectividad</option>
          </select>
        </div>

        <div style={{ flex: 2 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Buscar Producto:
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por descripción, marca o código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla según Figura 7 de la tesis */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Cód</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Stock Actual</th>
              <th>Precio (USD)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(p => {
              const stockBajo = p.stock_actual <= p.stock_minimo;
              return (
                <tr key={p.id_producto}>
                  <td><strong>C{String(p.id_producto).padStart(3, '0')}</strong></td>
                  <td><strong>{p.descripcion}</strong></td>
                  <td>{p.marca}</td>
                  <td>
                    <span className={`badge ${stockBajo ? 'badge-danger' : 'badge-success'}`}>
                      {p.stock_actual} unid.
                    </span>
                  </td>
                  <td><strong>${Number(p.precio).toFixed(2)}</strong></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-sm btn-outline" onClick={() => alert(`Detalles de: ${p.descripcion}`)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(p.id_producto)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Producto */}
      {modalAbierto && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3><i className="fa-solid fa-box"></i> Nuevo Producto (React)</h3>
              <button className="btn" style={{ background: 'none', fontSize: '1.2rem' }} onClick={() => setModalAbierto(false)}>&times;</button>
            </div>
            <form onSubmit={handleGuardar}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Descripción *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.descripcion}
                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Marca *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.marca}
                      onChange={e => setFormData({ ...formData, marca: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Línea *</label>
                    <select
                      className="form-select"
                      value={formData.linea_producto}
                      onChange={e => setFormData({ ...formData, linea_producto: e.target.value })}
                    >
                      <option value="Laptops y Portátiles">Laptops y Portátiles</option>
                      <option value="Monitores y Pantallas">Monitores y Pantallas</option>
                      <option value="Impresión y Digitalización">Impresión y Digitalización</option>
                      <option value="Periféricos y Accesorios">Periféricos y Accesorios</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Precio ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={formData.precio}
                      onChange={e => setFormData({ ...formData, precio: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Stock Físico *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      value={formData.stock_actual}
                      onChange={e => setFormData({ ...formData, stock_actual: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar en Catálogo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
