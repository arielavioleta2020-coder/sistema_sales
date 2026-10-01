# GUÍA ESTRATÉGICA PARA LA DEFENSA ORAL Y DIAPOSITIVAS
### Instituto Superior Tecnológico Japón • Trabajo de Titulación
**Tema:** Desarrollo de un Sistema de Información para la Gestión Integral de Ventas, Facturación, Inventarios y Procesos de Abastecimiento en la Empresa SISTEMA_SALES S. A.  
**Estudiante:** Karina Violeta Figueroa Vergara  
**Estructura:** Las 24 Diapositivas Oficiales recomendadas en el Capítulo XV (Páginas 59-60)

---

### Diapositiva 1: Portada
- **Título:** Desarrollo de un Sistema de Información para la Gestión Integral de Ventas, Facturación, Inventarios y Procesos de Abastecimiento en la Empresa SISTEMA_SALES S. A.
- **Institución:** Instituto Superior Tecnológico Japón (Quito - Ecuador).
- **Carrera:** Tecnología Superior en Desarrollo de Software.
- **Autor:** Karina Violeta Figueroa Vergara.
- **Docentes:** Msc. Graciela Trujillo / Ing. Luis Calo.

### Diapositiva 2: Contexto de SISTEMA_SALES S.A.
- Empresa comercializadora de productos tecnológicos al por mayor y menor en Quito (Av. Los Shyris, Edificio Argentun).
- Crecimiento acelerado en el volumen de operaciones comerciales.
- Estructura tecnológica: Jefe de Sistemas, DBA, Analista, 2 Desarrolladores y 1 Pasante.

### Diapositiva 3: Planteamiento del Problema
- Información comercial dispersa en hojas de cálculo y registros manuales.
- Carencia de sincronización entre el stock registrado y las ventas facturadas.
- Pérdida de trazabilidad en las órdenes de compra a proveedores.

### Diapositiva 4: Causas y Efectos (Árbol del Problema)
- **Causas:** Crecimiento de demanda, falta de centralización geográfica por distritos, ausencia de validaciones de stock físico.
- **Efectos:** Inconsistencia de inventario, demoras en facturación, riesgo de desabastecimiento imprevisto y retrasos administrativos.

### Diapositiva 5: Objetivos de la Investigación
- **General:** Implementar una solución integral multiplataforma (escritorio, web y móvil) conectada a un backend centralizado y base de datos relacional.
- **Específicos:** Normalización de base de datos relacional, desarrollo de API REST en Django, interfaces accesibles y reportes analíticos.

### Diapositiva 6: Solución Propuesta
- Ecosistema tecnológico integrado con base de datos única en **MySQL Workbench**.
- Lógica de negocio centralizada con reglas de validación en tiempo real (RN01 - RN14).
- Acceso multiplataforma: Cliente Web moderno, simulador Desktop Flutter para Windows y cliente móvil Expo/React Native.

### Diapositiva 7: Arquitectura del Sistema
- Arquitectura en 3 capas: Presentación, Lógica de Negocio y Datos.
- Separación de responsabilidades bajo el patrón arquitectónico Modelo-Vista-Controlador (MVC).
- Comunicación mediante protocolo HTTP y payloads estándar en formato JSON.

### Diapositiva 8: Tecnologías Seleccionadas
- **Base de Datos:** MySQL Server 8.0 / MySQL Workbench con motor transaccional InnoDB.
- **Backend:** Python 3 y Django REST Framework.
- **Frontend Web:** HTML5 Semántico, Vanilla CSS3 con diseño glassmorphism y JavaScript.
- **Escritorio:** Flutter para Windows (Win32).
- **Móvil:** Expo y React Native.

### Diapositiva 9: Base de Datos Relacional
- Esquema `sistema_sales` normalizado en 3ra Forma Normal (3FN).
- 11 tablas interconectadas con integridad referencial (ON UPDATE CASCADE / ON DELETE RESTRICT).
- Triggers automatizados para evitar stock negativo y actualizar existencias.

### Diapositiva 10: Modelo Entidad-Relación (MER)
- Explicación de la cardinalidad 1 a N:
  - Distrito $\rightarrow$ Clientes, Proveedores, Vendedores.
  - Cliente $\rightarrow$ Facturas; Vendedor $\rightarrow$ Facturas.
  - Factura $\rightarrow$ Detalle Factura $\leftarrow$ Producto.
  - Proveedor $\rightarrow$ Órdenes de Compra $\rightarrow$ Detalle Orden $\leftarrow$ Producto.

### Diapositiva 11: Modelado UML
- Diagrama de casos de uso por roles (Administrador, Vendedor, Personal de Compras).
- Diagrama de clases del dominio con atributos, tipos de datos y métodos de cálculo de importes e IVA.

### Diapositiva 12: Plataforma de Escritorio (Flutter para Windows)
- Muestra de la Figura 6: Dashboard con tarjetas de métricas ($15,480 en ventas, 32 facturas, 5 productos con stock bajo).
- Navegación lateral optimizada para teclado y mouse en terminales administrativos.

### Diapositiva 13: Plataforma Web (React / JS)
- Muestra de la Figura 7: Gestión de productos con filtrado dinámico por categoría y marca.
- Formularios modales con validaciones en cliente y servidor.

### Diapositiva 14: Plataforma Móvil (Expo y React Native)
- Muestra de las Figuras 8 y 10: Pantalla de inicio de sesión con diseño adaptable para teléfonos inteligentes.
- Enrutamiento por características (`app/login`, `app/dashboard`, `app/productos`, `app/ventas`).

### Diapositiva 15: Módulo de Ventas
- Selección rápida de clientes y vendedores.
- Adición de productos con verificación instantánea de existencias físicas disponibles.

### Diapositiva 16: Facturación y Comprobantes
- Cumplimiento de normativa tributaria ecuatoriana: Liquidación automática de IVA al 15%.
- Generación de comprobante electrónico para impresión o exportación.
- Mecanismo de anulación controlada con reposición de inventario (RN14).

### Diapositiva 17: Control de Inventarios y Stock Mínimo
- Requerimiento RF09: Marcado de alerta en amarillo/rojo cuando el stock físico es $\le$ stock mínimo.
- Cálculo de déficit de unidades para reabastecimiento oportuno.

### Diapositiva 18: Procesos de Abastecimiento y Órdenes de Compra
- Emisión de solicitudes formales a proveedores autorizados.
- Botón de "Atender Orden" que incrementa automáticamente el inventario físico al recibir la mercadería.
- Matriz de costos y análisis del margen de ganancia comercial.

### Diapositiva 19: Seguridad y Control de Acceso
- Autenticación mediante credenciales protegidas y control de perfiles (Administrador, Vendedor, Compras, Administrativo).
- Auditoría de transacciones mediante campos de fecha y usuario responsable.

### Diapositiva 20: Resultados Esperados
- Centralización total de la información en una sola base de datos corporativa.
- Eliminación de errores humanos en cálculos de IVA y subtotales.
- Disponibilidad 24/7 para consultas ejecutivas.

### Diapositiva 21: Indicadores de Medición (Capítulo XII)
- Tiempo de emisión de facturas: Reducido de 12 minutos a menos de 45 segundos.
- Errores de inventario: Disminución estimada del 95%.
- Tiempo de consolidación de reportes gerenciales: Inmediato (tiempo real).

### Diapositiva 22: Conclusiones
- Se cumplió el 100% de los requerimientos funcionales (RF01-RF18) y no funcionales del caso práctico.
- La separación en 3 capas garantiza escalabilidad, seguridad y alta mantenibilidad.
- La base de datos en MySQL Workbench garantiza la integridad transaccional mediante triggers y claves foráneas.

### Diapositiva 23: Recomendaciones
- Implementar respaldos periódicos automatizados (mysqldump) en almacenamiento externo.
- Capacitar al personal operativo en el flujo de recepción de mercadería mediante órdenes de compra.
- Evaluar la incorporación de facturación electrónica directa con el web service del SRI.

### Diapositiva 24: Ronda de Preguntas
- Espacio abierto para dudas e inquietudes por parte del tribunal examinador.
- Disponibilidad del sistema en vivo para pruebas en tiempo real.
