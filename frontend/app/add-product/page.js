'use client';

import React, { useState } from 'react';
import AddProductModal from '../../components/shopkeeper/AddProductModal';

export default function AddProductPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!isOpen && (
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Modal Closed</h2>
          <p className="text-sm text-gray-500 mb-4">Click below to reopen the Add New Product modal</p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2.5 bg-[#0B5D3B] text-white font-bold rounded-xl shadow hover:bg-[#08482e] transition-colors"
          >
            Open Add New Product Modal
          </button>
        </div>
      )}

      {isOpen && (
        <AddProductModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onPublishSuccess={(data) => {
            console.log('Product Published Data:', data);
          }}
        />
      )}
    </div>
  );
}
