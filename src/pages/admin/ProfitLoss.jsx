import React, { useState, useEffect } from 'react';
import { LineChart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ProfitLoss() {
  const [financials, setFinancials] = useState({
    revenue: 0,
    costOfGoods: 0,
    grossProfit: 0,
    margin: 0
  });

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Calculate total revenue
    const revenue = orders.reduce((sum, order) => {
      if (order.total != null) return sum + Number(order.total || 0);
      if (order.totalAmount != null) return sum + Number(order.totalAmount || 0);
      if (order.subtotal != null) return sum + Number(order.subtotal || 0);
      // fallback: if items exist sum their totals
      if (Array.isArray(order.items)) {
        const itemsTotal = order.items.reduce((s, it) => s + ((Number(it.price) || Number(it.pricePerKg) || 0) * (Number(it.quantity) || 0)), 0);
        return sum + itemsTotal;
      }
      return sum;
    }, 0);
    
    // For MVP, assume a fixed 40% cost margin on revenue
    // (In a real app, cost would be calculated from product purchase price * quantity)
    const costOfGoods = revenue * 0.40;
    
    const grossProfit = revenue - costOfGoods;
    const margin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    setFinancials({
      revenue,
      costOfGoods,
      grossProfit,
      margin
    });
  }, []);

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[#0E4B32] text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-[#DDE7D8] rounded-lg">
            <LineChart className="w-5 h-5 text-[#0E4B32]" />
          </div>
          Profit & Loss Statement
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-gray-500 font-medium">Total Revenue</h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            ₹{financials.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Based on completed orders
          </div>
        </div>

        {/* Cost of Goods Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <LineChart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-gray-500 font-medium">Cost of Goods (Est.)</h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            ₹{financials.costOfGoods.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-sm text-red-500 font-medium">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            Estimated 40% of revenue
          </div>
        </div>

        {/* Gross Profit Card */}
        <div className="bg-[#0E4B32] rounded-3xl p-8 shadow-sm relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white/80 font-medium">Gross Profit</h3>
          </div>
          <div className="text-4xl font-bold text-white mb-2 relative z-10">
            ₹{financials.grossProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-sm text-[#C79A3B] font-medium relative z-10">
            Profit Margin: {financials.margin.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-[#F5F0E6] rounded-3xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#0E4B32] mb-4">Financial Summary</h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
          This report provides an overview of your store's financial performance. 
          The Total Revenue is calculated directly from all booked orders. 
          For demonstration purposes, the Cost of Goods Sold (COGS) is estimated at a fixed 40% of revenue. 
          The Gross Profit reflects the remaining earnings after deducting these estimated costs.
        </p>
      </div>
    </div>
  );
}

// Inline component since it's only used here
const TrendingUp = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
