/**
 * SISTEMA_SALES S.A. - Capa de Conexión de Datos (API + Storage Fallback)
 * Permite trabajar conectado a Django REST API o autónomamente en navegador
 */

const API_BASE = 'http://127.0.0.1:8000/api';

// Semillas iniciales equivalentes al script de MySQL Workbench
const INITIAL_DATA = {
    distritos: [
        { id_distrito: 1, descripcion: 'Iñaquito (Norte Financiero)' },
        { id_distrito: 2, descripcion: 'La Mariscal (Centro Norte)' },
        { id_distrito: 3, descripcion: 'Centro Histórico' },
        { id_distrito: 4, descripcion: 'Cotocollao (Norte)' },
        { id_distrito: 5, descripcion: 'Calderón (Extremo Norte)' },
        { id_distrito: 6, descripcion: 'Cumbayá (Valles)' },
        { id_distrito: 7, descripcion: 'Tumbaco (Valles)' },
        { id_distrito: 8, descripcion: 'Chillogallo (Sur)' },
        { id_distrito: 9, descripcion: 'La Magdalena (Sur)' }
    ],
    clientes: [
        { id_cliente: 1, nombre_razon_social: 'Corporación Favorita C.A.', direccion: 'Av. General Enríquez km 3.5', telefono: '022998800', ruc: '1790016919001', fecha_registro: '2026-01-10', tipo_cliente: 'Corporativo', condicion: 'Activo', id_distrito: 1 },
        { id_cliente: 2, nombre_razon_social: 'Distribuidora Pichincha S.A.', direccion: 'Av. 10 de Agosto N24-15', telefono: '022543210', ruc: '1791234567001', fecha_registro: '2026-01-15', tipo_cliente: 'Mayorista', condicion: 'Activo', id_distrito: 2 },
        { id_cliente: 3, nombre_razon_social: 'Comercializadora El Cóndor', direccion: 'Calle Guayaquil N4-22', telefono: '022887766', ruc: '1714567890001', fecha_registro: '2026-02-01', tipo_cliente: 'Minorista', condicion: 'Activo', id_distrito: 3 },
        { id_cliente: 4, nombre_razon_social: 'Sistemas y Redes Andinos Cía.', direccion: 'Av. Prensa N55-12 y Florida', telefono: '022445566', ruc: '1792345678001', fecha_registro: '2026-02-12', tipo_cliente: 'Corporativo', condicion: 'Activo', id_distrito: 4 },
        { id_cliente: 5, nombre_razon_social: 'TecnoQuito Soluciones C.A.', direccion: 'Av. Carapungo 452 y Panamericana', telefono: '022822119', ruc: '1793456789001', fecha_registro: '2026-03-01', tipo_cliente: 'Mayorista', condicion: 'Activo', id_distrito: 5 },
        { id_cliente: 6, nombre_razon_social: 'Juan Carlos Mendoza Loor', direccion: 'Vía Interoceánica km 7.5', telefono: '0998765432', ruc: '1718901234001', fecha_registro: '2026-03-10', tipo_cliente: 'Final', condicion: 'Activo', id_distrito: 6 }
    ],
    proveedores: [
        { id_proveedor: 1, razon_social: 'Mayorista Tecnológico del Ecuador S.A.', direccion: 'Av. Galo Plaza Lasso N60-12', telefono: '022478900', representante_legal: 'Ing. Carlos Albuja', id_distrito: 4 },
        { id_proveedor: 2, razon_social: 'Importadora Global Tech Cía. Ltda.', direccion: 'Av. Eloy Alfaro N34-110', telefono: '022245600', representante_legal: 'Msc. Diana Benavides', id_distrito: 1 },
        { id_proveedor: 3, razon_social: 'CompuDistribuciones Andinas S.A.', direccion: 'Av. América N18-35', telefono: '022521144', representante_legal: 'Lic. Roberto Vaca', id_distrito: 2 },
        { id_proveedor: 4, razon_social: 'Soluciones y Partes Informáticas S.A.', direccion: 'Av. Pedro Vicente Maldonado S30-10', telefono: '022671199', representante_legal: 'Ing. Patricia Solís', id_distrito: 8 }
    ],
    vendedores: [
        { id_vendedor: 1, nombres: 'Karina Violeta', apellidos: 'Figueroa Vergara', sueldo: 1250.00, fecha_inicio: '2025-06-01', tipo_vendedor: 'Senior', id_distrito: 1 },
        { id_vendedor: 2, nombres: 'Esteban Fernando', apellidos: 'Gómez Játiva', sueldo: 950.00, fecha_inicio: '2025-08-15', tipo_vendedor: 'Planta', id_distrito: 2 },
        { id_vendedor: 3, nombres: 'Andrea Patricia', apellidos: 'Morales Silva', sueldo: 850.00, fecha_inicio: '2025-10-01', tipo_vendedor: 'Comisionista', id_distrito: 6 },
        { id_vendedor: 4, nombres: 'Mateo Sebastián', apellidos: 'Castillo Rueda', sueldo: 750.00, fecha_inicio: '2026-01-10', tipo_vendedor: 'Junior', id_distrito: 4 }
    ],
    productos: [
        { id_producto: 1, descripcion: 'Laptop Dell Latitude 3440 Core i7 16GB 512GB SSD', precio: 850.00, stock_actual: 24, stock_minimo: 6, marca: 'Dell', linea_producto: 'Laptops y Portátiles', importado: true },
        { id_producto: 2, descripcion: 'Laptop Lenovo ThinkPad E14 Ryzen 7 16GB 512GB SSD', precio: 790.00, stock_actual: 18, stock_minimo: 5, marca: 'Lenovo', linea_producto: 'Laptops y Portátiles', importado: true },
        { id_producto: 3, descripcion: 'Monitor HP ProDisplay P24v G5 24 pulgadas FHD 75Hz', precio: 145.00, stock_actual: 32, stock_minimo: 8, marca: 'HP', linea_producto: 'Monitores y Pantallas', importado: true },
        { id_producto: 4, descripcion: 'Impresora Multifunción Epson EcoTank L3250 WiFi', precio: 215.00, stock_actual: 15, stock_minimo: 5, marca: 'Epson', linea_producto: 'Impresión y Digitalización', importado: true },
        { id_producto: 5, descripcion: 'Teclado y Ratón Inalámbrico Logitech MK270', precio: 32.50, stock_actual: 45, stock_minimo: 12, marca: 'Logitech', linea_producto: 'Periféricos y Accesorios', importado: true },
        { id_producto: 6, descripcion: 'Disco Sólido Kingston NV2 1TB NVMe PCIe 4.0', precio: 78.00, stock_actual: 8, stock_minimo: 10, marca: 'Kingston', linea_producto: 'Almacenamiento', importado: true },
        { id_producto: 7, descripcion: 'Router Inalámbrico TP-Link Archer AX12 Wi-Fi 6', precio: 58.00, stock_actual: 4, stock_minimo: 8, marca: 'TP-Link', linea_producto: 'Redes y Conectividad', importado: true },
        { id_producto: 8, descripcion: 'Memoria RAM Corsair Vengeance LPX 16GB DDR4 3200MHz', precio: 48.00, stock_actual: 5, stock_minimo: 8, marca: 'Corsair', linea_producto: 'Componentes y Partes', importado: true },
        { id_producto: 9, descripcion: 'Cable de Red Patch Cord Cat6 UTP 3 Metros Gris', precio: 4.50, stock_actual: 85, stock_minimo: 20, marca: 'Panduit', linea_producto: 'Redes y Conectividad', importado: false },
        { id_producto: 10, descripcion: 'Regulador de Voltaje Forza FVR-1211USB 1200VA/600W', precio: 26.00, stock_actual: 3, stock_minimo: 6, marca: 'Forza', linea_producto: 'Energía y Protección', importado: true }
    ],
    abastecimientos: [
        { id_proveedor: 1, id_producto: 1, precio: 680.00 },
        { id_proveedor: 1, id_producto: 2, precio: 630.00 },
        { id_proveedor: 1, id_producto: 3, precio: 115.00 },
        { id_proveedor: 2, id_producto: 4, precio: 172.00 },
        { id_proveedor: 2, id_producto: 5, precio: 23.50 },
        { id_proveedor: 3, id_producto: 6, precio: 59.00 },
        { id_proveedor: 3, id_producto: 7, precio: 42.00 },
        { id_proveedor: 3, id_producto: 8, precio: 36.00 },
        { id_proveedor: 4, id_producto: 9, precio: 2.20 },
        { id_proveedor: 4, id_producto: 10, precio: 18.50 }
    ],
    ordenes: [
        { id_orden: 1, fecha_registro: '2026-03-01', id_proveedor: 1, fecha_atencion: '2026-03-04', estado: 'ATENDIDA', detalles: [{ id_producto: 1, cantidad_solicitada: 10 }, { id_producto: 2, cantidad_solicitada: 8 }] },
        { id_orden: 2, fecha_registro: '2026-03-10', id_proveedor: 2, fecha_atencion: '2026-03-13', estado: 'ATENDIDA', detalles: [{ id_producto: 4, cantidad_solicitada: 12 }, { id_producto: 5, cantidad_solicitada: 25 }] },
        { id_orden: 3, fecha_registro: '2026-03-20', id_proveedor: 3, fecha_atencion: null, estado: 'PENDIENTE', detalles: [{ id_producto: 6, cantidad_solicitada: 15 }, { id_producto: 7, cantidad_solicitada: 20 }] },
        { id_orden: 4, fecha_registro: '2026-03-25', id_proveedor: 4, fecha_atencion: null, estado: 'PENDIENTE', detalles: [{ id_producto: 8, cantidad_solicitada: 15 }, { id_producto: 10, cantidad_solicitada: 10 }] }
    ],
    facturas: [
        {
            numero_factura: 'FAC-001-001-0000001',
            fecha_registro: '2026-03-05',
            id_cliente: 1,
            id_vendedor: 1,
            estado: 'PAGADA',
            iva: 15.00,
            detalles: [
                { id_producto: 1, cantidad: 3, precio_venta: 850.00 },
                { id_producto: 3, cantidad: 5, precio_venta: 145.00 },
                { id_producto: 5, cantidad: 6, precio_venta: 32.50 }
            ]
        },
        {
            numero_factura: 'FAC-001-001-0000002',
            fecha_registro: '2026-03-08',
            id_cliente: 2,
            id_vendedor: 2,
            estado: 'PAGADA',
            iva: 15.00,
            detalles: [
                { id_producto: 2, cantidad: 2, precio_venta: 790.00 },
                { id_producto: 4, cantidad: 3, precio_venta: 215.00 }
            ]
        },
        {
            numero_factura: 'FAC-001-001-0000003',
            fecha_registro: '2026-03-15',
            id_cliente: 3,
            id_vendedor: 1,
            estado: 'PAGADA',
            iva: 15.00,
            detalles: [
                { id_producto: 5, cantidad: 10, precio_venta: 32.50 },
                { id_producto: 6, cantidad: 2, precio_venta: 78.00 }
            ]
        },
        {
            numero_factura: 'FAC-001-001-0000004',
            fecha_registro: '2026-03-22',
            id_cliente: 4,
            id_vendedor: 3,
            estado: 'PAGADA',
            iva: 15.00,
            detalles: [
                { id_producto: 1, cantidad: 2, precio_venta: 850.00 },
                { id_producto: 7, cantidad: 4, precio_venta: 58.00 }
            ]
        },
        {
            numero_factura: 'FAC-001-001-0000005',
            fecha_registro: '2026-03-28',
            id_cliente: 5,
            id_vendedor: 4,
            estado: 'EMITIDA',
            iva: 15.00,
            detalles: [
                { id_producto: 3, cantidad: 2, precio_venta: 145.00 }
            ]
        }
    ]
};

class DataService {
    constructor() {
        this.backendAvailable = false;
        this.initLocalStore();
        this.checkBackendConnection();
    }

    initLocalStore() {
        if (!localStorage.getItem('sistema_sales_initialized')) {
            localStorage.setItem('distritos', JSON.stringify(INITIAL_DATA.distritos));
            localStorage.setItem('clientes', JSON.stringify(INITIAL_DATA.clientes));
            localStorage.setItem('proveedores', JSON.stringify(INITIAL_DATA.proveedores));
            localStorage.setItem('vendedores', JSON.stringify(INITIAL_DATA.vendedores));
            localStorage.setItem('productos', JSON.stringify(INITIAL_DATA.productos));
            localStorage.setItem('abastecimientos', JSON.stringify(INITIAL_DATA.abastecimientos));
            localStorage.setItem('ordenes', JSON.stringify(INITIAL_DATA.ordenes));
            localStorage.setItem('facturas', JSON.stringify(INITIAL_DATA.facturas));
            localStorage.setItem('sistema_sales_initialized', 'true');
        }
    }

    async checkBackendConnection() {
        try {
            const res = await fetch(`${API_BASE}/distritos/`, { method: 'GET', headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                this.backendAvailable = true;
                const statusDot = document.querySelector('.status-dot');
                const statusText = document.getElementById('statusText');
                if (statusDot) statusDot.style.background = '#10b981';
                if (statusText) statusText.textContent = 'Conectado a Django & MySQL';
            }
        } catch (e) {
            this.backendAvailable = false;
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.getElementById('statusText');
            if (statusDot) statusDot.style.background = '#3b82f6';
            if (statusText) statusText.textContent = 'Modo Local / Simulado';
        }
    }

    // CRUD GENÉRICO
    get(entity) {
        return JSON.parse(localStorage.getItem(entity) || '[]');
    }

    set(entity, data) {
        localStorage.setItem(entity, JSON.stringify(data));
    }

    getById(entity, idKey, idVal) {
        const list = this.get(entity);
        return list.find(item => item[idKey] == idVal);
    }

    saveItem(entity, idKey, item) {
        const list = this.get(entity);
        if (item[idKey]) {
            const index = list.findIndex(i => i[idKey] == item[idKey]);
            if (index !== -1) {
                list[index] = item;
            } else {
                list.push(item);
            }
        } else {
            const maxId = list.reduce((max, i) => Math.max(max, parseInt(i[idKey]) || 0), 0);
            item[idKey] = maxId + 1;
            list.push(item);
        }
        this.set(entity, list);
        return item;
    }

    deleteItem(entity, idKey, idVal) {
        let list = this.get(entity);
        list = list.filter(i => i[idKey] != idVal);
        this.set(entity, list);
    }
}

const db = new DataService();
