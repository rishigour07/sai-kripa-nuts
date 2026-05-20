import React, { useState, useRef, useEffect } from 'react';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';
import { safeReadJSON, safeWriteJSON } from '../../utils/storage';

export default function AddProduct() {
  const [isSaving, setIsSaving] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shortDesc: '',
    price250g: '',
    price500g: '',
    price1kg: '',
    stock: '',
    seoTitle: '',
    seoDescription: '',
  });

  const [images, setImages] = useState([]); // { file, preview }
  const fileInputRef = useRef(null);
  const { showToast } = useCart();
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              file,
              preview: reader.result,
              dataUrl: reader.result,
              name: file.name,
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed && removed.preview) URL.revokeObjectURL(removed.preview);
      return copy;
    });
  };

  const validate = () => {
    const err = {};
    if (!formData.name?.trim()) err.name = 'Please enter product name';
    if (!formData.category?.trim()) err.category = 'Please enter category';
    if (!formData.shortDesc?.trim()) err.shortDesc = 'Please enter description';
    if (!formData.price250g && !formData.price500g && !formData.price1kg) err.price = 'Please enter at least one price';
    if (!formData.stock) err.stock = 'Please enter stock quantity';
    if (images.length === 0) err.images = 'Please upload at least one image';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast('Please fix validation errors');
      return;
    }

    setIsSaving(true);

    // For demo: convert images to simple preview URLs and names
    const imageUrls = images.map((it) => it.dataUrl || it.preview || it.file?.name);
    const primaryImage = imageUrls[0] || '/placeholder-product.jpg';

    const prices = {
      price250: Number(formData.price250g) || 0,
      price500: Number(formData.price500g) || 0,
      price1000: Number(formData.price1kg) || 0,
    };

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.shortDesc,
      image: primaryImage,
      images: imageUrls,
      prices,
      stock: Number(formData.stock) || 0,
      seo: { title: formData.seoTitle, description: formData.seoDescription },
      createdAt: new Date().toISOString(),
    };

    try {
      // Attempt to POST to API route if available (for Next.js or server)
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // ignore network errors in CRA demo environment
      });

      // Save to local storage as fallback/demo
      const existing = safeReadJSON('addedProducts', []);
      const saved = {
        id: Date.now(),
        ...payload,
        shortDesc: payload.description,
        isNew: true,
      };
      safeWriteJSON('addedProducts', [...existing, saved]);

      showToast('Product added successfully');
      // Reset form
      setFormData({ name: '', category: '', shortDesc: '', price250g: '', price500g: '', price1kg: '', stock: '', seoTitle: '', seoDescription: '' });
      setImages([]);
      setErrors({});
    } catch (err) {
      console.error('Error saving product', err);
      showToast('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image?.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });
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
                placeholder="e.g. Royal Kaju W320"
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
              {errors.name && <div className="text-xs text-red-600">{errors.name}</div>}
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Signature"
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0 h-8"
              />
              {errors.category && <div className="text-xs text-red-600">{errors.category}</div>}
            </div>
            <div className="grid grid-cols-[130px_1fr] items-start gap-4">
              <label className="text-sm font-medium text-gray-700 pt-1">Short description</label>
              <Textarea
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleInputChange}
                placeholder="Short product description"
                className="bg-transparent border-0 border-b border-[#0E4B32]/20 rounded-none focus-visible:ring-0 focus-visible:border-[#0E4B32] px-0"
              />
              {errors.shortDesc && <div className="text-xs text-red-600">{errors.shortDesc}</div>}
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
            {errors.price && <div className="text-xs text-red-600">{errors.price}</div>}
          </div>
        </div>

      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Images */}
        <div className="bg-white border border-[#0E4B32]/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#C79A3B]"></div>
            <h3 className="text-[#0E4B32] font-bold text-lg">Images</h3>
          </div>
          <p className="text-sm text-gray-500">Required fields</p>
          <div className="mt-4 flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <Button onClick={() => fileInputRef.current?.click()} className="px-4 py-2">Upload Images</Button>
            <div className="text-xs text-[#0E4B32] font-medium bg-[#DDE7D8] px-2 py-1 rounded-md">
              {images.length} images selected
            </div>
          </div>
          {errors.images && <div className="mt-2 text-xs text-red-600">{errors.images}</div>}

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded overflow-hidden">
                  <img src={img.preview} alt={`preview-${idx}`} className="h-24 w-full object-cover" />
                  <button onClick={() => handleRemoveImage(idx)} className="absolute right-1 top-1 rounded-full bg-white p-1">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        

        {/* Stock */}
        <div className="bg-white border border-[#0E4B32]/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#0E4B32]"></div>
            <h3 className="text-[#0E4B32] font-bold text-lg">Stock</h3>
          </div>
          <p className="text-sm text-gray-500">Required fields</p>
          <div className="mt-4">
            <Input name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" />
            {errors.stock && <div className="text-xs text-red-600">{errors.stock}</div>}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-[#0E4B32]/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#0E4B32]"></div>
            <h3 className="text-[#0E4B32] font-bold text-lg">SEO</h3>
          </div>
          <p className="text-sm text-gray-500">Optional</p>
          <div className="mt-4 space-y-3">
            <Input name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} placeholder="SEO title" />
            <Textarea name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} placeholder="SEO description" />
          </div>
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
