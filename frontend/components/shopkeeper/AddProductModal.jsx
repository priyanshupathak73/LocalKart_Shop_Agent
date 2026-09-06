'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Tag,
  Package,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Calendar,
  Sparkles,
  Check,
  Eye,
  Loader2,
  Info,
  IndianRupee,
  Plus
} from 'lucide-react';
import API from '../../api/api';

// Categories and dynamic subcategories mapping
const CATEGORY_MAP = {
  'Grocery & Staples': [
    'Pulses & Dals',
    'Atta & Flours',
    'Rice & Rice Products',
    'Edible Oils & Ghee',
    'Spices & Masalas',
    'Salt, Sugar & Jaggery',
    'Dry Fruits & Seeds'
  ],
  'Dairy & Bakery': [
    'Milk & Cream',
    'Paneer & Tofu',
    'Curd & Yogurt',
    'Butter & Ghee',
    'Cheese',
    'Bread & Buns',
    'Cakes & Pastries'
  ],
  'Fruits & Vegetables': [
    'Fresh Vegetables',
    'Fresh Fruits',
    'Leafy Greens',
    'Exotics & Organic',
    'Herbs & Seasonings'
  ],
  'Packaged Food': [
    'Biscuits & Cookies',
    'Snacks & Namkeen',
    'Noodles & Pasta',
    'Breakfast Cereals',
    'Chocolates & Sweets',
    'Sauces & Spreads'
  ],
  'Beverages': [
    'Tea & Coffee',
    'Juices & Drinks',
    'Energy & Soft Drinks',
    'Health Drinks'
  ],
  'Personal Care': [
    'Soaps & Body Wash',
    'Hair Care',
    'Oral Care',
    'Skin Care'
  ],
  'Household Essentials': [
    'Detergents & Cleaners',
    'Dishwash',
    'Pooja Needs',
    'Paper & Tissues'
  ]
};

// Preset demo images for quick testing
const DEMO_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80'
];

export default function AddProductModal({ isOpen = true, onClose, onPublishSuccess, editingProduct = null }) {
  // Active Sidebar Step (1..6)
  const [activeStep, setActiveStep] = useState(1);

  // Form Local State
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    subcategory: '',
    sellingPrice: '',
    mrp: '',
    discount: '',
    stockQuantity: '',
    minStockAlert: '',
    availability: 'In Stock',
    unit: '',
    weightQuantity: '',
    unitType: '',
    expiryDate: '',
    description: '',
  });

  // Images state (max 5)
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        productName: editingProduct.name || '',
        brand: editingProduct.brand || '',
        category: editingProduct.category || '',
        subcategory: editingProduct.subcategory || '',
        sellingPrice: editingProduct.price !== undefined ? editingProduct.price.toString() : '',
        mrp: editingProduct.mrp !== undefined ? editingProduct.mrp.toString() : '',
        discount: '',
        stockQuantity: editingProduct.stock !== undefined ? editingProduct.stock.toString() : '',
        minStockAlert: '',
        availability: editingProduct.isAvailable === false ? 'Out of Stock' : 'In Stock',
        unit: editingProduct.unit || '',
        weightQuantity: '',
        unitType: '',
        expiryDate: '',
        description: editingProduct.description || '',
      });
      setImages(editingProduct.imageUrl ? [editingProduct.imageUrl] : []);
    } else {
      setFormData({
        productName: '',
        brand: '',
        category: '',
        subcategory: '',
        sellingPrice: '',
        mrp: '',
        discount: '',
        stockQuantity: '',
        minStockAlert: '',
        availability: 'In Stock',
        unit: '',
        weightQuantity: '',
        unitType: '',
        expiryDate: '',
        description: '',
      });
      setImages([]);
    }
  }, [editingProduct]);

  // Navigation steps configuration
  const steps = [
    { id: 1, label: 'Basic Information', icon: FileText, desc: 'Name, brand & category' },
    { id: 2, label: 'Pricing', icon: Tag, desc: 'Selling price & MRP' },
    { id: 3, label: 'Inventory', icon: Package, desc: 'Stock level & alert threshold' },
    { id: 4, label: 'Product Details', icon: Sliders, desc: 'Weight, unit & expiry' },
    { id: 5, label: 'Images & Description', icon: ImageIcon, desc: 'Product photos & bio' },
    { id: 6, label: 'Review & Publish', icon: CheckCircle2, desc: 'Preview & final confirmation' },
  ];

  // Calculated discount & validation
  const calculatedDiscount = useMemo(() => {
    const sp = parseFloat(formData.sellingPrice);
    const mrpVal = parseFloat(formData.mrp);
    if (!isNaN(sp) && !isNaN(mrpVal) && mrpVal > 0 && sp <= mrpVal) {
      const disc = Math.round(((mrpVal - sp) / mrpVal) * 100);
      return disc > 0 ? disc : 0;
    }
    return 0;
  }, [formData.sellingPrice, formData.mrp]);

  // Handle Field Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Category reset subcategory logic
      if (name === 'category') {
        updated.subcategory = '';
      }

      // Auto update selling price if MRP & Discount are set manually
      if (name === 'discount') {
        const mrpVal = parseFloat(prev.mrp);
        const discVal = parseFloat(value);
        if (!isNaN(mrpVal) && !isNaN(discVal) && discVal >= 0 && discVal <= 100) {
          const calculatedSP = Math.round(mrpVal - (mrpVal * discVal) / 100);
          updated.sellingPrice = calculatedSP >= 0 ? calculatedSP.toString() : '0';
        }
      }

      // Auto toggle Availability based on Stock Quantity
      if (name === 'stockQuantity') {
        const stockNum = parseInt(value, 10);
        if (!isNaN(stockNum) && stockNum === 0) {
          updated.availability = 'Out of Stock';
        } else if (!isNaN(stockNum) && stockNum > 0 && prev.availability === 'Out of Stock') {
          updated.availability = 'In Stock';
        }
      }

      return updated;
    });

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (fileList) => {
    const validFiles = fileList.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => {
      const combined = [...prev, ...newImageUrls];
      return combined.slice(0, 5);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const loadPresetDemoImages = () => {
    setImages(DEMO_PRESET_IMAGES);
  };

  // Required Fields Check for Publish enablement
  const isValid = useMemo(() => {
    const { productName, category, sellingPrice, stockQuantity } = formData;
    return (
      productName.trim().length >= 2 &&
      category.trim().length > 0 &&
      sellingPrice !== '' &&
      !isNaN(parseFloat(sellingPrice)) &&
      parseFloat(sellingPrice) >= 0 &&
      stockQuantity !== '' &&
      !isNaN(parseInt(stockQuantity, 10)) &&
      parseInt(stockQuantity, 10) >= 0
    );
  }, [formData]);

  // Handle Save Draft
  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  // Handle Publish Product
  const handlePublish = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: formData.productName,
      description: formData.description || '',
      price: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stockQuantity, 10),
      category: formData.category,
      imageUrl: images.length > 0 ? images[0] : '',
      isAvailable: formData.availability === 'In Stock',
    };

    try {
      let res;
      if (editingProduct && editingProduct.id) {
        res = await API.put(`/products/${editingProduct.id}`, payload);
      } else {
        res = await API.post('/products', payload);
      }

      const savedProduct = res.data.data;
      setIsSubmitting(false);
      setShowSuccessModal(true);

      if (onPublishSuccess) {
        onPublishSuccess(savedProduct, !!editingProduct);
      }
    } catch (err) {
      setIsSubmitting(false);
      const errMsg = err.response?.data?.message || err.message || 'Failed to publish product';
      setSubmitError(errMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Main Container Card */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* ========================================================================= */}
        {/* HEADER SECTION                                                           */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 sm:px-8 py-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B] font-bold text-sm">
                eL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Add product details and keep your store updated
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDraftSaved && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#0B5D3B] text-xs font-semibold rounded-full border border-emerald-200 animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> Draft Saved
              </span>
            )}
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE / TABLET HORIZONTAL STEP NAVIGATION                               */}
        {/* ========================================================================= */}
        <div className="lg:hidden bg-gray-50 border-b border-gray-200 px-4 py-3 overflow-x-auto scrollbar-none flex items-center gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                type="button"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0B5D3B] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{step.id}. {step.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* BODY CONTAINER (2 COLUMNS ON DESKTOP)                                    */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row bg-[#F9FAFB]">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR - STEP NAVIGATION (DESKTOP)                                */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-5 space-y-2 shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Form Sections
            </p>
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  type="button"
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-[#0B5D3B]/5 border-l-4 border-[#0B5D3B] text-[#0B5D3B]'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0B5D3B] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-[#0B5D3B]' : 'text-gray-800'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Quick Helper Card */}
            <div className="mt-8 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-[#0B5D3B] text-xs font-semibold mb-1">
                <Info className="w-4 h-4" /> Tip for Sellers
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Add accurate product images and MRP to increase your product visibility by up to 40% on e-LocalKart.
              </p>
            </div>
          </aside>

          {/* ----------------------------------------------------------------------- */}
          {/* MAIN CONTENT FORM AREA                                                  */}
          {/* ----------------------------------------------------------------------- */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
            
            {/* ===================================================================== */}
            {/* 1. BASIC INFORMATION                                                  */}
            {/* ===================================================================== */}
            <section
              id="step-1"
              className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all ${
                activeStep === 1 ? 'border-[#0B5D3B]/40 shadow-md ring-1 ring-[#0B5D3B]/20' : 'border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Basic Information</h3>
                  <p className="text-xs text-gray-500">Essential product details for category discovery</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Product Name * */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Organic Toor Dal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                  />
                  {touched.productName && !formData.productName.trim() && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Product name is required
                    </p>
                  )}
                </div>

                {/* Brand */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Brand <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Tata, Aashirvaad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                  />
                </div>

                {/* Category * */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors bg-white cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {Object.keys(CATEGORY_MAP).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {touched.category && !formData.category && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Please select a category
                    </p>
                  )}
                </div>

                {/* Subcategory * */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors bg-white cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.category ? 'Select subcategory' : 'Select category first'}
                    </option>
                    {formData.category &&
                      CATEGORY_MAP[formData.category]?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                  {touched.subcategory && !formData.subcategory && formData.category && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Please select a subcategory
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ===================================================================== */}
            {/* 2. PRICING                                                            */}
            {/* ===================================================================== */}
            <section
              id="step-2"
              className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all ${
                activeStep === 2 ? 'border-[#0B5D3B]/40 shadow-md ring-1 ring-[#0B5D3B]/20' : 'border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Pricing</h3>
                  <p className="text-xs text-gray-500">Set competitive prices and customer discounts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Selling Price (₹) * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      placeholder="e.g. 120"
                      min="0"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                    />
                  </div>
                </div>

                {/* MRP (₹) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    MRP (₹) <span className="text-gray-400 font-normal">(Maximum Retail Price)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleChange}
                      placeholder="e.g. 150"
                      min="0"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                    />
                  </div>
                </div>

                {/* Discount (%) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={calculatedDiscount > 0 ? calculatedDiscount : formData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-3.5 py-2.5 pr-8 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Automatic Discount Customer View Banner */}
              <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-[#F0FDF4] border border-[#10B981]/30 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-800">
                  <span className="text-gray-600 font-normal">Customers will see:</span>
                  <span className="text-[#0B5D3B] font-bold text-base">
                    ₹{formData.sellingPrice || '120'}
                  </span>
                  {formData.mrp && parseFloat(formData.mrp) > parseFloat(formData.sellingPrice || 0) && (
                    <span className="text-gray-400 line-through text-xs sm:text-sm">
                      MRP ₹{formData.mrp}
                    </span>
                  )}
                  {calculatedDiscount > 0 && (
                    <span className="ml-1 text-[#0B5D3B] font-bold text-xs sm:text-sm bg-[#10B981]/15 px-2 py-0.5 rounded-md">
                      ({calculatedDiscount}% OFF)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#0B5D3B]/80 italic">Auto-calculated</span>
              </div>
            </section>

            {/* ===================================================================== */}
            {/* 3. INVENTORY                                                          */}
            {/* ===================================================================== */}
            <section
              id="step-3"
              className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all ${
                activeStep === 3 ? 'border-[#0B5D3B]/40 shadow-md ring-1 ring-[#0B5D3B]/20' : 'border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Inventory</h3>
                  <p className="text-xs text-gray-500">Manage stock count and low-stock alerts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Stock Quantity * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                  />
                </div>

                {/* Minimum Stock Alert */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Minimum Stock Alert
                  </label>
                  <input
                    type="number"
                    name="minStockAlert"
                    value={formData.minStockAlert}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                  />
                </div>

                {/* Availability Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Availability <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors bg-white cursor-pointer"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* ===================================================================== */}
            {/* 4. PRODUCT DETAILS                                                    */}
            {/* ===================================================================== */}
            <section
              id="step-4"
              className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all ${
                activeStep === 4 ? 'border-[#0B5D3B]/40 shadow-md ring-1 ring-[#0B5D3B]/20' : 'border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Product Details</h3>
                  <p className="text-xs text-gray-500">Weight, measurement units and shelf life</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Unit / Weight * */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Unit / Weight <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors bg-white cursor-pointer"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">kg (Kilogram)</option>
                    <option value="g">g (Gram)</option>
                    <option value="L">L (Litre)</option>
                    <option value="ml">ml (Millilitre)</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="packet">packet</option>
                    <option value="box">box</option>
                  </select>
                </div>

                {/* Weight / Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Weight / Quantity
                  </label>
                  <input
                    type="text"
                    name="weightQuantity"
                    value={formData.weightQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors"
                  />
                </div>

                {/* Unit Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Unit Type
                  </label>
                  <select
                    name="unitType"
                    value={formData.unitType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors bg-white cursor-pointer"
                  >
                    <option value="">Select type</option>
                    <option value="Standard Pack">Standard Pack</option>
                    <option value="Loose / By Weight">Loose / By Weight</option>
                    <option value="Multipack">Multipack</option>
                    <option value="Combo Box">Combo Box</option>
                  </select>
                </div>

                {/* Expiry Date (Optional) */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Expiry Date <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors bg-white"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ===================================================================== */}
            {/* 5. PRODUCT IMAGES & DESCRIPTION                                       */}
            {/* ===================================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Product Images Uploader */}
              <section
                id="step-5"
                className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all ${
                  activeStep === 5 ? 'border-[#0B5D3B]/40 shadow-md ring-1 ring-[#0B5D3B]/20' : 'border-gray-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Product Images <span className="text-red-500">*</span></h3>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Up to 5 images</span>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    dragOver
                      ? 'border-[#0B5D3B] bg-[#F0FDF4]'
                      : 'border-emerald-200 bg-[#F9FAFB] hover:bg-[#F0FDF4]/40 hover:border-[#10B981]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#0B5D3B]/10 text-[#0B5D3B] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Drag & drop images here
                  </p>
                  <p className="text-xs text-[#0B5D3B] font-medium mt-0.5">
                    or click to browse
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    JPG, PNG or WEBP (Max 5MB)
                  </p>
                </div>

                {/* Preset Demo Images Quick Load */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={loadPresetDemoImages}
                    className="text-xs font-semibold text-[#0B5D3B] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Insert Demo Images
                  </button>
                  <span className="text-xs text-gray-400">{images.length}/5 uploaded</span>
                </div>

                {/* Thumbnails Grid */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Product thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#0B5D3B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-[#0B5D3B] hover:border-[#0B5D3B] hover:bg-emerald-50/50 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* Description Section */}
              <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      Description <span className="text-gray-400 font-normal">(Optional)</span>
                    </h3>
                  </div>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={300}
                    rows={5}
                    placeholder="Describe your product, quality, benefits, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <span>Clear and detailed descriptions build buyer trust.</span>
                  <span className={formData.description.length >= 280 ? 'text-amber-600 font-bold' : ''}>
                    {formData.description.length}/300 characters
                  </span>
                </div>
              </section>
            </div>

            {/* ===================================================================== */}
            {/* 6. LIVE PRODUCT PREVIEW CARD                                          */}
            {/* ===================================================================== */}
            <section
              id="step-6"
              className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all ${
                activeStep === 6 ? 'border-[#0B5D3B]/40 shadow-md ring-1 ring-[#0B5D3B]/20' : 'border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <div className="p-2 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Live Product Preview</h3>
                  <p className="text-xs text-gray-500">How your product card will look on e-LocalKart customer app</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50/80 p-4 sm:p-6 rounded-xl border border-gray-200">
                {/* Product Card Mockup */}
                <div className="w-full sm:w-64 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
                  <div className="relative aspect-4/3 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        <ImageIcon className="w-10 h-10 mx-auto mb-1 opacity-40" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}
                    {calculatedDiscount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#0B5D3B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {calculatedDiscount}% OFF
                      </span>
                    )}
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      formData.availability === 'Out of Stock'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-[#0B5D3B]'
                    }`}>
                      {formData.availability}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <p className="text-[11px] text-[#0B5D3B] font-semibold tracking-wide uppercase">
                      {formData.category || 'Category'} {formData.subcategory ? `• ${formData.subcategory}` : ''}
                    </p>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {formData.productName || 'Organic Toor Dal'}
                    </h4>
                    {formData.brand && (
                      <p className="text-xs text-gray-400 font-medium">{formData.brand}</p>
                    )}
                    
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-extrabold text-gray-900">
                        ₹{formData.sellingPrice || '120'}
                      </span>
                      {formData.mrp && parseFloat(formData.mrp) > parseFloat(formData.sellingPrice || 0) && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{formData.mrp}
                        </span>
                      )}
                      {formData.weightQuantity && formData.unit && (
                        <span className="ml-auto text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                          {formData.weightQuantity} {formData.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary Info list */}
                <div className="flex-1 space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Product Title:</span>
                    <span className="font-medium text-gray-900">{formData.productName || 'Not entered'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Category / Subcategory:</span>
                    <span className="font-medium text-gray-900">
                      {formData.category || '-'} {formData.subcategory ? `/ ${formData.subcategory}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Selling Price & MRP:</span>
                    <span className="font-medium text-gray-900">
                      ₹{formData.sellingPrice || '0'} {formData.mrp ? `(MRP ₹${formData.mrp})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Initial Stock:</span>
                    <span className="font-medium text-gray-900">{formData.stockQuantity || '0'} units</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-gray-700">Images Attached:</span>
                    <span className="font-medium text-gray-900">{images.length} photo(s)</span>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ACTIONS BAR                                                        */}
        {/* ========================================================================= */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 px-5 sm:px-8 py-4 flex items-center justify-between shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {submitError && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                {submitError}
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 rounded-xl border border-emerald-200 text-sm font-semibold text-[#0B5D3B] bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Save Draft
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={!isValid || isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 ${
                isValid && !isSubmitting
                  ? 'bg-[#0B5D3B] hover:bg-[#08482e] shadow-md hover:shadow-lg active:scale-98 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-75'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{editingProduct ? 'Updating...' : 'Publishing...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION MODAL                                                */}
      {/* ========================================================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-100 animate-scaleUp">
            <div className="w-14 h-14 bg-emerald-100 text-[#0B5D3B] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Product Published!</h3>
              <p className="text-xs text-gray-500 mt-1">
                <strong>{formData.productName}</strong> has been added to your store inventory on e-LocalKart.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                if (onClose) onClose();
              }}
              className="w-full py-2.5 bg-[#0B5D3B] hover:bg-[#08482e] text-white font-bold text-sm rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
