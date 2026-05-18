import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function AddProduct() {
  const [isSaving, setIsSaving] = useState(false);

  // Form Data matching MVP mockup
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shortDesc: '',
    price250g: '',
    price500g: '',
    price1kg: '',
  });

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Construct payload
    const payload = {
      ...formData,
      images: images.map(img => img.file.name),
    };

    // Save to local storage for demo purposes
    const existingProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
    const newProduct = {
      id: Date.now(),
      name: payload.name || 'New Product',
      origin: payload.category || payload.shortDesc || 'Custom',
      price: payload.price250g || payload.price500g || payload.price1kg || '0',
      image: null,
      isNew: true
    };
    localStorage.setItem('addedProducts', JSON.stringify([...existingProducts, newProduct]));

    // Simulate API call
    setTimeout(() => {
      console.log('Successfully saved MVP product:', payload);
      setIsSaving(false);
      alert(`Product saved! Check console for payload.`);
    }, 800);
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  return (
    <div className="space-y-8 relative pb-20">
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Basic Details Card */}
        <div className="bg-[#F5F0E6] rounded-3xl p-8 shadow-sm h-fit">
          <h2 className="text-[#0E4B32] text-lg font-bold mb-6">Basic Details</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-[130px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Product name</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Input 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-start gap-4">
              <label className="text-sm font-medium text-gray-700 pt-1">Short description</label>
              <Input 
                name="shortDesc" 
                value={formData.shortDesc} 
                onChange={handleInputChange} 
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Variants Card */}
        <div className="bg-[#F5F0E6] rounded-3xl p-8 shadow-sm h-fit">
          <h2 className="text-[#0E4B32] text-lg font-bold mb-6">Pricing & Variants</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-700">250g price</label>
              <Input 
                name="price250g" 
                type="number"
                value={formData.price250g} 
                onChange={handleInputChange} 
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-700">500g price</label>
              <Input 
                name="price500g" 
                type="number"
                value={formData.price500g} 
                onChange={handleInputChange} 
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-700">1kg price</label>
              <Input 
                name="price1kg" 
                type="number"
                value={formData.price1kg} 
                onChange={handleInputChange} 
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Images */}
        <div 
          className="bg-white border border-[#0E4B32]/10 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#C79A3B]"></div>
            <h3 className="text-[#0E4B32] font-bold text-lg">Images</h3>
          </div>
          <p className="text-sm text-gray-500">Required fields</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          {images.length > 0 && (
            <div className="mt-4 text-xs text-[#0E4B32] font-medium bg-[#DDE7D8] px-2 py-1 rounded-md">
              {images.length} images selected
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="bg-white border border-[#0E4B32]/10 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#0E4B32]"></div>
            <h3 className="text-[#0E4B32] font-bold text-lg">Stock</h3>
          </div>
          <p className="text-sm text-gray-500">Required fields</p>
        </div>

        {/* SEO */}
        <div className="bg-white border border-[#0E4B32]/10 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#0E4B32]"></div>
            <h3 className="text-[#0E4B32] font-bold text-lg">SEO</h3>
          </div>
          <p className="text-sm text-gray-500">Required fields</p>
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#C79A3B] hover:bg-[#b08731] text-white font-medium rounded-xl px-8 py-6 h-auto shadow-md"
        >
          {isSaving ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </div>
  );
}
