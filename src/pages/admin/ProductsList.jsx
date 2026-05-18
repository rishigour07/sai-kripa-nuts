import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { allProducts } from '../Products';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
    const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts')) || [];
    
    let combinedProducts = [...allProducts];
    if (savedProducts.length > 0) {
      combinedProducts = [...combinedProducts, ...savedProducts];
    }
    
    combinedProducts = combinedProducts.filter(p => !deletedProducts.includes(p.id));
    setProducts(combinedProducts);
  }, []);

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    // Add to deleted products array in local storage
    const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts')) || [];
    if (!deletedProducts.includes(id)) {
      deletedProducts.push(id);
      localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
    }

    // Update state to remove it from view
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[#0E4B32] text-xl font-bold">Products List</h2>
        <Button 
          onClick={() => navigate('/admin/products/add')}
          className="bg-[#C79A3B] hover:bg-[#b08731] text-white font-medium rounded-xl px-6 py-3 h-auto shadow-md"
        >
          Add Product
        </Button>
      </div>

      <div className="bg-[#F5F0E6] rounded-3xl p-8 shadow-sm">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#0E4B32]/20">
                  <th className="pb-4 font-medium text-[#0E4B32]">Image</th>
                  <th className="pb-4 font-medium text-[#0E4B32]">Name</th>
                  <th className="pb-4 font-medium text-[#0E4B32]">Category</th>
                  <th className="pb-4 font-medium text-[#0E4B32]">Price</th>
                  <th className="pb-4 font-medium text-[#0E4B32] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#0E4B32]/10 last:border-0 hover:bg-[#0E4B32]/5 transition-colors">
                    <td className="py-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                    </td>
                    <td className="py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="py-4 text-gray-600">{product.origin}</td>
                    <td className="py-4 font-medium">₹{product.price}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
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
