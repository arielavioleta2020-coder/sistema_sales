-- =====================================================================
-- SISTEMA_SALES S.A. - CONSULTAS DE PRUEBA Y VALIDACIÓN EN MYSQL WORKBENCH
-- =====================================================================
USE sistema_sales;

-- 1. CONSULTA DE PRODUCTOS CON ALERTA DE STOCK BAJO (RF09)
SELECT 
    id_producto,
    descripcion,
    marca,
    stock_actual,
    stock_minimo,
    (stock_minimo - stock_actual) AS deficit,
    CASE 
        WHEN stock_actual = 0 THEN 'AGOTADO'
        WHEN stock_actual <= stock_minimo THEN 'STOCK CRÍTICO - REABASTECER'
        ELSE 'STOCK ADECUADO'
    END AS estado
FROM PRODUCTO
ORDER BY stock_actual ASC;

-- 2. REPORTE GENERAL DE VENTAS FACTURADAS CON IVA CALCULADO (RF10, RF11, RF16)
SELECT 
    f.numero_factura,
    f.fecha_registro,
    c.nombre_razon_social AS cliente,
    c.ruc,
    CONCAT(v.nombres, ' ', v.apellidos) AS vendedor,
    f.estado,
    SUM(d.cantidad * d.precio_venta) AS subtotal,
    ROUND(SUM(d.cantidad * d.precio_venta) * (f.iva / 100), 2) AS valor_iva,
    ROUND(SUM(d.cantidad * d.precio_venta) * (1 + (f.iva / 100)), 2) AS total_factura
FROM FACTURA f
INNER JOIN CLIENTE c ON f.id_cliente = c.id_cliente
INNER JOIN VENDEDOR v ON f.id_vendedor = v.id_vendedor
INNER JOIN DETALLE_FACTURA d ON f.numero_factura = d.numero_factura
GROUP BY f.numero_factura, f.fecha_registro, c.nombre_razon_social, c.ruc, v.nombres, v.apellidos, f.estado, f.iva
ORDER BY f.fecha_registro DESC;

-- 3. DETALLE ESPECÍFICO DE UNA FACTURA CON SUS ÍTEMS
SELECT 
    d.numero_factura,
    p.descripcion AS producto,
    p.marca,
    p.linea_producto,
    d.cantidad,
    d.precio_venta,
    (d.cantidad * d.precio_venta) AS importe
FROM DETALLE_FACTURA d
INNER JOIN PRODUCTO p ON d.id_producto = p.id_producto
WHERE d.numero_factura = 'FAC-001-001-0000001';

-- 4. CONSULTA DE ÓRDENES DE COMPRA Y DETALLE DE PRODUCTOS SOLICITADOS (RF12, RF13)
SELECT 
    o.id_orden,
    o.fecha_registro,
    pr.razon_social AS proveedor,
    pr.telefono AS telefono_proveedor,
    o.estado,
    p.descripcion AS producto_solicitado,
    d.cantidad_solicitada
FROM ORDEN_COMPRA o
INNER JOIN PROVEEDOR pr ON o.id_proveedor = pr.id_proveedor
INNER JOIN DETALLE_ORDEN d ON o.id_orden = d.id_orden
INNER JOIN PRODUCTO p ON d.id_producto = p.id_producto
ORDER BY o.id_orden, p.descripcion;

-- 5. RELACIÓN DE PROVEEDORES Y SUS PRECIOS DE ABASTECIMIENTO (RF14)
SELECT 
    pr.razon_social AS proveedor,
    p.descripcion AS producto,
    a.precio AS costo_abastecimiento,
    p.precio AS precio_venta,
    ROUND(p.precio - a.precio, 2) AS margen_bruto
FROM ABASTECIMIENTO a
INNER JOIN PROVEEDOR pr ON a.id_proveedor = pr.id_proveedor
INNER JOIN PRODUCTO p ON a.id_producto = p.id_producto
ORDER BY pr.razon_social, p.descripcion;

-- 6. PRUEBA DE DISPARADOR (TRIGGER): Validar que el stock disminuye al facturar
-- Ver stock antes:
SELECT id_producto, descripcion, stock_actual FROM PRODUCTO WHERE id_producto = 5;
-- Si se vende 2 unidades del producto 5:
-- INSERT INTO FACTURA VALUES ('FAC-TEST-001', CURDATE(), 1, CURDATE(), 'PAGADA', 1, 15.00);
-- INSERT INTO DETALLE_FACTURA VALUES ('FAC-TEST-001', 5, 2, 32.50);
-- Ver stock después (debe haber bajado en 2):
-- SELECT id_producto, descripcion, stock_actual FROM PRODUCTO WHERE id_producto = 5;
