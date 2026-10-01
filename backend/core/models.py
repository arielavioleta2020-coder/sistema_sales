from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Distrito(models.Model):
    id_distrito = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'DISTRITO'
        verbose_name = 'Distrito'
        verbose_name_plural = 'Distritos'
        ordering = ['id_distrito']

    def __str__(self):
        return f"{self.id_distrito} - {self.descripcion}"


class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre_razon_social = models.CharField(max_length=150)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    ruc = models.CharField(max_length=13, unique=True)
    fecha_registro = models.DateField()
    tipo_cliente = models.CharField(max_length=50) # Mayorista, Minorista, Corporativo, Final
    condicion = models.CharField(max_length=50)    # Activo, Inactivo, Moroso, etc.
    distrito = models.ForeignKey(Distrito, on_delete=models.RESTRICT, db_column='id_distrito', related_name='clientes')

    class Meta:
        db_table = 'CLIENTE'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['id_cliente']

    def __str__(self):
        return f"{self.nombre_razon_social} ({self.ruc})"


class Proveedor(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    razon_social = models.CharField(max_length=150)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    representante_legal = models.CharField(max_length=150)
    distrito = models.ForeignKey(Distrito, on_delete=models.RESTRICT, db_column='id_distrito', related_name='proveedores')

    class Meta:
        db_table = 'PROVEEDOR'
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'
        ordering = ['id_proveedor']

    def __str__(self):
        return self.razon_social


class Vendedor(models.Model):
    id_vendedor = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    sueldo = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    fecha_inicio = models.DateField()
    tipo_vendedor = models.CharField(max_length=50) # Planta, Comisionista, Senior, Junior
    distrito = models.ForeignKey(Distrito, on_delete=models.RESTRICT, db_column='id_distrito', related_name='vendedores')

    class Meta:
        db_table = 'VENDEDOR'
        verbose_name = 'Vendedor'
        verbose_name_plural = 'Vendedores'
        ordering = ['id_vendedor']

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    stock_actual = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    stock_minimo = models.IntegerField(default=5, validators=[MinValueValidator(0)])
    marca = models.CharField(max_length=100)
    linea_producto = models.CharField(max_length=100)
    importado = models.BooleanField(default=False)

    class Meta:
        db_table = 'PRODUCTO'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['id_producto']

    def __str__(self):
        return f"{self.descripcion} ({self.marca})"

    @property
    def bajo_stock(self):
        return self.stock_actual <= self.stock_minimo


class Factura(models.Model):
    numero_factura = models.CharField(primary_key=True, max_length=30)
    fecha_registro = models.DateField()
    cliente = models.ForeignKey(Cliente, on_delete=models.RESTRICT, db_column='id_cliente', related_name='facturas')
    fecha_cancelacion = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=30, default='EMITIDA') # EMITIDA, PAGADA, ANULADA
    vendedor = models.ForeignKey(Vendedor, on_delete=models.RESTRICT, db_column='id_vendedor', related_name='facturas')
    iva = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('15.00'))

    class Meta:
        db_table = 'FACTURA'
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'
        ordering = ['-fecha_registro', 'numero_factura']

    def __str__(self):
        return f"Factura {self.numero_factura} - {self.cliente.nombre_razon_social}"

    @property
    def subtotal(self):
        detalles = self.detalles.all()
        return sum(d.cantidad * d.precio_venta for d in detalles)

    @property
    def total(self):
        sub = self.subtotal
        return round(sub * (1 + (self.iva / Decimal('100.00'))), 2)


class DetalleFactura(models.Model):
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE, db_column='numero_factura', related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.RESTRICT, db_column='id_producto', related_name='detalles_factura')
    cantidad = models.IntegerField(validators=[MinValueValidator(1)])
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])

    class Meta:
        db_table = 'DETALLE_FACTURA'
        verbose_name = 'Detalle de Factura'
        verbose_name_plural = 'Detalles de Factura'
        unique_together = (('factura', 'producto'),)

    def __str__(self):
        return f"{self.factura.numero_factura} - {self.producto.descripcion} x{self.cantidad}"


class OrdenCompra(models.Model):
    id_orden = models.AutoField(primary_key=True)
    fecha_registro = models.DateField()
    proveedor = models.ForeignKey(Proveedor, on_delete=models.RESTRICT, db_column='id_proveedor', related_name='ordenes_compra')
    fecha_atencion = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=30, default='PENDIENTE') # PENDIENTE, ATENDIDA, CANCELADA

    class Meta:
        db_table = 'ORDEN_COMPRA'
        verbose_name = 'Orden de Compra'
        verbose_name_plural = 'Órdenes de Compra'
        ordering = ['-fecha_registro', 'id_orden']

    def __str__(self):
        return f"Orden #{self.id_orden} - {self.proveedor.razon_social}"


class DetalleOrden(models.Model):
    orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE, db_column='id_orden', related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.RESTRICT, db_column='id_producto', related_name='detalles_orden')
    cantidad_solicitada = models.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        db_table = 'DETALLE_ORDEN'
        verbose_name = 'Detalle de Orden'
        verbose_name_plural = 'Detalles de Órdenes'
        unique_together = (('orden', 'producto'),)

    def __str__(self):
        return f"Orden #{self.orden.id_orden} - {self.producto.descripcion} x{self.cantidad_solicitada}"


class Abastecimiento(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.RESTRICT, db_column='id_proveedor', related_name='abastecimientos')
    producto = models.ForeignKey(Producto, on_delete=models.RESTRICT, db_column='id_producto', related_name='abastecimientos')
    precio = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])

    class Meta:
        db_table = 'ABASTECIMIENTO'
        verbose_name = 'Abastecimiento'
        verbose_name_plural = 'Abastecimientos'
        unique_together = (('proveedor', 'producto'),)

    def __str__(self):
        return f"{self.proveedor.razon_social} -> {self.producto.descripcion} (${self.precio})"


class UsuarioSistema(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    password_hash = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=150)
    email = models.EmailField(max_length=100, unique=True)
    rol = models.CharField(max_length=30) # Administrador, Vendedor, Personal de compras, Personal administrativo
    estado = models.CharField(max_length=20, default='ACTIVO')
    ultimo_acceso = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'USUARIO'
        verbose_name = 'Usuario del Sistema'
        verbose_name_plural = 'Usuarios del Sistema'

    def __str__(self):
        return f"{self.username} ({self.rol})"
