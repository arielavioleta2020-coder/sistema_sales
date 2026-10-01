import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(const SistemaSalesDesktopApp());
}

class SistemaSalesDesktopApp extends StatelessWidget {
  const SistemaSalesDesktopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SISTEMA_SALES S.A. - Desktop',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1D4ED8),
          primary: const Color(0xFF1D4ED8),
          secondary: const Color(0xFF0F172A),
        ),
        fontFamily: 'Segoe UI',
        useMaterial3: true,
      ),
      home: const DashboardScreen(),
    );
  }
}
