import 'package:flutter/material.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Sidebar de Navegación Windows (Figura 6 de la tesis)
          NavigationRail(
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            backgroundColor: const Color(0xFF0F172A),
            unselectedIconTheme: const IconThemeData(color: Color(0xFF94A3B8)),
            selectedIconTheme: const IconThemeData(color: Colors.white),
            unselectedLabelTextStyle: const TextStyle(color: Color(0xFF94A3B8)),
            selectedLabelTextStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            leading: Column(
              children: const [
                SizedBox(height: 16),
                Icon(Icons.category, color: Colors.blueAccent, size: 36),
                SizedBox(height: 8),
                Text(
                  'SISTEMA_SALES\nS. A.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                ),
                SizedBox(height: 20),
              ],
            ),
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(icon: Icon(Icons.dashboard), label: Text('Dashboard')),
              NavigationRailDestination(icon: Icon(Icons.shopping_cart), label: Text('Ventas')),
              NavigationRailDestination(icon: Icon(Icons.receipt_long), label: Text('Facturas')),
              NavigationRailDestination(icon: Icon(Icons.inventory_2), label: Text('Productos')),
              NavigationRailDestination(icon: Icon(Icons.warehouse), label: Text('Inventario')),
              NavigationRailDestination(icon: Icon(Icons.people), label: Text('Clientes')),
              NavigationRailDestination(icon: Icon(Icons.analytics), label: Text('Reportes')),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // Área de Contenido Principal (Figura 6 de la tesis)
          Expanded(
            child: Column(
              children: [
                // Barra Superior
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  color: Colors.white,
                  child: Row(
                    children: [
                      const Text(
                        'SISTEMA_SALES S. A. - Panel de Control',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const Spacer(),
                      const Chip(
                        avatar: Icon(Icons.verified_user, size: 16, color: Colors.green),
                        label: Text('Quito - Ecuador'),
                      ),
                      const SizedBox(width: 12),
                      Row(
                        children: const [
                          CircleAvatar(child: Text('KF')),
                          SizedBox(width: 8),
                          Text('Karina Figueroa (Admin)', style: TextStyle(fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1),
                // Panel Principal con KPIs (Figura 6)
                Expanded(
                  child: Container(
                    color: const Color(0xFFF8FAFC),
                    padding: const EdgeInsets.all(24),
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Dashboard', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 16),
                          // Fila de Tarjetas de Indicadores (Figura 6: $15,480, 32, 5)
                          Row(
                            children: [
                              _buildKpiCard('Total Ventas', '\$15,480', Icons.account_balance_wallet, const Color(0xFF1D4ED8)),
                              const SizedBox(width: 16),
                              _buildKpiCard('Facturas Hoy', '32', Icons.receipt, const Color(0xFF0D9488)),
                              const SizedBox(width: 16),
                              _buildKpiCard('Productos Bajo Stock', '5', Icons.warning_amber, const Color(0xFFEA580C)),
                            ],
                          ),
                          const SizedBox(height: 24),
                          // Tabla de Recent Ventas (Figura 6)
                          Card(
                            elevation: 1,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: const [
                                      Text('Recent Ventas', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                      Icon(Icons.more_vert),
                                    ],
                                  ),
                                  const Divider(),
                                  DataTable(
                                    columns: const [
                                      DataColumn(label: Text('Factura')),
                                      DataColumn(label: Text('Cliente')),
                                      DataColumn(label: Text('Total USD')),
                                      DataColumn(label: Text('Estado')),
                                    ],
                                    rows: const [
                                      DataRow(cells: [
                                        DataCell(Text('FAC-001-001-0000001')),
                                        DataCell(Text('Corporación Favorita C.A.')),
                                        DataCell(Text('\$3,470.00')),
                                        DataCell(Chip(label: Text('PAGADA'), backgroundColor: Color(0xFFD1FAE5))),
                                      ]),
                                      DataRow(cells: [
                                        DataCell(Text('FAC-001-001-0000002')),
                                        DataCell(Text('Distribuidora Pichincha S.A.')),
                                        DataCell(Text('\$2,558.75')),
                                        DataCell(Chip(label: Text('PAGADA'), backgroundColor: Color(0xFFD1FAE5))),
                                      ]),
                                      DataRow(cells: [
                                        DataCell(Text('FAC-001-001-0000003')),
                                        DataCell(Text('Comercializadora El Cóndor')),
                                        DataCell(Text('\$553.15')),
                                        DataCell(Chip(label: Text('PAGADA'), backgroundColor: Color(0xFFD1FAE5))),
                                      ]),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                Text(value, style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
              ],
            ),
            Icon(icon, color: Colors.white24, size: 40),
          ],
        ),
      ),
    );
  }
}
