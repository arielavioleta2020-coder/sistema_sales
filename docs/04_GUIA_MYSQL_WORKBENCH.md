# GUÍA DE CONFIGURACIÓN Y EJECUCIÓN EN MYSQL WORKBENCH
### SISTEMA_SALES S.A. • Base de Datos Relacional

Esta guía describe el procedimiento paso a paso para abrir, compilar y ejecutar la base de datos `sistema_sales` en **MySQL Workbench**.

---

## 1. UBICACIÓN DE LOS SCRIPTS SQL
En la carpeta del proyecto encontrará los scripts preparados:
- `database/sistema_sales_mysql.sql`: Script maestro que contiene:
  - Creación de base de datos `sistema_sales` con codificación UTF8MB4.
  - Creación de las 11 tablas con Primary Keys, Foreign Keys, Checks y tipos de datos exactos según el diccionario del caso.
  - Triggers para control de stock no negativo (RN11) y reposición por anulación (RN14).
  - Vistas analíticas (`v_resumen_facturas`, `v_productos_stock_bajo`, `v_ventas_por_vendedor`).
  - Procedimientos almacenados (`sp_registrar_factura`).
  - Semillas y datos de prueba realistas para la ciudad de Quito, Ecuador.
- `database/test_queries.sql`: Consultas de validación para demostración en la defensa.

---

## 2. PASOS PARA EJECUTAR EN MYSQL WORKBENCH

### Paso 1: Abrir MySQL Workbench
1. Inicie la aplicación **MySQL Workbench** en Windows.
2. Haga doble clic en su conexión local (ejemplo: `Local instance MySQL80` en `localhost:3306`).

### Paso 2: Cargar el Script SQL
1. En el menú superior de MySQL Workbench, haga clic en:  
   `File` -> `Open SQL Script...` (o presione `Ctrl + Shift + O`).
2. Navegue hasta la carpeta del proyecto:
   `c:\Users\User\Downloads\Caso sales\database\sistema_sales_mysql.sql`
3. Haga clic en **Abrir**.

### Paso 3: Ejecutar el Script Completo
1. Haga clic en el ícono del **Rayo amarillo** (`Execute`) en la barra de herramientas del editor SQL (o presione `Ctrl + Shift + Enter`).
2. En el panel inferior **Action Output**, observará que todas las sentencias se ejecutan con visto verde:
   - `CREATE DATABASE sistema_sales`
   - `CREATE TABLE DISTRITO, CLIENTE, PROVEEDOR, VENDEDOR, PRODUCTO, FACTURA...`
   - `CREATE TRIGGER trg_descontar_stock_venta...`
   - `INSERT INTO...`
3. En el panel lateral izquierdo **Schemas**, haga clic derecho y seleccione **Refresh All**. Aparecerá el esquema `sistema_sales` con todas sus tablas, vistas, triggers y procedimientos almacenados.

---

## 3. GENERAR EL DIAGRAMA EER EN MYSQL WORKBENCH (INGENIERÍA INVERSA)
Para visualizar el diagrama relacional idéntico a la Figura 2 y 3 del documento de grado:
1. En el menú principal de MySQL Workbench, vaya a:  
   `Database` -> `Reverse Engineer...` (o `Ctrl + R`).
2. Seleccione su conexión local y haga clic en **Next**.
3. Ingrese su contraseña si se la solicita y haga clic en **Next**.
4. Seleccione la casilla de la base de datos `sistema_sales` y haga clic en **Next**.
5. Haga clic en **Execute** y luego en **Finish**.
6. MySQL Workbench abrirá automáticamente la pestaña **EER Diagram** donde podrá ver gráficamente todas las tablas y sus relaciones de cardinalidad (1 a N).

---

## 4. VALIDACIÓN DE REGLAS DE NEGOCIO MEDIANTE SQL

### Probar Validación de Stock Automático (Trigger):
```sql
USE sistema_sales;

-- 1. Consultar existencia inicial de un producto
SELECT id_producto, descripcion, stock_actual, stock_minimo 
FROM PRODUCTO WHERE id_producto = 1;

-- 2. Emitir venta mediante Factura
INSERT INTO FACTURA (numero_factura, fecha_registro, id_cliente, fecha_cancelacion, estado, id_vendedor, iva)
VALUES ('FAC-TEST-999', CURDATE(), 1, CURDATE(), 'PAGADA', 1, 15.00);

-- 3. Insertar detalle (esto activa el trigger que descuenta el stock físico)
INSERT INTO DETALLE_FACTURA (numero_factura, id_producto, cantidad, precio_venta)
VALUES ('FAC-TEST-999', 1, 2, 850.00);

-- 4. Verificar que el stock disminuyó en 2 unidades automáticamente
SELECT id_producto, descripcion, stock_actual, stock_minimo 
FROM PRODUCTO WHERE id_producto = 1;
```

### Probar Vista de Stock Crítico (RF09):
```sql
SELECT * FROM v_productos_stock_bajo;
```
Esto retornará los productos que han alcanzado o se encuentran por debajo del stock mínimo.
