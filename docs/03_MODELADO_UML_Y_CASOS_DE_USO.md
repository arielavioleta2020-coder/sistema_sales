# MODELADO UML DEL SISTEMA DE INFORMACIÓN
### SISTEMA_SALES S.A. • Capítulo V del Caso Práctico

## 1. DIAGRAMA DE CASOS DE USO (FIGURA 1 DE LA TESIS)
Ilustra los actores principales identificados en la empresa (Administrador, Vendedor, Personal de Compras y Personal Administrativo) y sus interacciones con los módulos del sistema.

```mermaid
graph LR
    subgraph "Actores del Sistema"
        Admin["👤 Administrador"]
        Vend["👤 Vendedor"]
        Comp["👤 Personal de Compras"]
        Adm["👤 Personal Administrativo"]
    end

    subgraph "SISTEMA_SALES - Casos de Uso"
        UC01(["UC01: Iniciar Sesión"])
        UC02(["UC02: Gestionar Clientes"])
        UC03(["UC03: Gestionar Proveedores"])
        UC04(["UC04: Gestionar Vendedores"])
        UC05(["UC05: Gestionar Productos"])
        UC06(["UC06: Controlar Inventario"])
        UC07(["UC07: Registrar Factura de Venta"])
        UC08(["UC08: Validar Stock Disponible"])
        UC09(["UC09: Gestionar Órdenes de Compra"])
        UC10(["UC10: Recepcionar Abastecimiento"])
        UC11(["UC11: Generar Reportes y KPIs"])
    end

    Admin --> UC01
    Admin --> UC02
    Admin --> UC03
    Admin --> UC04
    Admin --> UC05
    Admin --> UC06
    Admin --> UC09
    Admin --> UC11

    Vend --> UC01
    Vend --> UC02
    Vend --> UC07
    UC07 -.->|"include"| UC08
    Vend --> UC06

    Comp --> UC01
    Comp --> UC03
    Comp --> UC09
    Comp --> UC10

    Adm --> UC01
    Adm --> UC11
```

---

## 2. DIAGRAMA DE SECUENCIA: PROCESO DE FACTURACIÓN CON VALIDACIÓN DE STOCK
Representa la interacción paso a paso entre el Cliente, la Interfaz de Usuario, el Backend Django y la Base de Datos MySQL:

```mermaid
sequenceDiagram
    autonumber
    actor Vendedor as 👤 Vendedor
    participant UI as 🖥️ Frontend (Web/Desktop)
    participant Backend as ⚙️ Django API REST
    participant MySQL as 🗄️ MySQL Workbench (InnoDB)

    Vendedor->>UI: Selecciona Cliente y agrega Productos al Carrito
    Vendedor->>UI: Clic en "Emitir Factura"
    UI->>Backend: POST /api/facturas/ (detalles, cliente, vendedor, iva)
    
    activate Backend
    Backend->>MySQL: START TRANSACTION
    Backend->>MySQL: SELECT stock_actual FROM PRODUCTO WHERE id = ? FOR UPDATE
    
    alt Stock Insuficiente (RN11)
        MySQL-->>Backend: stock_actual < cantidad_solicitada
        Backend->>MySQL: ROLLBACK
        Backend-->>UI: 400 Bad Request ("Stock insuficiente")
        UI-->>Vendedor: Muestra Alerta de Error en Pantalla
    else Stock Suficiente
        Backend->>MySQL: INSERT INTO FACTURA (...)
        Backend->>MySQL: INSERT INTO DETALLE_FACTURA (...)
        Backend->>MySQL: UPDATE PRODUCTO SET stock_actual = stock_actual - ?
        Backend->>MySQL: COMMIT
        deactivate Backend
        Backend-->>UI: 201 Created (Comprobante generado)
        UI-->>Vendedor: Despliega Comprobante y actualiza Dashboard en tiempo real
    end
```

---

## 3. DIAGRAMA DE CLASES DEL DOMINIO (FIGURA 2 DE LA TESIS)
Estructura orientada a objetos implementada en el Backend Django y modelos relacionales:

```mermaid
classDiagram
    class Distrito {
        +int id_distrito
        +String descripcion
        +getClientes()
        +getProveedores()
    }

    class Cliente {
        +int id_cliente
        +String nombre_razon_social
        +String direccion
        +String telefono
        +String ruc
        +Date fecha_registro
        +String tipo_cliente
        +String condicion
        +int id_distrito
        +validarRUC()
    }

    class Proveedor {
        +int id_proveedor
        +String razon_social
        +String direccion
        +String telefono
        +String representante_legal
        +int id_distrito
    }

    class Vendedor {
        +int id_vendedor
        +String nombres
        +String apellidos
        +Decimal sueldo
        +Date fecha_inicio
        +String tipo_vendedor
        +int id_distrito
        +calcularComision()
    }

    class Producto {
        +int id_producto
        +String descripcion
        +Decimal precio
        +int stock_actual
        +int stock_minimo
        +String marca
        +String linea_producto
        +Boolean importado
        +esBajoStock() Boolean
    }

    class Factura {
        +String numero_factura
        +Date fecha_registro
        +int id_cliente
        +Date fecha_cancelacion
        +String estado
        +int id_vendedor
        +Decimal iva
        +calcularSubtotal() Decimal
        +calcularTotal() Decimal
        +anular()
    }

    class DetalleFactura {
        +String numero_factura
        +int id_producto
        +int cantidad
        +Decimal precio_venta
        +calcularImporte() Decimal
    }

    class OrdenCompra {
        +int id_orden
        +Date fecha_registro
        +int id_proveedor
        +Date fecha_atencion
        +String estado
        +atenderOrden()
    }

    class DetalleOrden {
        +int id_orden
        +int id_producto
        +int cantidad_solicitada
    }

    class Abastecimiento {
        +int id_proveedor
        +int id_producto
        +Decimal precio
    }

    Distrito "1" <-- "N" Cliente
    Distrito "1" <-- "N" Proveedor
    Distrito "1" <-- "N" Vendedor

    Cliente "1" <-- "N" Factura
    Vendedor "1" <-- "N" Factura

    Factura "1" *-- "1..*" DetalleFactura
    Producto "1" <-- "N" DetalleFactura

    Proveedor "1" <-- "N" OrdenCompra
    OrdenCompra "1" *-- "1..*" DetalleOrden
    Producto "1" <-- "N" DetalleOrden

    Proveedor "1" <-- "N" Abastecimiento
    Producto "1" <-- "N" Abastecimiento
```
