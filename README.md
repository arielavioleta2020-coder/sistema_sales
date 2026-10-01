# SISTEMA_SALES S.A.
## Sistema de Información para la Gestión Integral de Ventas, Facturación, Inventarios y Procesos de Abastecimiento
**Instituto Superior Tecnológico Japón**  
**Carrera:** Tecnología Superior en Desarrollo de Software  
**Estudiante:** Karina Violeta Figueroa Vergara  
**Ciudad / Sede:** Quito – Ecuador • 2026  

---

## 📁 ESTRUCTURA DEL PROYECTO EN VISUAL STUDIO CODE

```text
Caso sales/
├── CASO PRÁCTICO TITULACION.pdf        # Documento oficial del caso práctico institucional
├── database/                           # BASE DE DATOS PARA MYSQL WORKBENCH
│   ├── sistema_sales_mysql.sql         # Script maestro DDL + Triggers + Vistas + Semillas de prueba
│   └── test_queries.sql                # Consultas de verificación y pruebas funcionales
├── backend/                            # BACKEND DJANGO REST API (Python)
│   ├── manage.py                       # Gestor de comandos de Django
│   ├── requirements.txt                # Dependencias (Django, DRF, PyMySQL, cors-headers)
│   ├── .env.example                    # Plantilla de variables de entorno y conexión a MySQL
│   ├── sistema_sales_project/          # Configuración del proyecto Django (settings, urls, wsgi)
│   └── core/                           # Aplicación principal
│       ├── models.py                   # Modelos ORM mapeados exactamente a las 11 tablas de MySQL
│       ├── serializers.py              # Serializadores con reglas de negocio (RN01 - RN14)
│       ├── views.py                    # Endpoints REST (Dashboard KPIs, Facturas, Stock, etc.)
│       ├── urls.py                     # Enrutamiento de la API REST
│       ├── admin.py                    # Panel de administración Django integrado
│       └── management/commands/
│           └── seed_data.py            # Comando para poblar la BD: python manage.py seed_data
├── frontend/                           # CLIENTE WEB Y DASHBOARD (FIGURAS 5, 6 Y 7 DE LA TESIS)
│   ├── index.html                      # Interfaz visual interactiva completa
│   ├── css/
│   │   └── style.css                   # Diseño moderno (Glassmorphism, Dark/Light, KPIs, Tablas)
│   └── js/
│       ├── api.js                      # Conector API Django con respaldo offline local automático
│       └── app.js                      # Controladores de navegación, facturación, stock y roles
├── desktop_flutter/                    # APLICACIÓN DE ESCRITORIO FLUTTER (WINDOWS - FIGURA 6)
│   ├── pubspec.yaml
│   ├── lib/
│   │   ├── main.dart
│   │   └── screens/
│   │       └── dashboard_screen.dart   # Dashboard de escritorio Windows idéntico a Figura 6
│   └── README.md
├── mobile_expo/                        # APLICACIÓN MÓVIL EXPO / REACT NATIVE (FIGURAS 8 Y 10)
│   ├── package.json
│   ├── app.json
│   ├── App.js                          # Login y menú móvil adaptativo
│   └── README.md
├── docs/                               # DOCUMENTACIÓN ACADÉMICA Y TÉCNICA
│   ├── 01_DOCUMENTO_PROYECTO_TITULACION_COMPLETO.md  # 15 Capítulos completos del proyecto
│   ├── 02_DICCIONARIO_DE_DATOS_Y_MER.md              # Modelo Entidad-Relación y tablas
│   ├── 03_MODELADO_UML_Y_CASOS_DE_USO.md             # Diagramas Casos de Uso, Clases y Secuencia
│   ├── 04_GUIA_MYSQL_WORKBENCH.md                    # Instrucciones de ejecución en MySQL Workbench
│   └── 05_GUIA_DEFENSA_ORAL_Y_DIAPOSITIVAS.md        # Guión de las 24 diapositivas para la defensa
├── .vscode/                            # CONFIGURACIÓN PARA VISUAL STUDIO CODE
│   ├── launch.json                     # Ejecución y depuración con tecla F5
│   ├── tasks.json                      # Tareas automáticas de compilación y ejecución
│   ├── settings.json                   # Ajustes de entorno y formato
│   └── extensions.json                 # Extensiones recomendadas
└── iniciar_sistema.bat                 # Lanzador rápido de un solo clic para Windows
```

---

## 🚀 GUÍA DE INICIO RÁPIDO

### 1. Base de Datos en MySQL Workbench
1. Abra **MySQL Workbench**.
2. Abra el archivo: `database/sistema_sales_mysql.sql`.
3. Haga clic en el ícono del **Rayo amarillo** (`Execute`).
4. La base de datos `sistema_sales` quedará creada con todas las tablas, relaciones, disparadores de control de stock, vistas de reporte y datos de prueba de Quito, Ecuador.

### 2. Probar la Aplicación Web y el Dashboard Inmediatamente
- Simplemente haga doble clic en el archivo `iniciar_sistema.bat`, o abra en su navegador web favorito el archivo:
  `frontend/index.html`.
- La aplicación cuenta con un motor de almacenamiento local autónomo con los mismos datos de la base de datos MySQL, por lo que **funciona de inmediato al 100%** con todos sus módulos interactivos:
  - **Dashboard:** KPIs de Total Ventas ($15,480.00), Facturas Hoy (32), Productos Bajo Stock (5), Órdenes Pendientes y gráfico de tendencia mensual (idéntico a la Figura 6).
  - **Nueva Venta (Facturación):** Selección de clientes, cálculo de IVA (15%), validación de stock físico en tiempo real (RN11), emisión y generación de comprobante imprimible.
  - **Gestión de Productos:** Filtros en tiempo real por línea y marca, alertas de stock mínimo (idéntico a la Figura 7).
  - **Control de Inventario:** Marcado de alerta de seguridad en rojo/ámbar (RF09).
  - **Órdenes de Compra y Abastecimiento:** Generación de órdenes y botón de atención que incrementa el stock automáticamente.
  - **Simulador Multiplataforma:** Visualización interactiva de Flutter para Windows y Expo React Native para móviles.

### 3. Ejecutar el Backend en Django REST Framework (Opcional)
Para sincronizar el backend en tiempo real con MySQL:
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```
La API quedará disponible en: `http://127.0.0.1:8000/api/`  
El panel administrativo en: `http://127.0.0.1:8000/admin/`

---

## 👥 PERFILES Y ROLES DISPONIBLES EN EL SISTEMA
En la barra superior de la aplicación puede alternar entre los diferentes perfiles del caso:
1. **Administrador:** Acceso completo a catálogos, configuraciones y reportes.
2. **Vendedor:** Emisión de facturas, consulta de clientes y verificación de existencias.
3. **Personal de Compras:** Gestión de proveedores, emisión y recepción de órdenes de compra.
4. **Personal Administrativo:** Auditoría de facturas, consulta de reportes y kardex de inventario.

---

## 📚 DOCUMENTACIÓN PARA LA DEFENSA ANTE EL TRIBUNAL
En la carpeta `docs/` dispone de todo el material académico estructurado:
- Revise `docs/04_GUIA_MYSQL_WORKBENCH.md` para responder preguntas técnicas sobre la base de datos y generar el diagrama EER.
- Revise `docs/05_GUIA_DEFENSA_ORAL_Y_DIAPOSITIVAS.md` para exponer de forma clara y elocuente las 24 diapositivas oficiales solicitadas en la pág. 59-60 del caso práctico.
