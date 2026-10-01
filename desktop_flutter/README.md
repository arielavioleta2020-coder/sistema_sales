# Aplicación de Escritorio en Flutter para Windows - SISTEMA_SALES S.A.

Esta aplicación corresponde al **Capítulo 9.4 (Desarrollo de Escritorio)** y a la **Figura 6** de la tesis del Instituto Superior Tecnológico Japón.

### Requisitos:
- Flutter SDK 3.0+
- Soporte para escritorio de Windows (`flutter config --enable-windows-desktop`)
- Visual Studio Community con herramientas C++

### Ejecución:
```bash
flutter pub get
flutter run -d windows
```

Se conecta a la API REST centralizada en Django (`http://127.0.0.1:8000/api/`) para consumir los datos de la base de datos `sistema_sales` de MySQL.
