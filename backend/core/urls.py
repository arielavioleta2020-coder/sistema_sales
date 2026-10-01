from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DistritoViewSet, ClienteViewSet, ProveedorViewSet,
    VendedorViewSet, ProductoViewSet, FacturaViewSet,
    OrdenCompraViewSet, AbastecimientoViewSet,
    api_login, api_dashboard_kpis, api_reportes
)

router = DefaultRouter()
router.register(r'distritos', DistritoViewSet, basename='distrito')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'proveedores', ProveedorViewSet, basename='proveedor')
router.register(r'vendedores', VendedorViewSet, basename='vendedor')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'facturas', FacturaViewSet, basename='factura')
router.register(r'ordenes', OrdenCompraViewSet, basename='orden')
router.register(r'abastecimientos', AbastecimientoViewSet, basename='abastecimiento')

urlpatterns = [
    path('auth/login/', api_login, name='api_login'),
    path('dashboard/kpis/', api_dashboard_kpis, name='api_dashboard_kpis'),
    path('reportes/resumen/', api_reportes, name='api_reportes'),
    path('', include(router.urls)),
]
