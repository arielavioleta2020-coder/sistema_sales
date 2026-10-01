const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. DISTRITOS
app.get('/api/distritos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM DISTRITO ORDER BY id_distrito');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. PRODUCTOS
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PRODUCTO ORDER BY id_producto');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/productos', async (req, res) => {
  const { descripcion, precio, stock_actual, stock_minimo, marca, linea_producto, importado } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO PRODUCTO (descripcion, precio, stock_actual, stock_minimo, marca, linea_producto, importado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [descripcion, precio, stock_actual, stock_minimo, marca, linea_producto, importado ? 1 : 0]
    );
    res.status(201).json({ id_producto: result.insertId, message: 'Producto creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. PRODUCTOS CON ALERTA DE STOCK BAJO (RF09)
app.get('/api/productos/bajo-stock', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_productos_stock_bajo');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CLIENTES
app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, d.descripcion AS distrito_nombre 
      FROM CLIENTE c 
      LEFT JOIN DISTRITO d ON c.id_distrito = d.id_distrito 
      ORDER BY c.id_cliente
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. FACTURAS CON TRANSACCIÓN ATÓMICA Y DESCUENTO DE STOCK
app.get('/api/facturas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_resumen_facturas ORDER BY fecha_registro DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/facturas', async (req, res) => {
  const { numero_factura, id_cliente, id_vendedor, iva, detalles } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insertar cabecera de Factura
    const fecha = new Date().toISOString().split('T')[0];
    await connection.query(
      'INSERT INTO FACTURA (numero_factura, fecha_registro, id_cliente, fecha_cancelacion, estado, id_vendedor, iva) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [numero_factura, fecha, id_cliente, fecha, 'PAGADA', id_vendedor, iva || 15.00]
    );

    // Insertar detalles y validar/descontar stock
    for (const item of detalles) {
      const [prodRows] = await connection.query('SELECT stock_actual, descripcion FROM PRODUCTO WHERE id_producto = ? FOR UPDATE', [item.id_producto]);
      if (prodRows.length === 0 || prodRows[0].stock_actual < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${item.id_producto}`);
      }

      await connection.query(
        'INSERT INTO DETALLE_FACTURA (numero_factura, id_producto, cantidad, precio_venta) VALUES (?, ?, ?, ?)',
        [numero_factura, item.id_producto, item.cantidad, item.precio_venta]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Factura emitida y stock actualizado exitosamente' });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// 6. DASHBOARD KPIS (FIGURA 5 Y 6)
app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const [ventasRows] = await db.query("SELECT IFNULL(SUM(d.cantidad * d.precio_venta * (1 + f.iva/100)), 0) AS total_ventas FROM FACTURA f JOIN DETALLE_FACTURA d ON f.numero_factura = d.numero_factura WHERE f.estado != 'ANULADA'");
    const [facturasRows] = await db.query('SELECT COUNT(*) AS total_facturas FROM FACTURA');
    const [productosRows] = await db.query('SELECT COUNT(*) AS total_productos FROM PRODUCTO');
    const [bajoStockRows] = await db.query('SELECT COUNT(*) AS bajo_stock FROM PRODUCTO WHERE stock_actual <= stock_minimo');
    const [ordenesRows] = await db.query("SELECT COUNT(*) AS ordenes_pendientes FROM ORDEN_COMPRA WHERE estado = 'PENDIENTE'");

    res.json({
      total_ventas: parseFloat(ventasRows[0].total_ventas).toFixed(2),
      total_facturas: facturasRows[0].total_facturas,
      total_productos: productosRows[0].total_productos,
      bajo_stock: bajoStockRows[0].bajo_stock,
      ordenes_pendientes: ordenesRows[0].ordenes_pendientes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Node.js SISTEMA_SALES escuchando en http://localhost:${PORT}`);
  console.log(`Conectado a MySQL Workbench en la base de datos 'sistema_sales'`);
});
