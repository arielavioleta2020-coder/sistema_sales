import React from 'react';
import DashboardPage from '../pages/DashboardPage';
import ProductosPage from '../pages/ProductosPage';
import FacturacionPage from '../pages/FacturacionPage';
import InventarioPage from '../pages/InventarioPage';
import ClientesPage from '../pages/ClientesPage';

export default function AppRoutes({ currentView, setCurrentView }) {
  switch (currentView) {
    case 'dashboard':
      return <DashboardPage setCurrentView={setCurrentView} />;
    case 'productos':
      return <ProductosPage />;
    case 'facturacion':
      return <FacturacionPage setCurrentView={setCurrentView} />;
    case 'inventario':
      return <InventarioPage />;
    case 'clientes':
      return <ClientesPage />;
    default:
      return <DashboardPage setCurrentView={setCurrentView} />;
  }
}
