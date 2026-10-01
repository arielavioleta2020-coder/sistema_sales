// SISTEMA_SALES S.A. - React API & Storage Service
// Figura 9: src/services/api.js

const INITIAL_DATA = {
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
  clientes: [
    { id_cliente: 1, nombre_razon_social: 'Corporación Favorita C.A.', direccion: 'Av. General Enríquez km 3.5', telefono: '022998800', ruc: '1790016919001', tipo_cliente: 'Corporativo', condicion: 'Activo', id_distrito: 1 },
    { id_cliente: 2, nombre_razon_social: 'Distribuidora Pichincha S.A.', direccion: 'Av. 10 de Agosto N24-15', telefono: '022543210', ruc: '1791234567001', tipo_cliente: 'Mayorista', condicion: 'Activo', id_distrito: 2 },
    { id_cliente: 3, nombre_razon_social: 'Comercializadora El Cóndor', direccion: 'Calle Guayaquil N4-22', telefono: '022887766', ruc: '1714567890001', tipo_cliente: 'Minorista', condicion: 'Activo', id_distrito: 3 }
  ],
  vendedores: [
    { id_vendedor: 1, nombres: 'Karina Violeta', apellidos: 'Figueroa Vergara', sueldo: 1250.00, tipo_vendedor: 'Senior', id_distrito: 1 },
    { id_vendedor: 2, nombres: 'Esteban Fernando', apellidos: 'Gómez Játiva', sueldo: 950.00, tipo_vendedor: 'Planta', id_distrito: 2 }
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
        { id_producto: 3, cantidad: 5, precio_venta: 145.00 }
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
        { id_producto: 2, cantidad: 2, precio_venta: 790.00 }
      ]
    }
  ]
};

export const getStorageData = (key) => {
  const data = localStorage.getItem(`sales_${key}`);
  if (!data && INITIAL_DATA[key]) {
    localStorage.setItem(`sales_${key}`, JSON.stringify(INITIAL_DATA[key]));
    return INITIAL_DATA[key];
  }
  return data ? JSON.parse(data) : [];
};

export const setStorageData = (key, data) => {
  localStorage.setItem(`sales_${key}`, JSON.stringify(data));
};
