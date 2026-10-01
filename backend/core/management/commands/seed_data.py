from django.core.management.base import BaseCommand
from datetime import date
from decimal import Decimal
from core.models import (
    Distrito, Cliente, Proveedor, Vendedor, Producto,
    Factura, DetalleFactura, OrdenCompra, DetalleOrden,
    Abastecimiento, UsuarioSistema
)

class Command(BaseCommand):
    help = 'Carga datos de prueba realistas para SISTEMA_SALES S.A. en Quito, Ecuador'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Iniciando carga de datos de prueba...'))

        # 1. Distritos
        distritos_data = [
            (1, 'Iñaquito (Norte Financiero)'),
            (2, 'La Mariscal (Centro Norte)'),
            (3, 'Centro Histórico'),
            (4, 'Cotocollao (Norte)'),
            (5, 'Calderón (Extremo Norte)'),
            (6, 'Cumbayá (Valles)'),
            (7, 'Tumbaco (Valles)'),
            (8, 'Chillogallo (Sur)'),
            (9, 'La Magdalena (Sur)'),
        ]
        dist_map = {}
        for did, desc in distritos_data:
            obj, _ = Distrito.objects.get_or_create(id_distrito=did, defaults={'descripcion': desc})
            dist_map[did] = obj

        # 2. Clientes
        clientes_data = [
            (1, 'Corporación Favorita C.A.', 'Av. General Enríquez km 3.5', '022998800', '1790016919001', date(2026, 1, 10), 'Corporativo', 'Activo', 1),
            (2, 'Distribuidora Pichincha S.A.', 'Av. 10 de Agosto N24-15', '022543210', '1791234567001', date(2026, 1, 15), 'Mayorista', 'Activo', 2),
            (3, 'Comercializadora El Condor', 'Calle Guayaquil N4-22', '022887766', '1714567890001', date(2026, 2, 1), 'Minorista', 'Activo', 3),
            (4, 'Sistemas y Redes Andinos Cía.', 'Av. Prensa N55-12 y Florida', '022445566', '1792345678001', date(2026, 2, 12), 'Corporativo', 'Activo', 4),
            (5, 'TecnoQuito Soluciones C.A.', 'Av. Carapungo 452 y Panamericana', '022822119', '1793456789001', date(2026, 3, 1), 'Mayorista', 'Activo', 5),
        ]
        for cid, nom, dir_, tel, ruc, fec, tip, cond, did in clientes_data:
            Cliente.objects.update_or_create(
                id_cliente=cid,
                defaults={
                    'nombre_razon_social': nom, 'direccion': dir_, 'telefono': tel,
                    'ruc': ruc, 'fecha_registro': fec, 'tipo_cliente': tip,
                    'condicion': cond, 'distrito': dist_map[did]
                }
            )

        # 3. Proveedores
        proveedores_data = [
            (1, 'Mayorista Tecnológico del Ecuador S.A.', 'Av. Galo Plaza Lasso N60-12', '022478900', 'Ing. Carlos Albuja', 4),
            (2, 'Importadora Global Tech Cía. Ltda.', 'Av. Eloy Alfaro N34-110', '022245600', 'Msc. Diana Benavides', 1),
            (3, 'CompuDistribuciones Andinas S.A.', 'Av. América N18-35', '022521144', 'Lic. Roberto Vaca', 2),
            (4, 'Soluciones y Partes Informáticas S.A.', 'Av. Pedro Vicente Maldonado S30-10', '022671199', 'Ing. Patricia Solís', 8),
        ]
        for pid, raz, dir_, tel, rep, did in proveedores_data:
            Proveedor.objects.update_or_create(
                id_proveedor=pid,
                defaults={
                    'razon_social': raz, 'direccion': dir_, 'telefono': tel,
                    'representante_legal': rep, 'distrito': dist_map[did]
                }
            )

        # 4. Vendedores
        vendedores_data = [
            (1, 'Karina Violeta', 'Figueroa Vergara', Decimal('1250.00'), date(2025, 6, 1), 'Senior', 1),
            (2, 'Esteban Fernando', 'Gómez Játiva', Decimal('950.00'), date(2025, 8, 15), 'Planta', 2),
            (3, 'Andrea Patricia', 'Morales Silva', Decimal('850.00'), date(2025, 10, 1), 'Comisionista', 6),
            (4, 'Mateo Sebastián', 'Castillo Rueda', Decimal('750.00'), date(2026, 1, 10), 'Junior', 4),
        ]
        for vid, nom, ape, sue, fec, tip, did in vendedores_data:
            Vendedor.objects.update_or_create(
                id_vendedor=vid,
                defaults={
                    'nombres': nom, 'apellidos': ape, 'sueldo': sue,
                    'fecha_inicio': fec, 'tipo_vendedor': tip, 'distrito': dist_map[did]
                }
            )

        # 5. Productos
        productos_data = [
            (1, 'Laptop Dell Latitude 3440 Core i7 16GB 512GB SSD', Decimal('850.00'), 24, 6, 'Dell', 'Laptops y Portátiles', True),
            (2, 'Laptop Lenovo ThinkPad E14 Ryzen 7 16GB 512GB SSD', Decimal('790.00'), 18, 5, 'Lenovo', 'Laptops y Portátiles', True),
            (3, 'Monitor HP ProDisplay P24v G5 24 pulgadas FHD 75Hz', Decimal('145.00'), 32, 8, 'HP', 'Monitores y Pantallas', True),
            (4, 'Impresora Multifunción Epson EcoTank L3250 WiFi', Decimal('215.00'), 15, 5, 'Epson', 'Impresión y Digitalización', True),
            (5, 'Teclado y Ratón Inalámbrico Logitech MK270', Decimal('32.50'), 45, 12, 'Logitech', 'Periféricos y Accesorios', True),
            (6, 'Disco Solido Kingston NV2 1TB NVMe PCIe 4.0', Decimal('78.00'), 8, 10, 'Kingston', 'Almacenamiento', True),
            (7, 'Router Inalámbrico TP-Link Archer AX12 Wi-Fi 6', Decimal('58.00'), 4, 8, 'TP-Link', 'Redes y Conectividad', True),
            (8, 'Memoria RAM Corsair Vengeance LPX 16GB DDR4 3200MHz', Decimal('48.00'), 5, 8, 'Corsair', 'Componentes y Partes', True),
            (9, 'Cable de Red Patch Cord Cat6 UTP 3 Metros Gris', Decimal('4.50'), 85, 20, 'Panduit', 'Redes y Conectividad', False),
            (10, 'Regulador de Voltaje Forza FVR-1211USB 1200VA/600W', Decimal('26.00'), 3, 6, 'Forza', 'Energía y Protección', True),
        ]
        for pid, desc, pre, act, min_, mar, lin, imp in productos_data:
            Producto.objects.update_or_create(
                id_producto=pid,
                defaults={
                    'descripcion': desc, 'precio': pre, 'stock_actual': act,
                    'stock_minimo': min_, 'marca': mar, 'linea_producto': lin,
                    'importado': imp
                }
            )

        # 6. Abastecimiento
        abast_data = [
            (1, 1, Decimal('680.00')),
            (1, 2, Decimal('630.00')),
            (1, 3, Decimal('115.00')),
            (2, 4, Decimal('172.00')),
            (2, 5, Decimal('23.50')),
            (3, 6, Decimal('59.00')),
            (3, 7, Decimal('42.00')),
            (4, 9, Decimal('2.20')),
            (4, 10, Decimal('18.50')),
        ]
        for pid, prid, prec in abast_data:
            Abastecimiento.objects.update_or_create(
                proveedor_id=pid,
                producto_id=prid,
                defaults={'precio': prec}
            )

        # 7. Usuarios
        UsuarioSistema.objects.update_or_create(
            id_usuario=1,
            defaults={
                'username': 'admin',
                'password_hash': 'pbkdf2:sha256:600000$admin123',
                'nombre_completo': 'Karina Figueroa (Administrador)',
                'email': 'kfigueroa@sistemasales.com.ec',
                'rol': 'Administrador',
                'estado': 'ACTIVO'
            }
        )

        self.stdout.write(self.style.SUCCESS('¡Datos de prueba cargados exitosamente!'))
