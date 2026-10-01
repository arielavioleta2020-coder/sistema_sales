from rest_framework import serializers
from .models import (
    Distrito, Cliente, Proveedor, Vendedor, Producto,
    Factura, DetalleFactura, OrdenCompra, DetalleOrden,
    Abastecimiento, UsuarioSistema
)
from django.db import transaction

class DistritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distrito
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
    distrito_nombre = serializers.ReadOnlyField(source='distrito.descripcion')

    class Meta:
        model = Cliente
        fields = '__all__'


class ProveedorSerializer(serializers.ModelSerializer):
    distrito_nombre = serializers.ReadOnlyField(source='distrito.descripcion')

    class Meta:
        model = Proveedor
        fields = '__all__'


class VendedorSerializer(serializers.ModelSerializer):
    distrito_nombre = serializers.ReadOnlyField(source='distrito.descripcion')
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Vendedor
        fields = '__all__'

    def get_nombre_completo(self, obj):
        return f"{obj.nombres} {obj.apellidos}"


class ProductoSerializer(serializers.ModelSerializer):
    bajo_stock = serializers.ReadOnlyField()

    class Meta:
        model = Producto
        fields = '__all__'


class DetalleFacturaSerializer(serializers.ModelSerializer):
    producto_descripcion = serializers.ReadOnlyField(source='producto.descripcion')
    producto_marca = serializers.ReadOnlyField(source='producto.marca')
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = DetalleFactura
        fields = ['id_producto', 'producto_descripcion', 'producto_marca', 'cantidad', 'precio_venta', 'subtotal']

    def get_subtotal(self, obj):
        return round(float(obj.cantidad * obj.precio_venta), 2)


class FacturaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombre_razon_social')
    cliente_ruc = serializers.ReadOnlyField(source='cliente.ruc')
    vendedor_nombre = serializers.SerializerMethodField()
    detalles = DetalleFacturaSerializer(many=True, required=False)
    subtotal_calculado = serializers.SerializerMethodField()
    total_calculado = serializers.SerializerMethodField()

    class Meta:
        model = Factura
        fields = [
            'numero_factura', 'fecha_registro', 'id_cliente', 'cliente_nombre', 'cliente_ruc',
            'fecha_cancelacion', 'estado', 'id_vendedor', 'vendedor_nombre', 'iva',
            'subtotal_calculado', 'total_calculado', 'detalles'
        ]

    def get_vendedor_nombre(self, obj):
        return f"{obj.vendedor.nombres} {obj.vendedor.apellidos}"

    def get_subtotal_calculado(self, obj):
        return round(float(obj.subtotal), 2)

    def get_total_calculado(self, obj):
        return round(float(obj.total), 2)

    @transaction.atomic
    def create(self, validated_data):
        detalles_data = self.context.get('request').data.get('detalles', [])
        factura = Factura.objects.create(**validated_data)

        for item in detalles_data:
            producto = Producto.objects.select_for_update().get(id_producto=item['id_producto'])
            cantidad = int(item['cantidad'])
            precio_venta = item['precio_venta']

            # Validar regla RN11: Stock actual no debe ser negativo
            if producto.stock_actual < cantidad:
                raise serializers.ValidationError(
                    f"Stock insuficiente para '{producto.descripcion}'. Disponible: {producto.stock_actual}, Solicitado: {cantidad}"
                )

            # Reducir stock del producto
            producto.stock_actual -= cantidad
            producto.save()

            DetalleFactura.objects.create(
                factura=factura,
                producto=producto,
                cantidad=cantidad,
                precio_venta=precio_venta
            )

        return factura


class DetalleOrdenSerializer(serializers.ModelSerializer):
    producto_descripcion = serializers.ReadOnlyField(source='producto.descripcion')
    producto_marca = serializers.ReadOnlyField(source='producto.marca')

    class Meta:
        model = DetalleOrden
        fields = ['id_producto', 'producto_descripcion', 'producto_marca', 'cantidad_solicitada']


class OrdenCompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.ReadOnlyField(source='proveedor.razon_social')
    detalles = DetalleOrdenSerializer(many=True, required=False)

    class Meta:
        model = OrdenCompra
        fields = ['id_orden', 'fecha_registro', 'id_proveedor', 'proveedor_nombre', 'fecha_atencion', 'estado', 'detalles']

    @transaction.atomic
    def create(self, validated_data):
        detalles_data = self.context.get('request').data.get('detalles', [])
        orden = OrdenCompra.objects.create(**validated_data)

        for item in detalles_data:
            producto = Producto.objects.get(id_producto=item['id_producto'])
            DetalleOrden.objects.create(
                orden=orden,
                producto=producto,
                cantidad_solicitada=item['cantidad_solicitada']
            )
        return orden


class AbastecimientoSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.ReadOnlyField(source='proveedor.razon_social')
    producto_descripcion = serializers.ReadOnlyField(source='producto.descripcion')

    class Meta:
        model = Abastecimiento
        fields = '__all__'


class UsuarioSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioSistema
        fields = ['id_usuario', 'username', 'nombre_completo', 'email', 'rol', 'estado', 'ultimo_acceso']
