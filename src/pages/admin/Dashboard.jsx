import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Package, ShoppingBag } from 'lucide-react';
import { allProducts } from '../Products';
import { safeReadJSON } from '../../utils/storage';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    // Orders stats
    const orders = safeReadJSON('orders', []);
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total ?? order.totalAmount ?? order.subtotal ?? 0), 0);
    
    // Products stats
    const savedProducts = safeReadJSON('addedProducts', []);
    const deletedProducts = safeReadJSON('deletedProducts', []);
    let combinedProducts = [...allProducts, ...savedProducts];
    combinedProducts = combinedProducts.filter(p => !deletedProducts.includes(p.id));
    
    // Inventory stats
    const inventory = safeReadJSON('inventory', {});
    let lowStockCount = 0;
    combinedProducts.forEach(product => {
      const stock = parseFloat(inventory[product.id] || '0');
      if (stock < 5) lowStockCount++; // Consider < 5kg as low stock
    });

    setStats({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: combinedProducts.length,
      lowStockCount,
    });
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Low Stock Alerts', value: stats.lowStockCount, icon: LayoutDashboard, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[#0E4B32] text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-[#DDE7D8] rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-[#0E4B32]" />
          </div>
          Dashboard Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#F5F0E6] rounded-3xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#0E4B32] mb-4">Recent Activity</h3>
        <p className="text-gray-600 text-sm">Dashboard is now active and tracking your store's performance. Navigate to other sections to manage your catalog, view detailed orders, update inventory, and analyze profit and loss.</p>
      </div>
    </div>
  );
}
