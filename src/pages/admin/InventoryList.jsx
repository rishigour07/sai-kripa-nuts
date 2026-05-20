import React, { useState, useEffect } from 'react';
import { Package, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { allProducts } from '../Products';
import { safeReadJSON, safeWriteJSON } from '../../utils/storage';

export default function InventoryList() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load products
    const savedProducts = safeReadJSON('addedProducts', []);
    const deletedProducts = safeReadJSON('deletedProducts', []);
    
    let combinedProducts = [...allProducts];
    if (savedProducts.length > 0) {
      combinedProducts = [...combinedProducts, ...savedProducts];
    }
    
    combinedProducts = combinedProducts.filter(p => !deletedProducts.includes(p.id));
    setProducts(combinedProducts);

    // Load inventory
    const savedInventory = safeReadJSON('inventory', {});
    setInventory(savedInventory);

    // Listen for inventory updates from other tabs or same-tab dispatches
    const reloadInventory = () => {
      const inv = safeReadJSON('inventory', {});
      setInventory(inv);
    };

    const storageHandler = (e) => {
      if (e.key === 'inventory') reloadInventory();
    };

    window.addEventListener('storage', storageHandler);
    window.addEventListener('inventoryUpdated', reloadInventory);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('inventoryUpdated', reloadInventory);
    };
  }, []);

  const handleStockChange = (id, value) => {
    setInventory(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    safeWriteJSON('inventory', inventory);
    // Notify in-tab listeners that inventory has updated
    window.dispatchEvent(new Event('inventoryUpdated'));
    
    // Simulate API call delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      // Optional: show a success toast here if you have a toast system
      alert('Inventory saved successfully!');
    }, 600);
  };

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[#0E4B32] text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-[#DDE7D8] rounded-lg">
            <Package className="w-5 h-5 text-[#0E4B32]" />
          </div>
          Inventory Management
        </h2>
        <Button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-[#0E4B32] hover:bg-[#0a3825] text-white font-medium rounded-xl px-6 py-3 h-auto shadow-md flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save All Inventory'}
        </Button>
      </div>

      <div className="bg-[#F5F0E6] rounded-3xl p-8 shadow-sm text-[#102017]">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products found.</p>
        ) : (
          <div className="overflow-x-auto text-[#102017]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#0E4B32]/20">
                  <th className="pb-4 font-medium text-[#0E4B32]">Image</th>
                  <th className="pb-4 font-medium text-[#0E4B32]">Product Name</th>
                  <th className="pb-4 font-medium text-[#0E4B32]">Category</th>
                  <th className="pb-4 font-medium text-[#0E4B32]">Current Stock (kg)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#0E4B32]/10 last:border-0 hover:bg-[#0E4B32]/5 transition-colors">
                    <td className="py-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover bg-white" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                    </td>
                    <td className="py-4 font-medium text-[#0E4B32]">{product.name}</td>
                    <td className="py-4 text-[#4f5850]">{product.origin}</td>
                    <td className="py-4">
                      <input 
                        type="number"
                        min="0"
                        step="0.1"
                        value={inventory[product.id] || ''}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        placeholder="0.0"
                        className="w-32 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C79A3B]/40 focus:border-[#C79A3B] transition-all bg-white text-[#102017]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
