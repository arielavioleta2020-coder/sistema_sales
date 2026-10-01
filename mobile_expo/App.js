import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'dashboard', 'productos'
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  // PANTALLA DE LOGIN (FIGURA 8 DE LA TESIS)
  if (currentScreen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loginCard}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>S</Text>
          </View>
          <Text style={styles.brandTitle}>SISTEMA_SALES S. A.</Text>
          <Text style={styles.loginTitle}>Inicio de Sesión</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="admin / vendedor"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={() => setCurrentScreen('dashboard')}>
            <Text style={styles.btnPrimaryText}>ENTRAR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // PANTALLA DASHBOARD MÓVIL
  return (
    <SafeAreaView style={styles.containerDashboard}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SISTEMA_SALES S.A.</Text>
        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { backgroundColor: '#1D4ED8' }]}>
            <Text style={styles.kpiLabel}>Total Ventas</Text>
            <Text style={styles.kpiValue}>$15,480</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#0D9488' }]}>
            <Text style={styles.kpiLabel}>Facturas</Text>
            <Text style={styles.kpiValue}>32</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Módulos Operativos (Figura 10)</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>📦 Catálogo de Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>👥 Gestión de Clientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>🧾 Facturación Móvil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>🚚 Órdenes de Compra</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#1D4ED8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  containerDashboard: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#0F172A',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#38BDF8',
    fontSize: 13,
  },
  content: {
    padding: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
  },
  kpiLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  kpiValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  }
});
