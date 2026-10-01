import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../services/api';

export default function FacturacionPage({ setCurrentView }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSel, setClienteSel] = useState('');
  const [productoSel, setProductoSel] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [ivaPorc, setIvaPorc] = useState(15.00);

  useEffect(() => {
    setClientes(getStorageData('clientes'));
    setProductos(getStorageData('productos'));
  }, []);

  const agregarItem = () => {
    const prod = productos.find(p => p.id_producto === parseInt(productoSel));
    if (!prod) {
      alert('Seleccione un producto válido.');
      return;
    }

    if (prod.stock_actual < cantidad) {
      alert(`Error RN11: Stock insuficiente. Solo hay ${prod.stock_actual} unidades.`);
      return;
    }

    const item = {
      id_producto: prod.id_producto,
      descripcion: prod.descripcion,
      marca: prod.marca,
      precio: prod.precio,
      cantidad: parseInt(cantidad),
      subtotal: prod.precio * parseInt(cantidad)
    };

    setCarrito([...carrito, item]);
    setProductoSel('');
    setCantidad(1);
  };

  const eliminarItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const subtotalNeto = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const valorIva = subtotalNeto * (ivaPorc / 100);
  const totalFactura = subtotalNeto + valorIva;

  const emitirFactura = () => {
    if (!clienteSel) {
      alert('Error RN04: Debe seleccionar un cliente registrado.');
      return;
    }
    if (carrito.length === 0) {
      alert('Error RN06: Debe ingresar al menos un detalle de producto.');
      return;
    }

    // Descontar inventario (RN11)
    const prodsActualizados = [...productos];
    carrito.forEach(item => {
      const p = prodsActualizados.find(prod => prod.id_producto === item.id_producto);
      if (p) p.stock_actual -= item.cantidad;
    });
    setStorageData('productos', prodsActualizados);

    // Guardar factura
    const facturas = getStorageData('facturas');
    const num = `FAC-001-001-${String(facturas.length + 1).padStart(7, '0')}`;
    const nuevaFac = {
      numero_factura: num,
      fecha_registro: new Date().toISOString().split('T')[0],
      id_cliente: parseInt(clienteSel),
      id_vendedor: 1,
      estado: 'PAGADA',
      iva: ivaPorc,
      detalles: carrito.map(c => ({
        id_producto: c.id_producto,
        cantidad: c.cantidad,
        precio_venta: c.precio
      }))
    };
    facturas.push(nuevaFac);
    setStorageData('facturas', facturas);

    alert(`¡Factura ${num} emitida con éxito en React y stock actualizado! Total: $${totalFactura.toFixed(2)}`);
    setCarrito([]);
    setClienteSel('');
    setCurrentView('dashboard');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Módulo de Facturación y Ventas (React)</h2>
        <p style={{ color: '#64748b' }}>Liquidación de IVA al 15% y control de inventario en tiempo real</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3>Datos de la Venta</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Cliente (RN04) *</label>
            <select className="form-select" value={clienteSel} onChange={e => setClienteSel(e.target.value)}>
              <option value="">-- Seleccione Cliente --</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre_razon_social} (RUC: {c.ruc})
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>IVA Ecuador (%)</label>
            <input
              type="number"
              className="form-control"
              value={ivaPorc}
              onChange={e => setIvaPorc(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3>Agregar Productos al Detalle (RN06, RN07, RN11)</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 3 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Producto:</label>
            <select className="form-select" value={productoSel} onChange={e => setProductoSel(e.target.value)}>
              <option value="">-- Seleccionar Producto --</option>
              {productos.map(p => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.descripcion} (Stock: {p.stock_actual}) - ${p.precio.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Cantidad:</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
            />
          </div>
          <div style={{ flex: 1.5 }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={agregarItem}>
              <i className="fa-solid fa-plus"></i> Agregar Línea
            </button>
          </div>
        </div>

        <table className="table" style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Descripción</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>No hay productos en la factura aún.</td>
              </tr>
            ) : (
              carrito.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{item.descripcion}</strong></td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td><strong>${item.subtotal.toFixed(2)}</strong></td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarItem(idx)}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <strong>${subtotalNeto.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>IVA ({ivaPorc}%):</span>
              <strong>${valorIva.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', borderTop: '2px solid #0f172a', paddingTop: '0.5rem', color: '#1d4ed8' }}>
              <span>TOTAL:</span>
              <strong>${totalFactura.toFixed(2)}</strong>
            </div>
            <button className="btn btn-success" style={{ marginTop: '1rem', width: '100%' }} onClick={emitirFactura}>
              <i className="fa-solid fa-check"></i> Emitir Factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
