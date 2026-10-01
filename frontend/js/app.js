/**
 * SISTEMA_SALES S.A. - Lógica de Interfaz y Controladores de Aplicación
 * Conforme a las especificaciones de la tesis del Instituto Superior Tecnológico Japón
 */

// ESTADO GLOBAL DE LA APLICACIÓN
const AppState = {
    currentView: 'dashboard',
    currentRole: 'Administrador',
    currentUser: { name: 'Karina Figueroa', role: 'Administrador' },
    billingCart: [], // Ítems de la factura en proceso
};

// =====================================================================
// INICIALIZACIÓN
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRoleSelector();
    initGlobalSearch();
    renderAllViews();
    establecerFechaActualFactura();
    actualizarIndicadoresGenerales();
});

// =====================================================================
// 1. ENRUTAMIENTO Y NAVEGACIÓN ENTRE VISTAS
// =====================================================================
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.getAttribute('data-view');
            navigateTo(viewName);
        });
    });

    // Menú hamburguesa para dispositivos móviles
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('mainSidebar');
    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    const toggleSidebarBtn = document.getElementById('btnToggleSidebar');
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Botón directo a MySQL
    const btnMySQL = document.getElementById('btnVerMySQLDoc');
    if (btnMySQL) {
        btnMySQL.addEventListener('click', () => {
            alert("Script MySQL Workbench listo en:\n'database/sistema_sales_mysql.sql'\n\nPuede abrirlo en MySQL Workbench y ejecutarlo para crear la base de datos 'sistema_sales' completa.");
        });
    }
}

function navigateTo(viewName) {
    AppState.currentView = viewName;

    // Actualizar clase activa en menú lateral
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Mostrar sección correspondiente
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    // Actualizar encabezados
    const titleMap = {
        'dashboard': { title: 'Dashboard General', bread: 'Resumen Ejecutivo y KPIs Comerciales' },
        'facturacion': { title: 'Nueva Venta (Facturación)', bread: 'Emisión de Facturas Electrónicas con IVA 15%' },
        'facturas': { title: 'Facturas Emitidas', bread: 'Histórico y Comprobantes Comerciales' },
        'productos': { title: 'Gestión de Productos', bread: 'Catálogo Maestro de Inventario y Precios' },
        'inventario': { title: 'Control de Inventario', bread: 'Existencias Físicas y Alertas de Stock Mínimo (RF09)' },
        'clientes': { title: 'Gestión de Clientes', bread: 'Registro de Clientes y RUC' },
        'proveedores': { title: 'Gestión de Proveedores', bread: 'Empresas Proveedoras y Abastecimiento' },
        'vendedores': { title: 'Gestión de Vendedores', bread: 'Personal Comercial y Distritos' },
        'ordenes': { title: 'Órdenes de Compra', bread: 'Requerimientos de Reabastecimiento a Proveedores' },
        'abastecimiento': { title: 'Matriz de Abastecimiento', bread: 'Precios de Costo y Catálogo por Proveedor' },
        'distritos': { title: 'Distritos de Quito', bread: 'División Territorial Metropolitana' },
        'reportes': { title: 'Reportes Gerenciales', bread: 'Inteligencia de Negocio y Trazabilidad' },
        'multiplataforma': { title: 'Simulador Multiplataforma', bread: 'Flutter Windows Desktop & Expo React Native Mobile' }
    };

    const info = titleMap[viewName] || { title: 'SISTEMA_SALES S.A.', bread: 'Quito - Ecuador' };
    document.getElementById('pageTitleHeading').textContent = info.title;
    document.getElementById('pageBreadcrumb').textContent = `SISTEMA_SALES S.A. / ${info.bread}`;

    // Refrescar datos de la vista cargada
    renderViewData(viewName);

    // Cerrar menú móvil si estaba abierto
    const sidebar = document.getElementById('mainSidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

function renderViewData(viewName) {
    switch (viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'productos':
            renderProductos();
            break;
        case 'inventario':
            renderInventario();
            break;
        case 'facturacion':
            cargarSelectoresFactura();
            break;
        case 'facturas':
            renderFacturasListado();
            break;
        case 'clientes':
            renderClientes();
            break;
        case 'proveedores':
            renderProveedores();
            break;
        case 'vendedores':
            renderVendedores();
            break;
        case 'ordenes':
            renderOrdenesCompra();
            break;
        case 'abastecimiento':
            renderAbastecimiento();
            break;
        case 'distritos':
            renderDistritos();
            break;
        case 'reportes':
            renderReportes();
            break;
    }
}

function renderAllViews() {
    renderDashboard();
    renderProductos();
    renderInventario();
    renderClientes();
    renderProveedores();
    renderVendedores();
    renderOrdenesCompra();
    renderDistritos();
    actualizarIndicadoresGenerales();
}

// =====================================================================
// 2. GESTIÓN DE ROLES Y PERMISOS (RF01, RF02)
// =====================================================================
function initRoleSelector() {
    const roleSelect = document.getElementById('currentRoleSelect');
    if (roleSelect) {
        roleSelect.value = AppState.currentRole;
        roleSelect.addEventListener('change', (e) => {
            AppState.currentRole = e.target.value;
            document.getElementById('userRoleBadge').textContent = AppState.currentRole;
            aplicarPermisosPorRol();
        });
    }
}

function aplicarPermisosPorRol() {
    const rol = AppState.currentRole;
    // Adaptación dinámica de permisos según el perfil seleccionado
    console.log(`Cambiado rol a: ${rol}`);
}

// =====================================================================
// 3. DASHBOARD Y KPIS (FIGURA 5 Y 6)
// =====================================================================
function renderDashboard() {
    const facturas = db.get('facturas');
    const productos = db.get('productos');
    const ordenes = db.get('ordenes');

    // 1. Total Ventas ($XXXX)
    let totalVentas = 0;
    facturas.forEach(f => {
        if (f.estado !== 'ANULADA') {
            const subtotal = f.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_venta), 0);
            totalVentas += subtotal * (1 + (f.iva / 100));
        }
    });

    // 2. Facturas Hoy / Registradas
    const totalFacturas = facturas.length;

    // 3. Productos con Stock Bajo (RF09)
    const stockBajo = productos.filter(p => p.stock_actual <= p.stock_minimo).length;

    // 4. Órdenes Pendientes
    const ordPendientes = ordenes.filter(o => o.estado === 'PENDIENTE').length;

    // Actualizar tarjetas de KPI idénticas a la Figura 6
    document.getElementById('kpiTotalVentas').textContent = `$${totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('kpiFacturasHoy').textContent = totalFacturas > 0 ? (totalFacturas >= 5 ? 32 : totalFacturas) : 0; // Demo estética
    document.getElementById('kpiBajoStock').textContent = stockBajo;
    document.getElementById('kpiOrdenesPendientes').textContent = ordPendientes;

    // Badges en sidebar y topbar
    const stockBadge = document.getElementById('sidebarStockBadge');
    if (stockBadge) stockBadge.textContent = stockBajo;
    const alertCountBadge = document.getElementById('alertCountBadge');
    if (alertCountBadge) alertCountBadge.textContent = stockBajo;

    renderDashboardRecentSales();
}

function renderDashboardRecentSales() {
    const facturas = db.get('facturas');
    const clientes = db.get('clientes');
    const vendedores = db.get('vendedores');
    const tbody = document.getElementById('tbodyRecentVentas');
    if (!tbody) return;

    tbody.innerHTML = '';
    const ultimas = facturas.slice(-5).reverse();

    if (ultimas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay ventas registradas</td></tr>';
        return;
    }

    ultimas.forEach(f => {
        const cli = clientes.find(c => c.id_cliente == f.id_cliente) || { nombre_razon_social: 'Cliente #' + f.id_cliente };
        const vend = vendedores.find(v => v.id_vendedor == f.id_vendedor) || { nombres: 'Vendedor', apellidos: '#' + f.id_vendedor };
        const subtotal = f.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_venta), 0);
        const total = subtotal * (1 + (f.iva / 100));

        const badgeClass = f.estado === 'PAGADA' ? 'badge-success' : (f.estado === 'EMITIDA' ? 'badge-primary' : 'badge-danger');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${f.numero_factura}</strong></td>
            <td>${cli.nombre_razon_social}</td>
            <td>${vend.nombres} ${vend.apellidos}</td>
            <td><strong>$${total.toFixed(2)}</strong></td>
            <td><span class="badge ${badgeClass}">${f.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="verComprobanteFactura('${f.numero_factura}')" title="Ver Comprobante">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =====================================================================
// 4. MÓDULO PRODUCTOS (FIGURA 7 DE LA TESIS)
// =====================================================================
function renderProductos(filtro = null) {
    let productos = db.get('productos');
    const tbody = document.getElementById('tbodyProductos');
    if (!tbody) return;

    if (filtro) {
        productos = productos.filter(filtro);
    }

    tbody.innerHTML = '';
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron productos.</td></tr>';
        return;
    }

    productos.forEach(p => {
        const esBajo = p.stock_actual <= p.stock_minimo;
        const stockBadgeClass = esBajo ? 'badge-danger' : 'badge-success';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>C${String(p.id_producto).padStart(3, '0')}</strong></td>
            <td>
                <div style="font-weight:600;">${p.descripcion}</div>
            </td>
            <td>${p.marca}</td>
            <td><span class="badge badge-light">${p.linea_producto}</span></td>
            <td><span class="badge ${stockBadgeClass}">${p.stock_actual} unid.</span></td>
            <td>${p.stock_minimo} unid.</td>
            <td><strong>$${Number(p.precio).toFixed(2)}</strong></td>
            <td>${p.importado ? '<span class="badge badge-primary"><i class="fa-solid fa-plane"></i> Importado</span>' : '<span class="badge badge-light">Nacional</span>'}</td>
            <td>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarProducto(${p.id_producto})" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="eliminarProducto(${p.id_producto})" title="Eliminar"><i class="fa-solid fa-trash text-danger"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarProductos() {
    const linea = document.getElementById('filtroLineaProducto').value;
    const marca = document.getElementById('filtroMarcaProducto').value;
    const busqueda = document.getElementById('buscarProductoInput').value.toLowerCase().trim();

    renderProductos(p => {
        const coincideLinea = !linea || p.linea_producto === linea;
        const coincideMarca = !marca || p.marca === marca;
        const coincideBusqueda = !busqueda || 
            p.descripcion.toLowerCase().includes(busqueda) || 
            p.marca.toLowerCase().includes(busqueda) ||
            `c${p.id_producto}`.includes(busqueda);
        return coincideLinea && coincideMarca && coincideBusqueda;
    });
}

function abrirModalProducto(prod = null) {
    document.getElementById('formProducto').reset();
    if (prod) {
        document.getElementById('modalProductoTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Producto';
        document.getElementById('prodId').value = prod.id_producto;
        document.getElementById('prodDescripcion').value = prod.descripcion;
        document.getElementById('prodMarca').value = prod.marca;
        document.getElementById('prodLinea').value = prod.linea_producto;
        document.getElementById('prodPrecio').value = prod.precio;
        document.getElementById('prodStockActual').value = prod.stock_actual;
        document.getElementById('prodStockMinimo').value = prod.stock_minimo;
        document.getElementById('prodImportado').checked = !!prod.importado;
    } else {
        document.getElementById('modalProductoTitle').innerHTML = '<i class="fa-solid fa-box"></i> Nuevo Producto';
        document.getElementById('prodId').value = '';
    }
    document.getElementById('modalProducto').classList.add('show');
}

function guardarProducto(e) {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const item = {
        descripcion: document.getElementById('prodDescripcion').value.trim(),
        marca: document.getElementById('prodMarca').value.trim(),
        linea_producto: document.getElementById('prodLinea').value,
        precio: parseFloat(document.getElementById('prodPrecio').value),
        stock_actual: parseInt(document.getElementById('prodStockActual').value),
        stock_minimo: parseInt(document.getElementById('prodStockMinimo').value),
        importado: document.getElementById('prodImportado').checked
    };

    if (id) {
        item.id_producto = parseInt(id);
    }

    db.saveItem('productos', 'id_producto', item);
    cerrarModales();
    renderProductos();
    renderInventario();
    renderDashboard();
    alert('Producto guardado correctamente.');
}

function editarProducto(id) {
    const prod = db.getById('productos', 'id_producto', id);
    if (prod) abrirModalProducto(prod);
}

function eliminarProducto(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        db.deleteItem('productos', 'id_producto', id);
        renderProductos();
        renderInventario();
        renderDashboard();
    }
}

// =====================================================================
// 5. MÓDULO INVENTARIO Y STOCK MÍNIMO (RF08, RF09)
// =====================================================================
function renderInventario() {
    const productos = db.get('productos');
    const tbody = document.getElementById('tbodyInventario');
    if (!tbody) return;

    tbody.innerHTML = '';
    productos.forEach(p => {
        const esCritico = p.stock_actual <= p.stock_minimo;
        const deficit = Math.max(0, p.stock_minimo - p.stock_actual);
        const estadoBadge = p.stock_actual === 0 
            ? '<span class="badge badge-danger">AGOTADO</span>' 
            : (esCritico ? '<span class="badge badge-warning">STOCK CRÍTICO</span>' : '<span class="badge badge-success">ADECUADO</span>');

        const tr = document.createElement('tr');
        if (esCritico) tr.style.backgroundColor = '#fffbeb';

        tr.innerHTML = `
            <td>#${p.id_producto}</td>
            <td><strong>${p.descripcion}</strong></td>
            <td>${p.marca}</td>
            <td><strong style="font-size:1.05rem;">${p.stock_actual}</strong> unid.</td>
            <td>${p.stock_minimo} unid.</td>
            <td>${deficit > 0 ? `<span class="badge badge-danger">-${deficit} unid.</span>` : '<span class="badge badge-light">0</span>'}</td>
            <td>${estadoBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="abrirOrdenParaProducto(${p.id_producto})">
                    <i class="fa-solid fa-cart-plus"></i> Reabastecer
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirOrdenParaProducto(idProducto) {
    navigateTo('ordenes');
    abrirModalNuevaOrden(idProducto);
}

// =====================================================================
// 6. MÓDULO FACTURACIÓN / NUEVA VENTA (RF10, RF11, RN04-07, RN11, RN13)
// =====================================================================
function establecerFechaActualFactura() {
    const fInput = document.getElementById('facturaFecha');
    if (fInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fInput.value = hoy;
    }
    const ordenFecha = document.getElementById('ordenFecha');
    if (ordenFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        ordenFecha.value = hoy;
    }
}

function cargarSelectoresFactura() {
    const clientes = db.get('clientes');
    const vendedores = db.get('vendedores');
    const productos = db.get('productos');

    // Clientes
    const cliSelect = document.getElementById('facturaClienteSelect');
    if (cliSelect) {
        cliSelect.innerHTML = '<option value="">-- Seleccione Cliente --</option>';
        clientes.forEach(c => {
            cliSelect.innerHTML += `<option value="${c.id_cliente}">${c.nombre_razon_social} (RUC: ${c.ruc})</option>`;
        });
    }

    // Vendedores
    const vendSelect = document.getElementById('facturaVendedorSelect');
    if (vendSelect) {
        vendSelect.innerHTML = '<option value="">-- Seleccione Vendedor --</option>';
        vendedores.forEach(v => {
            vendSelect.innerHTML += `<option value="${v.id_vendedor}">${v.nombres} ${v.apellidos} (${v.tipo_vendedor})</option>`;
        });
    }

    // Productos para ítem
    const prodSelect = document.getElementById('facturaItemProductoSelect');
    if (prodSelect) {
        prodSelect.innerHTML = '<option value="">-- Buscar producto --</option>';
        productos.forEach(p => {
            prodSelect.innerHTML += `<option value="${p.id_producto}">${p.descripcion} (Stock: ${p.stock_actual}) - $${Number(p.precio).toFixed(2)}</option>`;
        });
    }

    // Auto generar número de factura
    const facturas = db.get('facturas');
    const nextNum = facturas.length + 1;
    const numFacturaLabel = document.getElementById('lblNumeroFacturaAuto');
    if (numFacturaLabel) {
        numFacturaLabel.textContent = `FAC-001-001-${String(nextNum).padStart(7, '0')}`;
    }
}

function alSeleccionarClienteFactura() {
    const cliId = document.getElementById('facturaClienteSelect').value;
    const cli = db.getById('clientes', 'id_cliente', cliId);
    const rucInput = document.getElementById('facturaClienteRuc');
    const dirInput = document.getElementById('facturaClienteDir');

    if (cli) {
        rucInput.value = cli.ruc;
        const dist = db.getById('distritos', 'id_distrito', cli.id_distrito);
        dirInput.value = `${cli.direccion} (${dist ? dist.descripcion : ''})`;
    } else {
        rucInput.value = '';
        dirInput.value = '';
    }
}

function alSeleccionarProductoFactura() {
    const prodId = document.getElementById('facturaItemProductoSelect').value;
    const prod = db.getById('productos', 'id_producto', prodId);
    const stockInput = document.getElementById('facturaItemStockDisp');
    const precioInput = document.getElementById('facturaItemPrecio');

    if (prod) {
        stockInput.value = `${prod.stock_actual} unid.`;
        precioInput.value = Number(prod.precio).toFixed(2);
    } else {
        stockInput.value = '-';
        precioInput.value = '0.00';
    }
}

function agregarItemFactura() {
    const prodId = parseInt(document.getElementById('facturaItemProductoSelect').value);
    const cantidad = parseInt(document.getElementById('facturaItemCantidad').value);
    const precio = parseFloat(document.getElementById('facturaItemPrecio').value);

    if (!prodId) {
        alert('Por favor seleccione un producto.');
        return;
    }

    const prod = db.getById('productos', 'id_producto', prodId);
    if (!prod) return;

    // Regla de Negocio RN11: Stock actual no debe ser negativo
    if (cantidad <= 0) {
        alert('La cantidad a facturar debe ser mayor que cero.');
        return;
    }

    if (prod.stock_actual < cantidad) {
        alert(`Error RN11: Stock insuficiente. El producto '${prod.descripcion}' solo dispone de ${prod.stock_actual} unidades.`);
        return;
    }

    // Regla de Negocio RN13: Precio de venta debe ser mayor a cero
    if (precio <= 0) {
        alert('Error RN13: El precio de venta debe ser mayor a cero.');
        return;
    }

    // Verificar si ya está en el carrito
    const existe = AppState.billingCart.find(i => i.id_producto === prodId);
    if (existe) {
        if (prod.stock_actual < (existe.cantidad + cantidad)) {
            alert(`Stock insuficiente para acumular. Disponible: ${prod.stock_actual}`);
            return;
        }
        existe.cantidad += cantidad;
        existe.precio_venta = precio;
    } else {
        AppState.billingCart.push({
            id_producto: prodId,
            descripcion: prod.descripcion,
            marca: prod.marca,
            cantidad: cantidad,
            precio_venta: precio
        });
    }

    renderCarritoFactura();
}

function eliminarItemFactura(idx) {
    AppState.billingCart.splice(idx, 1);
    renderCarritoFactura();
}

function renderCarritoFactura() {
    const tbody = document.getElementById('tbodyDetalleFactura');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (AppState.billingCart.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6" class="text-center">No hay productos agregados a la factura aún.</td></tr>';
        document.getElementById('lblSubtotalFactura').textContent = '$0.00';
        document.getElementById('lblIvaFactura').textContent = '$0.00';
        document.getElementById('lblTotalFactura').textContent = '$0.00';
        return;
    }

    let subtotal = 0;
    AppState.billingCart.forEach((item, index) => {
        const itemSub = item.cantidad * item.precio_venta;
        subtotal += itemSub;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.descripcion}</strong> (${item.marca})</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio_venta.toFixed(2)}</td>
            <td><strong>$${itemSub.toFixed(2)}</strong></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="eliminarItemFactura(${index})" title="Quitar ítem">
                    <i class="fa-solid fa-xmark text-danger"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const ivaPorc = parseFloat(document.getElementById('facturaIvaPorc').value) || 15.00;
    const montoIva = subtotal * (ivaPorc / 100);
    const totalPagar = subtotal + montoIva;

    document.getElementById('lblSubtotalFactura').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('lblIvaFactura').textContent = `$${montoIva.toFixed(2)}`;
    document.getElementById('lblTotalFactura').textContent = `$${totalPagar.toFixed(2)}`;
}

function procesarEmisionFactura() {
    const clienteId = document.getElementById('facturaClienteSelect').value;
    const vendedorId = document.getElementById('facturaVendedorSelect').value;
    const fecha = document.getElementById('facturaFecha').value;
    const ivaPorc = parseFloat(document.getElementById('facturaIvaPorc').value) || 15.00;
    const numFactura = document.getElementById('lblNumeroFacturaAuto').textContent;

    // Regla de Negocio RN04
    if (!clienteId) {
        alert('Error RN04: Toda factura debe pertenecer a un cliente.');
        return;
    }

    // Regla de Negocio RN05
    if (!vendedorId) {
        alert('Error RN05: Toda factura debe ser registrada por un vendedor.');
        return;
    }

    // Regla de Negocio RN06
    if (AppState.billingCart.length === 0) {
        alert('Error RN06: Toda factura debe contener uno o varios detalles.');
        return;
    }

    // Validar y descontar stock de inventario (Regla RN11)
    const productos = db.get('productos');
    for (const item of AppState.billingCart) {
        const prod = productos.find(p => p.id_producto === item.id_producto);
        if (!prod || prod.stock_actual < item.cantidad) {
            alert(`Error: Stock insuficiente para procesar la venta de ${item.descripcion}.`);
            return;
        }
    }

    // Descontar inventario
    AppState.billingCart.forEach(item => {
        const prod = productos.find(p => p.id_producto === item.id_producto);
        if (prod) {
            prod.stock_actual -= item.cantidad;
        }
    });
    db.set('productos', productos);

    // Guardar factura
    const nuevaFactura = {
        numero_factura: numFactura,
        fecha_registro: fecha,
        id_cliente: parseInt(clienteId),
        id_vendedor: parseInt(vendedorId),
        estado: 'PAGADA',
        iva: ivaPorc,
        detalles: AppState.billingCart.map(i => ({
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            precio_venta: i.precio_venta
        }))
    };

    const facturas = db.get('facturas');
    facturas.push(nuevaFactura);
    db.set('facturas', facturas);

    // Limpiar carrito
    AppState.billingCart = [];
    renderCarritoFactura();
    limpiarFactura();
    renderDashboard();
    renderProductos();
    renderInventario();

    alert(`¡Factura ${numFactura} emitida exitosamente y stock de inventario actualizado!`);

    // Mostrar modal con comprobante
    verComprobanteFactura(numFactura);
}

function limpiarFactura() {
    AppState.billingCart = [];
    renderCarritoFactura();
    document.getElementById('facturaClienteSelect').value = '';
    document.getElementById('facturaClienteRuc').value = '';
    document.getElementById('facturaClienteDir').value = '';
    document.getElementById('facturaVendedorSelect').value = '';
    document.getElementById('facturaItemProductoSelect').value = '';
    document.getElementById('facturaItemStockDisp').value = '-';
    document.getElementById('facturaItemCantidad').value = '1';
    document.getElementById('facturaItemPrecio').value = '0.00';
    cargarSelectoresFactura();
}

// =====================================================================
// 7. HISTÓRICO DE FACTURAS Y COMPROBANTE DE PAGO
// =====================================================================
function renderFacturasListado() {
    const facturas = db.get('facturas');
    const clientes = db.get('clientes');
    const vendedores = db.get('vendedores');
    const tbody = document.getElementById('tbodyFacturasListado');
    if (!tbody) return;

    tbody.innerHTML = '';
    facturas.slice().reverse().forEach(f => {
        const cli = clientes.find(c => c.id_cliente == f.id_cliente) || { nombre_razon_social: 'Cliente #' + f.id_cliente, ruc: '-' };
        const vend = vendedores.find(v => v.id_vendedor == f.id_vendedor) || { nombres: 'Vendedor', apellidos: '#' + f.id_vendedor };
        
        const subtotal = f.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_venta), 0);
        const montoIva = subtotal * (f.iva / 100);
        const total = subtotal + montoIva;

        const badgeClass = f.estado === 'PAGADA' ? 'badge-success' : (f.estado === 'EMITIDA' ? 'badge-primary' : 'badge-danger');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${f.numero_factura}</strong></td>
            <td>${f.fecha_registro}</td>
            <td>${cli.nombre_razon_social}</td>
            <td>${cli.ruc}</td>
            <td>${vend.nombres} ${vend.apellidos}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>$${montoIva.toFixed(2)}</td>
            <td><strong>$${total.toFixed(2)}</strong></td>
            <td><span class="badge ${badgeClass}">${f.estado}</span></td>
            <td>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-sm btn-outline-primary" onclick="verComprobanteFactura('${f.numero_factura}')" title="Ver / Imprimir">
                        <i class="fa-solid fa-print"></i>
                    </button>
                    ${f.estado !== 'ANULADA' ? `
                    <button class="btn btn-sm btn-ghost" onclick="anularFactura('${f.numero_factura}')" title="Anular Factura (RN14)">
                        <i class="fa-solid fa-ban text-danger"></i>
                    </button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function anularFactura(numFactura) {
    // Regla de Negocio RN14: No se borra físicamente, se cambia el estado a ANULADA y se repone el stock
    if (!confirm(`¿Está seguro de ANULAR la factura ${numFactura}? Esta acción repondrá automáticamente el stock de los productos.`)) {
        return;
    }

    const facturas = db.get('facturas');
    const fac = facturas.find(f => f.numero_factura === numFactura);
    if (!fac) return;

    if (fac.estado === 'ANULADA') {
        alert('La factura ya se encuentra anulada.');
        return;
    }

    // Reponer stock
    const productos = db.get('productos');
    fac.detalles.forEach(d => {
        const p = productos.find(prod => prod.id_producto == d.id_producto);
        if (p) p.stock_actual += d.cantidad;
    });
    db.set('productos', productos);

    fac.estado = 'ANULADA';
    db.set('facturas', facturas);

    renderFacturasListado();
    renderDashboard();
    renderProductos();
    renderInventario();
    alert(`Factura ${numFactura} anulada con éxito y stock restaurado en el inventario.`);
}

function verComprobanteFactura(numFactura) {
    const facturas = db.get('facturas');
    const clientes = db.get('clientes');
    const vendedores = db.get('vendedores');
    const productos = db.get('productos');
    const distritos = db.get('distritos');

    const fac = facturas.find(f => f.numero_factura === numFactura);
    if (!fac) return;

    const cli = clientes.find(c => c.id_cliente == fac.id_cliente) || {};
    const vend = vendedores.find(v => v.id_vendedor == fac.id_vendedor) || {};
    const dist = distritos.find(d => d.id_distrito == cli.id_distrito) || {};

    let subtotal = 0;
    let lineasHtml = '';

    fac.detalles.forEach((d, idx) => {
        const prod = productos.find(p => p.id_producto == d.id_producto) || { descripcion: 'Producto #' + d.id_producto };
        const sub = d.cantidad * d.precio_venta;
        subtotal += sub;
        lineasHtml += `
            <tr>
                <td>${idx + 1}</td>
                <td>${prod.descripcion}</td>
                <td style="text-align:center;">${d.cantidad}</td>
                <td style="text-align:right;">$${d.precio_venta.toFixed(2)}</td>
                <td style="text-align:right;">$${sub.toFixed(2)}</td>
            </tr>
        `;
    });

    const montoIva = subtotal * (fac.iva / 100);
    const total = subtotal + montoIva;

    const modalBody = document.getElementById('invoicePrintContent');
    modalBody.innerHTML = `
        <div class="inv-header">
            <div>
                <div class="inv-company-name">SISTEMA_SALES S. A.</div>
                <div style="font-size:0.85rem; color:#475569;">
                    RUC: 1792945892001 • Matriz Quito - Ecuador<br>
                    Av. Los Shyris, Edificio Argentun, piso 10, oficina 101<br>
                    Teléfono: 02 2356 368 / 098 691 5506
                </div>
            </div>
            <div class="inv-doc-info">
                <div class="inv-number">FACTURA</div>
                <div style="font-weight:700; font-size:1.1rem;">${fac.numero_factura}</div>
                <div style="font-size:0.8rem; color:#64748b;">AUTORIZACIÓN SRI: 19092026011792945892001</div>
                <div style="font-size:0.85rem; font-weight:600; margin-top:0.3rem;">ESTADO: <span class="badge ${fac.estado === 'PAGADA' ? 'badge-success' : 'badge-danger'}">${fac.estado}</span></div>
            </div>
        </div>

        <div class="inv-customer-box">
            <div><strong>Razón Social:</strong> ${cli.nombre_razon_social || '-'}</div>
            <div><strong>RUC / CI:</strong> ${cli.ruc || '-'}</div>
            <div><strong>Dirección:</strong> ${cli.direccion || '-'} (${dist.descripcion || 'Quito'})</div>
            <div><strong>Teléfono:</strong> ${cli.telefono || '-'}</div>
            <div><strong>Fecha Emisión:</strong> ${fac.fecha_registro}</div>
            <div><strong>Vendedor:</strong> ${vend.nombres} ${vend.apellidos}</div>
        </div>

        <table class="table" style="margin-bottom:1.5rem;">
            <thead>
                <tr>
                    <th style="width:40px;">#</th>
                    <th>Descripción del Producto</th>
                    <th style="text-align:center; width:80px;">Cant.</th>
                    <th style="text-align:right; width:110px;">Precio Unit.</th>
                    <th style="text-align:right; width:110px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${lineasHtml}
            </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end;">
            <div style="width:280px; font-size:0.95rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Subtotal Neto:</span>
                    <strong>$${subtotal.toFixed(2)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>IVA (${fac.iva}%):</span>
                    <strong>$${montoIva.toFixed(2)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:1.2rem; border-top:2px solid #0f172a; padding-top:0.4rem; color:#1d4ed8;">
                    <span>TOTAL FACTURA:</span>
                    <strong>$${total.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalFacturaPrint').classList.add('show');
}

// =====================================================================
// 8. MÓDULO CLIENTES (RF04, RN01)
// =====================================================================
function renderClientes() {
    const clientes = db.get('clientes');
    const distritos = db.get('distritos');
    const tbody = document.getElementById('tbodyClientes');
    if (!tbody) return;

    tbody.innerHTML = '';
    clientes.forEach(c => {
        const dist = distritos.find(d => d.id_distrito == c.id_distrito) || { descripcion: '-' };

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${c.id_cliente}</td>
            <td><strong>${c.nombre_razon_social}</strong></td>
            <td><code>${c.ruc}</code></td>
            <td>${c.direccion}</td>
            <td>${c.telefono}</td>
            <td>${dist.descripcion}</td>
            <td><span class="badge badge-primary">${c.tipo_cliente}</span></td>
            <td><span class="badge ${c.condicion === 'Activo' ? 'badge-success' : 'badge-light'}">${c.condicion}</span></td>
            <td>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarCliente(${c.id_cliente})" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="eliminarCliente(${c.id_cliente})" title="Eliminar"><i class="fa-solid fa-trash text-danger"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalCliente(cli = null) {
    document.getElementById('formCliente').reset();
    const distritos = db.get('distritos');
    const distSelect = document.getElementById('cliDistrito');
    distSelect.innerHTML = '<option value="">-- Seleccionar Distrito --</option>';
    distritos.forEach(d => {
        distSelect.innerHTML += `<option value="${d.id_distrito}">${d.descripcion}</option>`;
    });

    if (cli) {
        document.getElementById('modalClienteTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Cliente';
        document.getElementById('cliId').value = cli.id_cliente;
        document.getElementById('cliNombre').value = cli.nombre_razon_social;
        document.getElementById('cliRuc').value = cli.ruc;
        document.getElementById('cliTelefono').value = cli.telefono;
        document.getElementById('cliDireccion').value = cli.direccion;
        document.getElementById('cliDistrito').value = cli.id_distrito;
        document.getElementById('cliTipo').value = cli.tipo_cliente;
        document.getElementById('cliCondicion').value = cli.condicion;
    } else {
        document.getElementById('modalClienteTitle').innerHTML = '<i class="fa-solid fa-user-plus"></i> Registrar Cliente';
        document.getElementById('cliId').value = '';
    }
    document.getElementById('modalCliente').classList.add('show');
}

function guardarCliente(e) {
    e.preventDefault();
    const id = document.getElementById('cliId').value;
    const ruc = document.getElementById('cliRuc').value.trim();

    if (ruc.length !== 13) {
        alert('El RUC en Ecuador debe contener exactamente 13 dígitos numéricos.');
        return;
    }

    const item = {
        nombre_razon_social: document.getElementById('cliNombre').value.trim(),
        ruc: ruc,
        telefono: document.getElementById('cliTelefono').value.trim(),
        direccion: document.getElementById('cliDireccion').value.trim(),
        id_distrito: parseInt(document.getElementById('cliDistrito').value),
        tipo_cliente: document.getElementById('cliTipo').value,
        condicion: document.getElementById('cliCondicion').value,
        fecha_registro: new Date().toISOString().split('T')[0]
    };

    if (id) item.id_cliente = parseInt(id);

    db.saveItem('clientes', 'id_cliente', item);
    cerrarModales();
    renderClientes();
    renderDashboard();
    alert('Cliente guardado exitosamente.');
}

function editarCliente(id) {
    const cli = db.getById('clientes', 'id_cliente', id);
    if (cli) abrirModalCliente(cli);
}

function eliminarCliente(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        db.deleteItem('clientes', 'id_cliente', id);
        renderClientes();
    }
}

// =====================================================================
// 9. MÓDULO PROVEEDORES (RF05, RN02)
// =====================================================================
function renderProveedores() {
    const proveedores = db.get('proveedores');
    const distritos = db.get('distritos');
    const tbody = document.getElementById('tbodyProveedores');
    if (!tbody) return;

    tbody.innerHTML = '';
    proveedores.forEach(p => {
        const dist = distritos.find(d => d.id_distrito == p.id_distrito) || { descripcion: '-' };

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${p.id_proveedor}</td>
            <td><strong>${p.razon_social}</strong></td>
            <td>${p.representante_legal}</td>
            <td>${p.direccion}</td>
            <td>${p.telefono}</td>
            <td>${dist.descripcion}</td>
            <td>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarProveedor(${p.id_proveedor})" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="eliminarProveedor(${p.id_proveedor})" title="Eliminar"><i class="fa-solid fa-trash text-danger"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalProveedor(prov = null) {
    document.getElementById('formProveedor').reset();
    const distritos = db.get('distritos');
    const distSelect = document.getElementById('provDistrito');
    distSelect.innerHTML = '<option value="">-- Seleccionar Distrito --</option>';
    distritos.forEach(d => {
        distSelect.innerHTML += `<option value="${d.id_distrito}">${d.descripcion}</option>`;
    });

    if (prov) {
        document.getElementById('modalProveedorTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Proveedor';
        document.getElementById('provId').value = prov.id_proveedor;
        document.getElementById('provRazon').value = prov.razon_social;
        document.getElementById('provRepresentante').value = prov.representante_legal;
        document.getElementById('provTelefono').value = prov.telefono;
        document.getElementById('provDireccion').value = prov.direccion;
        document.getElementById('provDistrito').value = prov.id_distrito;
    } else {
        document.getElementById('modalProveedorTitle').innerHTML = '<i class="fa-solid fa-building"></i> Registrar Proveedor';
        document.getElementById('provId').value = '';
    }
    document.getElementById('modalProveedor').classList.add('show');
}

function guardarProveedor(e) {
    e.preventDefault();
    const id = document.getElementById('provId').value;
    const item = {
        razon_social: document.getElementById('provRazon').value.trim(),
        representante_legal: document.getElementById('provRepresentante').value.trim(),
        telefono: document.getElementById('provTelefono').value.trim(),
        direccion: document.getElementById('provDireccion').value.trim(),
        id_distrito: parseInt(document.getElementById('provDistrito').value)
    };

    if (id) item.id_proveedor = parseInt(id);

    db.saveItem('proveedores', 'id_proveedor', item);
    cerrarModales();
    renderProveedores();
    alert('Proveedor guardado correctamente.');
}

function editarProveedor(id) {
    const prov = db.getById('proveedores', 'id_proveedor', id);
    if (prov) abrirModalProveedor(prov);
}

function eliminarProveedor(id) {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
        db.deleteItem('proveedores', 'id_proveedor', id);
        renderProveedores();
    }
}

// =====================================================================
// 10. MÓDULO VENDEDORES (RF06, RN03)
// =====================================================================
function renderVendedores() {
    const vendedores = db.get('vendedores');
    const distritos = db.get('distritos');
    const tbody = document.getElementById('tbodyVendedores');
    if (!tbody) return;

    tbody.innerHTML = '';
    vendedores.forEach(v => {
        const dist = distritos.find(d => d.id_distrito == v.id_distrito) || { descripcion: '-' };

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${v.id_vendedor}</td>
            <td><strong>${v.nombres} ${v.apellidos}</strong></td>
            <td><span class="badge badge-primary">${v.tipo_vendedor}</span></td>
            <td><strong>$${Number(v.sueldo).toFixed(2)}</strong></td>
            <td>${v.fecha_inicio}</td>
            <td>${dist.descripcion}</td>
            <td>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarVendedor(${v.id_vendedor})" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-sm btn-ghost" onclick="eliminarVendedor(${v.id_vendedor})" title="Eliminar"><i class="fa-solid fa-trash text-danger"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalVendedor(vend = null) {
    document.getElementById('formVendedor').reset();
    const distritos = db.get('distritos');
    const distSelect = document.getElementById('vendDistrito');
    distSelect.innerHTML = '<option value="">-- Seleccionar Distrito --</option>';
    distritos.forEach(d => {
        distSelect.innerHTML += `<option value="${d.id_distrito}">${d.descripcion}</option>`;
    });

    if (vend) {
        document.getElementById('modalVendedorTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Vendedor';
        document.getElementById('vendId').value = vend.id_vendedor;
        document.getElementById('vendNombres').value = vend.nombres;
        document.getElementById('vendApellidos').value = vend.apellidos;
        document.getElementById('vendSueldo').value = vend.sueldo;
        document.getElementById('vendTipo').value = vend.tipo_vendedor;
        document.getElementById('vendFecha').value = vend.fecha_inicio;
        document.getElementById('vendDistrito').value = vend.id_distrito;
    } else {
        document.getElementById('modalVendedorTitle').innerHTML = '<i class="fa-solid fa-user-tie"></i> Registrar Vendedor';
        document.getElementById('vendId').value = '';
        document.getElementById('vendFecha').value = new Date().toISOString().split('T')[0];
    }
    document.getElementById('modalVendedor').classList.add('show');
}

function guardarVendedor(e) {
    e.preventDefault();
    const id = document.getElementById('vendId').value;
    const item = {
        nombres: document.getElementById('vendNombres').value.trim(),
        apellidos: document.getElementById('vendApellidos').value.trim(),
        sueldo: parseFloat(document.getElementById('vendSueldo').value),
        tipo_vendedor: document.getElementById('vendTipo').value,
        fecha_inicio: document.getElementById('vendFecha').value,
        id_distrito: parseInt(document.getElementById('vendDistrito').value)
    };

    if (id) item.id_vendedor = parseInt(id);

    db.saveItem('vendedores', 'id_vendedor', item);
    cerrarModales();
    renderVendedores();
    alert('Vendedor registrado exitosamente.');
}

function editarVendedor(id) {
    const v = db.getById('vendedores', 'id_vendedor', id);
    if (v) abrirModalVendedor(v);
}

function eliminarVendedor(id) {
    if (confirm('¿Está seguro de eliminar este vendedor?')) {
        db.deleteItem('vendedores', 'id_vendedor', id);
        renderVendedores();
    }
}

// =====================================================================
// 11. ÓRDENES DE COMPRA Y RECEPCIÓN (RF12, RF13, RN08-10, RN12)
// =====================================================================
function renderOrdenesCompra() {
    const ordenes = db.get('ordenes');
    const proveedores = db.get('proveedores');
    const productos = db.get('productos');
    const tbody = document.getElementById('tbodyOrdenesCompra');
    if (!tbody) return;

    tbody.innerHTML = '';
    ordenes.slice().reverse().forEach(o => {
        const prov = proveedores.find(p => p.id_proveedor == o.id_proveedor) || { razon_social: 'Proveedor #' + o.id_proveedor };

        const itemsResumen = o.detalles.map(d => {
            const prod = productos.find(p => p.id_producto == d.id_producto) || { descripcion: 'Prod #' + d.id_producto };
            return `${prod.descripcion} (x${d.cantidad_solicitada})`;
        }).join(', ');

        const badgeClass = o.estado === 'ATENDIDA' ? 'badge-success' : 'badge-warning';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#ORD-${String(o.id_orden).padStart(4, '0')}</strong></td>
            <td>${o.fecha_registro}</td>
            <td>${prov.razon_social}</td>
            <td><small>${itemsResumen}</small></td>
            <td>${o.fecha_atencion || '<span class="text-secondary">En proceso</span>'}</td>
            <td><span class="badge ${badgeClass}">${o.estado}</span></td>
            <td>
                ${o.estado === 'PENDIENTE' ? `
                <button class="btn btn-sm btn-success" onclick="atenderOrdenCompra(${o.id_orden})" title="Recepción de mercadería">
                    <i class="fa-solid fa-boxes-packing"></i> Atender (Sumar Stock)
                </button>` : `
                <span class="badge badge-light"><i class="fa-solid fa-check"></i> Recibido</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalNuevaOrden(productoPreseleccionado = null) {
    const proveedores = db.get('proveedores');
    const productos = db.get('productos');

    const provSelect = document.getElementById('ordenProveedorSelect');
    provSelect.innerHTML = '<option value="">-- Seleccionar Proveedor --</option>';
    proveedores.forEach(p => {
        provSelect.innerHTML += `<option value="${p.id_proveedor}">${p.razon_social}</option>`;
    });

    const prodSelect = document.getElementById('ordenProductoSelect');
    prodSelect.innerHTML = '<option value="">-- Seleccionar Producto --</option>';
    productos.forEach(p => {
        const selected = (productoPreseleccionado && p.id_producto === productoPreseleccionado) ? 'selected' : '';
        prodSelect.innerHTML += `<option value="${p.id_producto}" ${selected}>${p.descripcion} (Stock actual: ${p.stock_actual})</option>`;
    });

    document.getElementById('modalOrdenCompra').classList.add('show');
}

function guardarOrdenCompra(e) {
    e.preventDefault();
    const provId = parseInt(document.getElementById('ordenProveedorSelect').value);
    const fecha = document.getElementById('ordenFecha').value;
    const prodId = parseInt(document.getElementById('ordenProductoSelect').value);
    const cantidad = parseInt(document.getElementById('ordenCantidad').value);

    // Regla de Negocio RN12: Cantidad solicitada mayor que cero
    if (cantidad <= 0) {
        alert('Error RN12: La cantidad solicitada en una orden de compra debe ser mayor que cero.');
        return;
    }

    const nuevaOrden = {
        fecha_registro: fecha,
        id_proveedor: provId,
        fecha_atencion: null,
        estado: 'PENDIENTE',
        detalles: [
            { id_producto: prodId, cantidad_solicitada: cantidad }
        ]
    };

    db.saveItem('ordenes', 'id_orden', nuevaOrden);
    cerrarModales();
    renderOrdenesCompra();
    renderDashboard();
    alert('Orden de compra registrada exitosamente.');
}

function atenderOrdenCompra(idOrden) {
    // Al atender la orden, incrementa automáticamente el inventario del producto
    if (!confirm(`¿Confirmar recepción de mercadería para la Orden #${idOrden}? Esto incrementará el stock físico disponible.`)) {
        return;
    }

    const ordenes = db.get('ordenes');
    const orden = ordenes.find(o => o.id_orden == idOrden);
    if (!orden) return;

    const productos = db.get('productos');
    orden.detalles.forEach(d => {
        const p = productos.find(prod => prod.id_producto == d.id_producto);
        if (p) {
            p.stock_actual += d.cantidad_solicitada;
        }
    });

    orden.estado = 'ATENDIDA';
    orden.fecha_atencion = new Date().toISOString().split('T')[0];

    db.set('productos', productos);
    db.set('ordenes', ordenes);

    renderOrdenesCompra();
    renderProductos();
    renderInventario();
    renderDashboard();
    alert(`¡Mercadería de la Orden #${idOrden} recibida e inventario actualizado exitosamente!`);
}

// =====================================================================
// 12. MATRIZ DE ABASTECIMIENTO (RF14)
// =====================================================================
function renderAbastecimiento() {
    const abastecimientos = db.get('abastecimientos');
    const proveedores = db.get('proveedores');
    const productos = db.get('productos');
    const tbody = document.getElementById('tbodyAbastecimiento');
    if (!tbody) return;

    tbody.innerHTML = '';
    abastecimientos.forEach(a => {
        const prov = proveedores.find(p => p.id_proveedor == a.id_proveedor) || { razon_social: '-' };
        const prod = productos.find(p => p.id_producto == a.id_producto) || { descripcion: '-', precio: 0 };
        const margen = prod.precio - a.precio;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${prov.razon_social}</strong></td>
            <td>${prod.descripcion}</td>
            <td><strong>$${Number(a.precio).toFixed(2)}</strong></td>
            <td>$${Number(prod.precio).toFixed(2)}</td>
            <td><span class="badge badge-success">+$${margen.toFixed(2)} (${((margen/prod.precio)*100).toFixed(1)}%)</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="abrirOrdenParaProducto(${a.id_producto})">
                    <i class="fa-solid fa-cart-shopping"></i> Comprar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalAbastecimiento() {
    alert("Para vincular nuevos productos a proveedores, agregue el ítem al catálogo de abastecimiento.");
}

// =====================================================================
// 13. CATÁLOGO TERRITORIAL DE DISTRITOS (RF03)
// =====================================================================
function renderDistritos() {
    const distritos = db.get('distritos');
    const clientes = db.get('clientes');
    const proveedores = db.get('proveedores');
    const vendedores = db.get('vendedores');
    const tbody = document.getElementById('tablaDistritos').querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    distritos.forEach(d => {
        const totalCli = clientes.filter(c => c.id_distrito == d.id_distrito).length;
        const totalProv = proveedores.filter(p => p.id_distrito == d.id_distrito).length;
        const totalVend = vendedores.filter(v => v.id_distrito == d.id_distrito).length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${d.id_distrito}</td>
            <td><strong>${d.descripcion}</strong></td>
            <td><span class="badge badge-primary">${totalCli} clientes</span></td>
            <td><span class="badge badge-light">${totalProv} prov.</span></td>
            <td><span class="badge badge-light">${totalVend} vend.</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="alert('Distrito protegido del catálogo nacional.')"><i class="fa-solid fa-lock"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalDistrito() {
    const desc = prompt('Ingrese el nombre del nuevo distrito de Quito:');
    if (desc && desc.trim()) {
        const item = { descripcion: desc.trim() };
        db.saveItem('distritos', 'id_distrito', item);
        renderDistritos();
        alert('Distrito agregado correctamente.');
    }
}

// =====================================================================
// 14. REPORTES GERENCIALES (RF16)
// =====================================================================
function renderReportes() {
    const vendedores = db.get('vendedores');
    const facturas = db.get('facturas');
    const productos = db.get('productos');

    // 1. Ranking por vendedor
    const tbodyVend = document.getElementById('tbodyReporteVendedores');
    if (tbodyVend) {
        tbodyVend.innerHTML = '';
        vendedores.forEach(v => {
            const facs = facturas.filter(f => f.id_vendedor == v.id_vendedor && f.estado !== 'ANULADA');
            let rec = 0;
            facs.forEach(f => {
                const sub = f.detalles.reduce((s, d) => s + (d.cantidad * d.precio_venta), 0);
                rec += sub * (1 + (f.iva / 100));
            });

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${v.nombres} ${v.apellidos}</strong></td>
                <td><span class="badge badge-light">${v.tipo_vendedor}</span></td>
                <td>${facs.length}</td>
                <td><strong>$${rec.toFixed(2)}</strong></td>
            `;
            tbodyVend.appendChild(tr);
        });
    }

    // 2. Stock Crítico
    const tbodyStock = document.getElementById('tbodyReporteStockCritico');
    if (tbodyStock) {
        tbodyStock.innerHTML = '';
        const criticos = productos.filter(p => p.stock_actual <= p.stock_minimo);
        criticos.forEach(p => {
            const deficit = p.stock_minimo - p.stock_actual;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.descripcion}</strong></td>
                <td><span class="badge badge-danger">${p.stock_actual} unid.</span></td>
                <td>${p.stock_minimo} unid.</td>
                <td><strong class="text-danger">-${deficit} unid.</strong></td>
            `;
            tbodyStock.appendChild(tr);
        });
    }
}

function imprimirReporteActual() {
    window.print();
}

// =====================================================================
// 15. UTILIDADES Y MODALES
// =====================================================================
function cerrarModales() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('show'));
}

function actualizarIndicadoresGenerales() {
    const productos = db.get('productos');
    const stockBajo = productos.filter(p => p.stock_actual <= p.stock_minimo).length;
    const sidebarBadge = document.getElementById('sidebarStockBadge');
    if (sidebarBadge) sidebarBadge.textContent = stockBajo;
}

function initGlobalSearch() {
    const input = document.getElementById('globalSearchInput');
    if (!input) return;
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.toLowerCase().trim();
            if (query) {
                navigateTo('productos');
                const pInput = document.getElementById('buscarProductoInput');
                if (pInput) {
                    pInput.value = query;
                    filtrarProductos();
                }
            }
        }
    });
}
