-- =====================================================================
-- INSTITUTO SUPERIOR TECNOLÓGICO JAPÓN
-- CARRERA: TECNOLOGÍA SUPERIOR EN DESARROLLO DE SOFTWARE
-- PROYECTO DE TITULACIÓN: SISTEMA_SALES S. A. (QUITO, ECUADOR)
-- SCRIPT MAESTRO OFICIAL PARA MYSQL WORKBENCH
-- Motor de Base de Datos: MySQL 8.0+ / MariaDB 10.4+
-- Codificación: UTF8MB4 (Soporte internacional y caracteres en español)
-- =====================================================================

-- 1. CREACIÓN Y SELECCIÓN DE BASE DE DATOS
DROP DATABASE IF EXISTS sistema_sales;
CREATE DATABASE IF NOT EXISTS sistema_sales CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE sistema_sales;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 2. DDL - DEFINICIÓN DE TABLAS CON CLAVES PRIMARIAS Y FORÁNEAS (3FN)
-- Conforme al Capítulo VI y Diccionario de Datos del Documento
-- =====================================================================

-- 2.1 TABLA: DISTRITO (Catálogo territorial de Quito)
DROP TABLE IF EXISTS DISTRITO;
CREATE TABLE DISTRITO (
    id_distrito INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL COMMENT 'Parroquia o distrito metropolitano de Quito'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Catálogo territorial de distritos';

-- 2.2 TABLA: CLIENTE (RN01: Asociado obligatoriamente a un distrito)
DROP TABLE IF EXISTS CLIENTE;
CREATE TABLE CLIENTE (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_razon_social VARCHAR(150) NOT NULL COMMENT 'Nombres o razón social',
    direccion VARCHAR(200) NOT NULL COMMENT 'Dirección domiciliaria / comercial',
    telefono VARCHAR(20) NOT NULL COMMENT 'Teléfono de contacto',
    ruc VARCHAR(13) NOT NULL UNIQUE COMMENT 'RUC o Cédula de 13 dígitos para Ecuador',
    fecha_registro DATE NOT NULL COMMENT 'Fecha de ingreso al sistema',
    tipo_cliente VARCHAR(50) NOT NULL COMMENT 'Mayorista, Minorista, Corporativo, Final',
    condicion VARCHAR(50) NOT NULL COMMENT 'Activo, Inactivo, Moroso, Excelente',
    id_distrito INT NOT NULL COMMENT 'Distrito al que pertenece (RN01)',
    CONSTRAINT fk_cliente_distrito FOREIGN KEY (id_distrito) 
        REFERENCES DISTRITO (id_distrito) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Registro de clientes comerciales';

-- 2.3 TABLA: PROVEEDOR (RN02: Asociado obligatoriamente a un distrito)
DROP TABLE IF EXISTS PROVEEDOR;
CREATE TABLE PROVEEDOR (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(150) NOT NULL COMMENT 'Razón social del proveedor',
    direccion VARCHAR(200) NOT NULL COMMENT 'Dirección de la empresa',
    telefono VARCHAR(20) NOT NULL COMMENT 'Teléfono de contacto comercial',
    representante_legal VARCHAR(150) NOT NULL COMMENT 'Representante legal',
    id_distrito INT NOT NULL COMMENT 'Distrito al que pertenece (RN02)',
    CONSTRAINT fk_proveedor_distrito FOREIGN KEY (id_distrito) 
        REFERENCES DISTRITO (id_distrito) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Registro de empresas proveedoras';

-- 2.4 TABLA: VENDEDOR (RN03: Asociado obligatoriamente a un distrito)
DROP TABLE IF EXISTS VENDEDOR;
CREATE TABLE VENDEDOR (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL COMMENT 'Nombres del vendedor',
    apellidos VARCHAR(100) NOT NULL COMMENT 'Apellidos del vendedor',
    sueldo DECIMAL(10,2) NOT NULL CHECK (sueldo >= 0) COMMENT 'Sueldo mensual en USD',
    fecha_inicio DATE NOT NULL COMMENT 'Fecha de contratación',
    tipo_vendedor VARCHAR(50) NOT NULL COMMENT 'Senior, Junior, Planta, Comisionista',
    id_distrito INT NOT NULL COMMENT 'Distrito de residencia (RN03)',
    CONSTRAINT fk_vendedor_distrito FOREIGN KEY (id_distrito) 
        REFERENCES DISTRITO (id_distrito) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Personal comercial y vendedores';

-- 2.5 TABLA: PRODUCTO (RN11: Stock no negativo, RN13: Precio venta > 0)
DROP TABLE IF EXISTS PRODUCTO;
CREATE TABLE PRODUCTO (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL COMMENT 'Descripción técnica y comercial',
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0) COMMENT 'Precio de venta al público en USD (RN13)',
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0) COMMENT 'Existencia física actual en bodega (RN11)',
    stock_minimo INT NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0) COMMENT 'Stock de seguridad para alertas (RF09)',
    marca VARCHAR(100) NOT NULL COMMENT 'Marca comercial',
    linea_producto VARCHAR(100) NOT NULL COMMENT 'Línea o familia del producto',
    importado BOOLEAN NOT NULL DEFAULT FALSE COMMENT '1 = Importado, 0 = Nacional'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Catálogo maestro de inventario de productos';

-- 2.6 TABLA: FACTURA (RN04: Cliente, RN05: Vendedor)
DROP TABLE IF EXISTS FACTURA;
CREATE TABLE FACTURA (
    numero_factura VARCHAR(30) PRIMARY KEY COMMENT 'Código único e.g. FAC-001-001-0000001',
    fecha_registro DATE NOT NULL COMMENT 'Fecha de emisión',
    id_cliente INT NOT NULL COMMENT 'Cliente (RN04)',
    fecha_cancelacion DATE NULL COMMENT 'Fecha de pago efectivo',
    estado VARCHAR(30) NOT NULL DEFAULT 'EMITIDA' COMMENT 'EMITIDA, PAGADA, ANULADA',
    id_vendedor INT NOT NULL COMMENT 'Vendedor responsable (RN05)',
    iva DECIMAL(5,2) NOT NULL DEFAULT 15.00 CHECK (iva >= 0) COMMENT 'Porcentaje de IVA (15% en Ecuador)',
    CONSTRAINT fk_factura_cliente FOREIGN KEY (id_cliente) 
        REFERENCES CLIENTE (id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_factura_vendedor FOREIGN KEY (id_vendedor) 
        REFERENCES VENDEDOR (id_vendedor) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Cabecera de facturas de venta';

-- 2.7 TABLA: DETALLE_FACTURA (RN06: Múltiples detalles, RN07: Producto)
DROP TABLE IF EXISTS DETALLE_FACTURA;
CREATE TABLE DETALLE_FACTURA (
    numero_factura VARCHAR(30) NOT NULL COMMENT 'Factura cabecera',
    id_producto INT NOT NULL COMMENT 'Producto comercializado (RN07)',
    cantidad INT NOT NULL CHECK (cantidad > 0) COMMENT 'Cantidad de unidades vendidas',
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta > 0) COMMENT 'Precio unitario de venta (RN13)',
    PRIMARY KEY (numero_factura, id_producto),
    CONSTRAINT fk_detalle_factura_cabecera FOREIGN KEY (numero_factura) 
        REFERENCES FACTURA (numero_factura) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detalle_factura_producto FOREIGN KEY (id_producto) 
        REFERENCES PRODUCTO (id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Líneas de detalle por factura de venta';

-- 2.8 TABLA: ORDEN_COMPRA (RN08: Asociada a un proveedor)
DROP TABLE IF EXISTS ORDEN_COMPRA;
CREATE TABLE ORDEN_COMPRA (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    fecha_registro DATE NOT NULL COMMENT 'Fecha de emisión de la orden',
    id_proveedor INT NOT NULL COMMENT 'Proveedor asignado (RN08)',
    fecha_atencion DATE NULL COMMENT 'Fecha de entrega por el proveedor',
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE, ATENDIDA, CANCELADA',
    CONSTRAINT fk_orden_proveedor FOREIGN KEY (id_proveedor) 
        REFERENCES PROVEEDOR (id_proveedor) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Cabecera de órdenes de compra a proveedores';

-- 2.9 TABLA: DETALLE_ORDEN (RN09: Múltiples detalles, RN10: Producto, RN12: Cantidad > 0)
DROP TABLE IF EXISTS DETALLE_ORDEN;
CREATE TABLE DETALLE_ORDEN (
    id_orden INT NOT NULL COMMENT 'Orden cabecera',
    id_producto INT NOT NULL COMMENT 'Producto solicitado (RN10)',
    cantidad_solicitada INT NOT NULL CHECK (cantidad_solicitada > 0) COMMENT 'Cantidad requerida (> 0, RN12)',
    PRIMARY KEY (id_orden, id_producto),
    CONSTRAINT fk_detalle_orden_cabecera FOREIGN KEY (id_orden) 
        REFERENCES ORDEN_COMPRA (id_orden) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detalle_orden_producto FOREIGN KEY (id_producto) 
        REFERENCES PRODUCTO (id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Detalle de productos en órdenes de compra';

-- 2.10 TABLA: ABASTECIMIENTO (Matriz de costos Proveedor - Producto)
DROP TABLE IF EXISTS ABASTECIMIENTO;
CREATE TABLE ABASTECIMIENTO (
    id_proveedor INT NOT NULL COMMENT 'Proveedor que oferta el producto',
    id_producto INT NOT NULL COMMENT 'Producto ofertado',
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0) COMMENT 'Precio de costo acordado con el proveedor',
    PRIMARY KEY (id_proveedor, id_producto),
    CONSTRAINT fk_abastecimiento_proveedor FOREIGN KEY (id_proveedor) 
        REFERENCES PROVEEDOR (id_proveedor) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_abastecimiento_producto FOREIGN KEY (id_producto) 
        REFERENCES PRODUCTO (id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Matriz de costos de abastecimiento por proveedor';

-- 2.11 TABLA: USUARIO (RF01: Autenticación, RF02: Gestión de Roles)
DROP TABLE IF EXISTS USUARIO;
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Usuario para login',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Clave cifrada',
    nombre_completo VARCHAR(150) NOT NULL COMMENT 'Nombre completo del operador',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico',
    rol VARCHAR(30) NOT NULL COMMENT 'Administrador, Vendedor, Personal de compras, Personal administrativo',
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' COMMENT 'ACTIVO o INACTIVO',
    ultimo_acceso DATETIME NULL COMMENT 'Fecha y hora del último acceso'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci COMMENT='Usuarios del sistema con roles y accesos';

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 3. CARGA DE DATOS DE PRUEBA REALISTAS (SEMILLAS)
-- Adaptado a Quito, Ecuador (RUCs válidos, Parroquias, Precios en USD)
-- =====================================================================

-- 3.1 Distritos de Quito
INSERT INTO DISTRITO (id_distrito, descripcion) VALUES
(1, 'Iñaquito (Norte Financiero)'),
(2, 'La Mariscal (Centro Norte)'),
(3, 'Centro Histórico'),
(4, 'Cotocollao (Norte)'),
(5, 'Calderón (Extremo Norte)'),
(6, 'Cumbayá (Valles)'),
(7, 'Tumbaco (Valles)'),
(8, 'Chillogallo (Sur)'),
(9, 'La Magdalena (Sur)');

-- 3.2 Clientes
INSERT INTO CLIENTE (id_cliente, nombre_razon_social, direccion, telefono, ruc, fecha_registro, tipo_cliente, condicion, id_distrito) VALUES
(1, 'Corporación Favorita C.A.', 'Av. General Enríquez km 3.5', '022998800', '1790016919001', '2026-01-10', 'Corporativo', 'Activo', 1),
(2, 'Distribuidora Pichincha S.A.', 'Av. 10 de Agosto N24-15', '022543210', '1791234567001', '2026-01-15', 'Mayorista', 'Activo', 2),
(3, 'Comercializadora El Cóndor', 'Calle Guayaquil N4-22', '022887766', '1714567890001', '2026-02-01', 'Minorista', 'Activo', 3),
(4, 'Sistemas y Redes Andinos Cía.', 'Av. Prensa N55-12 y Florida', '022445566', '1792345678001', '2026-02-12', 'Corporativo', 'Activo', 4),
(5, 'TecnoQuito Soluciones C.A.', 'Av. Carapungo 452 y Panamericana', '022822119', '1793456789001', '2026-03-01', 'Mayorista', 'Activo', 5),
(6, 'Juan Carlos Mendoza Loor', 'Vía Interoceánica km 7.5', '0998765432', '1718901234001', '2026-03-10', 'Final', 'Activo', 6),
(7, 'Mariana de Jesús Paredes', 'Av. Rodrigo de Chávez S12-44', '0987654321', '1709876543001', '2026-03-15', 'Minorista', 'Activo', 9);

-- 3.3 Proveedores
INSERT INTO PROVEEDOR (id_proveedor, razon_social, direccion, telefono, representante_legal, id_distrito) VALUES
(1, 'Mayorista Tecnológico del Ecuador S.A.', 'Av. Galo Plaza Lasso N60-12', '022478900', 'Ing. Carlos Albuja', 4),
(2, 'Importadora Global Tech Cía. Ltda.', 'Av. Eloy Alfaro N34-110', '022245600', 'Msc. Diana Benavides', 1),
(3, 'CompuDistribuciones Andinas S.A.', 'Av. América N18-35', '022521144', 'Lic. Roberto Vaca', 2),
(4, 'Soluciones y Partes Informáticas S.A.', 'Av. Pedro Vicente Maldonado S30-10', '022671199', 'Ing. Patricia Solís', 8);

-- 3.4 Vendedores
INSERT INTO VENDEDOR (id_vendedor, nombres, apellidos, sueldo, fecha_inicio, tipo_vendedor, id_distrito) VALUES
(1, 'Karina Violeta', 'Figueroa Vergara', 1250.00, '2025-06-01', 'Senior', 1),
(2, 'Esteban Fernando', 'Gómez Játiva', 950.00, '2025-08-15', 'Planta', 2),
(3, 'Andrea Patricia', 'Morales Silva', 850.00, '2025-10-01', 'Comisionista', 6),
(4, 'Mateo Sebastián', 'Castillo Rueda', 750.00, '2026-01-10', 'Junior', 4);

-- 3.5 Productos
INSERT INTO PRODUCTO (id_producto, descripcion, precio, stock_actual, stock_minimo, marca, linea_producto, importado) VALUES
(1, 'Laptop Dell Latitude 3440 Core i7 16GB 512GB SSD', 850.00, 24, 6, 'Dell', 'Laptops y Portátiles', 1),
(2, 'Laptop Lenovo ThinkPad E14 Ryzen 7 16GB 512GB SSD', 790.00, 18, 5, 'Lenovo', 'Laptops y Portátiles', 1),
(3, 'Monitor HP ProDisplay P24v G5 24 pulgadas FHD 75Hz', 145.00, 32, 8, 'HP', 'Monitores y Pantallas', 1),
(4, 'Impresora Multifunción Epson EcoTank L3250 WiFi', 215.00, 15, 5, 'Epson', 'Impresión y Digitalización', 1),
(5, 'Teclado y Ratón Inalámbrico Logitech MK270', 32.50, 45, 12, 'Logitech', 'Periféricos y Accesorios', 1),
(6, 'Disco Solido Kingston NV2 1TB NVMe PCIe 4.0', 78.00, 8, 10, 'Kingston', 'Almacenamiento', 1),
(7, 'Router Inalámbrico TP-Link Archer AX12 Wi-Fi 6', 58.00, 4, 8, 'TP-Link', 'Redes y Conectividad', 1),
(8, 'Memoria RAM Corsair Vengeance LPX 16GB DDR4 3200MHz', 48.00, 5, 8, 'Corsair', 'Componentes y Partes', 1),
(9, 'Cable de Red Patch Cord Cat6 UTP 3 Metros Gris', 4.50, 85, 20, 'Panduit', 'Redes y Conectividad', 0),
(10, 'Regulador de Voltaje Forza FVR-1211USB 1200VA/600W', 26.00, 3, 6, 'Forza', 'Energía y Protección', 1);

-- 3.6 Abastecimiento (Relación Proveedor - Producto y Costo)
INSERT INTO ABASTECIMIENTO (id_proveedor, id_producto, precio) VALUES
(1, 1, 680.00),
(1, 2, 630.00),
(1, 3, 115.00),
(2, 4, 172.00),
(2, 5, 23.50),
(3, 6, 59.00),
(3, 7, 42.00),
(3, 8, 36.00),
(4, 9, 2.20),
(4, 10, 18.50);

-- 3.7 Órdenes de Compra
INSERT INTO ORDEN_COMPRA (id_orden, fecha_registro, id_proveedor, fecha_atencion, estado) VALUES
(1, '2026-03-01', 1, '2026-03-04', 'ATENDIDA'),
(2, '2026-03-10', 2, '2026-03-13', 'ATENDIDA'),
(3, '2026-03-20', 3, NULL, 'PENDIENTE'),
(4, '2026-03-25', 4, NULL, 'PENDIENTE');

-- 3.8 Detalle de Órdenes de Compra
INSERT INTO DETALLE_ORDEN (id_orden, id_producto, cantidad_solicitada) VALUES
(1, 1, 10),
(1, 2, 8),
(2, 4, 12),
(2, 5, 25),
(3, 6, 15),
(3, 7, 20),
(4, 8, 15),
(4, 10, 10);

-- 3.9 Facturas Emitidas
INSERT INTO FACTURA (numero_factura, fecha_registro, id_cliente, fecha_cancelacion, estado, id_vendedor, iva) VALUES
('FAC-001-001-0000001', '2026-03-05', 1, '2026-03-05', 'PAGADA', 1, 15.00),
('FAC-001-001-0000002', '2026-03-08', 2, '2026-03-08', 'PAGADA', 2, 15.00),
('FAC-001-001-0000003', '2026-03-15', 3, '2026-03-15', 'PAGADA', 1, 15.00),
('FAC-001-001-0000004', '2026-03-22', 4, '2026-03-22', 'PAGADA', 3, 15.00),
('FAC-001-001-0000005', '2026-03-28', 5, NULL, 'EMITIDA', 4, 15.00);

-- 3.10 Detalle de Facturas
INSERT INTO DETALLE_FACTURA (numero_factura, id_producto, cantidad, precio_venta) VALUES
('FAC-001-001-0000001', 1, 3, 850.00),
('FAC-001-001-0000001', 3, 5, 145.00),
('FAC-001-001-0000001', 5, 6, 32.50),
('FAC-001-001-0000002', 2, 2, 790.00),
('FAC-001-001-0000002', 4, 3, 215.00),
('FAC-001-001-0000003', 5, 10, 32.50),
('FAC-001-001-0000003', 6, 2, 78.00),
('FAC-001-001-0000004', 1, 2, 850.00),
('FAC-001-001-0000004', 7, 4, 58.00),
('FAC-001-001-0000005', 3, 2, 145.00);

-- 3.11 Usuarios del Sistema
INSERT INTO USUARIO (id_usuario, username, password_hash, nombre_completo, email, rol, estado, ultimo_acceso) VALUES
(1, 'admin', 'pbkdf2:sha256:600000$admin123', 'Karina Figueroa (Administrador)', 'kfigueroa@sistemasales.com.ec', 'Administrador', 'ACTIVO', NOW()),
(2, 'vendedor1', 'pbkdf2:sha256:600000$vend123', 'Esteban Gómez (Ventas)', 'egomez@sistemasales.com.ec', 'Vendedor', 'ACTIVO', NOW()),
(3, 'compras1', 'pbkdf2:sha256:600000$comp123', 'Patricio Andrade (Abastecimiento)', 'pandrade@sistemasales.com.ec', 'Personal de compras', 'ACTIVO', NOW()),
(4, 'asistente', 'pbkdf2:sha256:600000$asist123', 'Sofía Carrera (Administrativo)', 'scarrera@sistemasales.com.ec', 'Personal administrativo', 'ACTIVO', NOW());

-- =====================================================================
-- 4. DISPARADORES (TRIGGERS) PARA REGLAS DE NEGOCIO (RN11, RN14)
-- Se configuran para actuar en operaciones automáticas de venta y reposición
-- =====================================================================

-- Trigger: Validar stock disponible antes de emitir la venta (RN11)
DROP TRIGGER IF EXISTS trg_validar_stock_disponible;
DELIMITER $$
CREATE TRIGGER trg_validar_stock_disponible
BEFORE INSERT ON DETALLE_FACTURA
FOR EACH ROW
BEGIN
    DECLARE stock_disp INT;
    SELECT stock_actual INTO stock_disp FROM PRODUCTO WHERE id_producto = NEW.id_producto;
    IF stock_disp < NEW.cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error RN11: Stock físico insuficiente para procesar la venta.';
    END IF;
END$$
DELIMITER ;

-- Trigger: Descontar stock al registrar detalle de venta
DROP TRIGGER IF EXISTS trg_descontar_stock_venta;
DELIMITER $$
CREATE TRIGGER trg_descontar_stock_venta
AFTER INSERT ON DETALLE_FACTURA
FOR EACH ROW
BEGIN
    UPDATE PRODUCTO
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END$$
DELIMITER ;

-- Trigger: Restaurar inventario si se anula la venta (RN14)
DROP TRIGGER IF EXISTS trg_restaurar_stock_anulacion;
DELIMITER $$
CREATE TRIGGER trg_restaurar_stock_anulacion
AFTER DELETE ON DETALLE_FACTURA
FOR EACH ROW
BEGIN
    UPDATE PRODUCTO
    SET stock_actual = stock_actual + OLD.cantidad
    WHERE id_producto = OLD.id_producto;
END$$
DELIMITER ;

-- Trigger: Sumar stock automáticamente al atender orden de compra
DROP TRIGGER IF EXISTS trg_recepcion_orden_compra;
DELIMITER $$
CREATE TRIGGER trg_recepcion_orden_compra
AFTER UPDATE ON ORDEN_COMPRA
FOR EACH ROW
BEGIN
    IF OLD.estado != 'ATENDIDA' AND NEW.estado = 'ATENDIDA' THEN
        UPDATE PRODUCTO p
        INNER JOIN DETALLE_ORDEN d ON p.id_producto = d.id_producto
        SET p.stock_actual = p.stock_actual + d.cantidad_solicitada
        WHERE d.id_orden = NEW.id_orden;
    END IF;
END$$
DELIMITER ;

-- =====================================================================
-- 5. VISTAS ANALÍTICAS PARA REPORTES Y DASHBOARD (RF15, RF16, Fig. 5 y 6)
-- =====================================================================

-- Vista: Resumen Financiero de Facturas con IVA y Totales
DROP VIEW IF EXISTS v_resumen_facturas;
CREATE VIEW v_resumen_facturas AS
SELECT 
    f.numero_factura,
    f.fecha_registro,
    c.id_cliente,
    c.nombre_razon_social AS cliente_nombre,
    c.ruc AS cliente_ruc,
    v.id_vendedor,
    CONCAT(v.nombres, ' ', v.apellidos) AS vendedor_nombre,
    f.estado,
    f.iva,
    IFNULL(SUM(d.cantidad * d.precio_venta), 0) AS subtotal,
    ROUND(IFNULL(SUM(d.cantidad * d.precio_venta), 0) * (f.iva / 100), 2) AS monto_iva,
    ROUND(IFNULL(SUM(d.cantidad * d.precio_venta), 0) * (1 + (f.iva / 100)), 2) AS total_pagar
FROM FACTURA f
INNER JOIN CLIENTE c ON f.id_cliente = c.id_cliente
INNER JOIN VENDEDOR v ON f.id_vendedor = v.id_vendedor
LEFT JOIN DETALLE_FACTURA d ON f.numero_factura = d.numero_factura
GROUP BY f.numero_factura, f.fecha_registro, c.id_cliente, c.nombre_razon_social, c.ruc, v.id_vendedor, v.nombres, v.apellidos, f.estado, f.iva;

-- Vista: Alerta Preventiva de Stock Mínimo (RF09)
DROP VIEW IF EXISTS v_productos_stock_bajo;
CREATE VIEW v_productos_stock_bajo AS
SELECT 
    p.id_producto,
    p.descripcion,
    p.marca,
    p.linea_producto,
    p.stock_actual,
    p.stock_minimo,
    (p.stock_minimo - p.stock_actual) AS deficit,
    CASE 
        WHEN p.stock_actual = 0 THEN 'AGOTADO'
        WHEN p.stock_actual <= p.stock_minimo THEN 'STOCK CRÍTICO'
        ELSE 'NORMAL'
    END AS estado_alerta
FROM PRODUCTO p
WHERE p.stock_actual <= p.stock_minimo;

-- Vista: Ranking de Facturación por Vendedor
DROP VIEW IF EXISTS v_ventas_por_vendedor;
CREATE VIEW v_ventas_por_vendedor AS
SELECT 
    v.id_vendedor,
    CONCAT(v.nombres, ' ', v.apellidos) AS vendedor,
    v.tipo_vendedor,
    COUNT(DISTINCT f.numero_factura) AS total_facturas,
    IFNULL(SUM(d.cantidad * d.precio_venta), 0) AS total_ventas_usd
FROM VENDEDOR v
LEFT JOIN FACTURA f ON v.id_vendedor = f.id_vendedor AND f.estado != 'ANULADA'
LEFT JOIN DETALLE_FACTURA d ON f.numero_factura = d.numero_factura
GROUP BY v.id_vendedor, v.nombres, v.apellidos, v.tipo_vendedor;

-- Vista: Matriz de Costos por Proveedor
DROP VIEW IF EXISTS v_catalogo_abastecimiento;
CREATE VIEW v_catalogo_abastecimiento AS
SELECT 
    p.id_proveedor,
    p.razon_social AS proveedor,
    p.telefono AS contacto_proveedor,
    prod.id_producto,
    prod.descripcion AS producto,
    prod.marca,
    prod.stock_actual,
    a.precio AS costo_abastecimiento,
    prod.precio AS precio_venta_publico,
    ROUND((prod.precio - a.precio), 2) AS margen_ganancia
FROM ABASTECIMIENTO a
INNER JOIN PROVEEDOR p ON a.id_proveedor = p.id_proveedor
INNER JOIN PRODUCTO prod ON a.id_producto = prod.id_producto;

-- =====================================================================
-- 6. PROCEDIMIENTOS ALMACENADOS
-- =====================================================================

-- Registrar Factura de Venta Rápida
DROP PROCEDURE IF EXISTS sp_registrar_factura;
DELIMITER $$
CREATE PROCEDURE sp_registrar_factura(
    IN p_numero VARCHAR(30),
    IN p_fecha DATE,
    IN p_cliente INT,
    IN p_vendedor INT,
    IN p_iva DECIMAL(5,2)
)
BEGIN
    INSERT INTO FACTURA (numero_factura, fecha_registro, id_cliente, fecha_cancelacion, estado, id_vendedor, iva)
    VALUES (p_numero, p_fecha, p_cliente, p_fecha, 'PAGADA', p_vendedor, p_iva);
END$$
DELIMITER ;

-- =====================================================================
-- 7. COMPROBACIÓN FINAL EN MYSQL WORKBENCH
-- =====================================================================
SELECT 'SISTEMA_SALES S.A. - BASE DE DATOS CREADA Y POBLADA CON ÉXITO' AS Confirmacion;
SELECT COUNT(*) AS Distritos FROM DISTRITO;
SELECT COUNT(*) AS Clientes FROM CLIENTE;
SELECT COUNT(*) AS Proveedores FROM PROVEEDOR;
SELECT COUNT(*) AS Vendedores FROM VENDEDOR;
SELECT COUNT(*) AS Productos FROM PRODUCTO;
SELECT COUNT(*) AS Facturas FROM FACTURA;
SELECT COUNT(*) AS Detalles FROM DETALLE_FACTURA;
SELECT COUNT(*) AS Ordenes_Compra FROM ORDEN_COMPRA;
SELECT COUNT(*) AS Usuarios FROM USUARIO;

-- Fin del script MySQL Workbench
