import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const titles = {
    dashboard: { title: 'Dashboard General', subtitle: 'Panel Principal y Resumen Ejecutivo' },
    productos: { title: 'Gestión de Productos', subtitle: 'Catálogo de Inventario y Precios (Figura 7)' },
    facturacion: { title: 'Nueva Venta (Facturación)', subtitle: 'Liquidación con IVA (15%) y Verificación de Stock' },
    inventario: { title: 'Control de Inventario', subtitle: 'Alertas de Stock Mínimo (RF09)' },
    clientes: { title: 'Gestión de Clientes', subtitle: 'Registro Comercial y RUC' }
  };

  const { title, subtitle } = titles[currentView] || titles.dashboard;

  return (
    <MainLayout
      currentView={currentView}
      setCurrentView={setCurrentView}
      title={title}
      subtitle={subtitle}
    >
      <AppRoutes currentView={currentView} setCurrentView={setCurrentView} />
    </MainLayout>
  );
}
