from django.contrib import admin
from .models import (
    Distrito, Cliente, Proveedor, Vendedor, Producto,
    Factura, DetalleFactura, OrdenCompra, DetalleOrden,
    Abastecimiento, UsuarioSistema
)

@admin.register(Distrito)
class DistritoAdmin(admin.ModelAdmin):
    list_display = ('id_distrito', 'descripcion')
    search_fields = ('descripcion',)

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'nombre_razon_social', 'ruc', 'telefono', 'tipo_cliente', 'condicion', 'distrito')
    list_filter = ('tipo_cliente', 'condicion', 'distrito')
    search_fields = ('nombre_razon_social', 'ruc', 'telefono')

@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('id_proveedor', 'razon_social', 'representante_legal', 'telefono', 'distrito')
    search_fields = ('razon_social', 'representante_legal')

@admin.register(Vendedor)
class VendedorAdmin(admin.ModelAdmin):
    list_display = ('id_vendedor', 'nombres', 'apellidos', 'sueldo', 'tipo_vendedor', 'fecha_inicio')
    list_filter = ('tipo_vendedor', 'distrito')
    search_fields = ('nombres', 'apellidos')

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id_producto', 'descripcion', 'marca', 'linea_producto', 'precio', 'stock_actual', 'stock_minimo', 'importado', 'bajo_stock')
    list_filter = ('marca', 'linea_producto', 'importado')
    search_fields = ('descripcion', 'marca')

class DetalleFacturaInline(admin.TabularInline):
    model = DetalleFactura
    extra = 1

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = ('numero_factura', 'fecha_registro', 'cliente', 'vendedor', 'estado', 'iva', 'total')
    list_filter = ('estado', 'fecha_registro')
    search_fields = ('numero_factura', 'cliente__nombre_razon_social')
    inlines = [DetalleFacturaInline]

class DetalleOrdenInline(admin.TabularInline):
    model = DetalleOrden
    extra = 1

@admin.register(OrdenCompra)
class OrdenCompraAdmin(admin.ModelAdmin):
    list_display = ('id_orden', 'fecha_registro', 'proveedor', 'fecha_atencion', 'estado')
    list_filter = ('estado', 'fecha_registro')
    search_fields = ('id_orden', 'proveedor__razon_social')
    inlines = [DetalleOrdenInline]

@admin.register(Abastecimiento)
class AbastecimientoAdmin(admin.ModelAdmin):
    list_display = ('proveedor', 'producto', 'precio')
    list_filter = ('proveedor',)

@admin.register(UsuarioSistema)
class UsuarioSistemaAdmin(admin.ModelAdmin):
    list_display = ('username', 'nombre_completo', 'email', 'rol', 'estado', 'ultimo_acceso')
    list_filter = ('rol', 'estado')
    search_fields = ('username', 'nombre_completo', 'email')
