import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Clock, 
  FileText, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface SupplyChain {
  suppliers: string[]; // Dodávatelia
  minimumOrder: number; // Minimálne množstvo
  deliveryTime: number; // Čas dodania v dňoch
  storageInstructions: string; // Inštrukcie skladovania
  shelfLife: number; // Trvanlivosť v dňoch
  backupSuppliers: string[]; // Náhradní dodávatelia
}

interface SupplyChainToolProps {
  supplyChain?: SupplyChain;
  onSave: (supplyChain: SupplyChain) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function SupplyChainTool({ 
  supplyChain, 
  onSave, 
  isEditing = false,
  onEdit,
  onCancel 
}: SupplyChainToolProps) {
  const [formData, setFormData] = useState<SupplyChain>({
    suppliers: supplyChain?.suppliers || [],
    minimumOrder: supplyChain?.minimumOrder || 10,
    deliveryTime: supplyChain?.deliveryTime || 2,
    storageInstructions: supplyChain?.storageInstructions || '',
    shelfLife: supplyChain?.shelfLife || 7,
    backupSuppliers: supplyChain?.backupSuppliers || []
  });

  const [newSupplier, setNewSupplier] = useState('');
  const [newBackupSupplier, setNewBackupSupplier] = useState('');

  const handleInputChange = (field: keyof SupplyChain, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSupplier = () => {
    if (newSupplier.trim()) {
      setFormData(prev => ({
        ...prev,
        suppliers: [...prev.suppliers, newSupplier.trim()]
      }));
      setNewSupplier('');
    }
  };

  const removeSupplier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter((_, i) => i !== index)
    }));
  };

  const addBackupSupplier = () => {
    if (newBackupSupplier.trim()) {
      setFormData(prev => ({
        ...prev,
        backupSuppliers: [...prev.backupSuppliers, newBackupSupplier.trim()]
      }));
      setNewBackupSupplier('');
    }
  };

  const removeBackupSupplier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      backupSuppliers: prev.backupSuppliers.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getDeliveryTimeColor = (days: number) => {
    if (days <= 1) return 'text-green-600';
    if (days <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getShelfLifeColor = (days: number) => {
    if (days >= 14) return 'text-green-600';
    if (days >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Supply Chain</h3>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Order */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900">Minimum Order</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                {formData.minimumOrder}
              </span>
              <span className="text-gray-500">units</span>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Delivery Time</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getDeliveryTimeColor(formData.deliveryTime)}`}>
                {formData.deliveryTime}
              </span>
              <span className="text-gray-500">days</span>
            </div>
          </div>

          {/* Shelf Life */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium text-gray-900">Shelf Life</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getShelfLifeColor(formData.shelfLife)}`}>
                {formData.shelfLife}
              </span>
              <span className="text-gray-500">days</span>
            </div>
          </div>

          {/* Storage Instructions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium text-gray-900">Storage Instructions</h4>
            </div>
            <p className="text-gray-700 text-sm">
              {formData.storageInstructions || 'No instructions provided'}
            </p>
          </div>
        </div>

        {/* Suppliers */}
        {formData.suppliers.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Primary Suppliers</h4>
            <div className="space-y-2">
              {formData.suppliers.map((supplier, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <span className="text-blue-800 font-medium">{supplier}</span>
                  <span className="text-blue-600 text-sm">Primary</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backup Suppliers */}
        {formData.backupSuppliers.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Backup Suppliers</h4>
            <div className="space-y-2">
              {formData.backupSuppliers.map((supplier, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <span className="text-yellow-800 font-medium">{supplier}</span>
                  <span className="text-yellow-600 text-sm">Backup</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning if no suppliers */}
        {formData.suppliers.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">No suppliers configured</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Add suppliers to ensure reliable ingredient sourcing.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Edit Supply Chain</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minimum Order */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Minimum Order (units)
          </label>
          <input
            type="number"
            min="1"
            value={formData.minimumOrder}
            onChange={(e) => handleInputChange('minimumOrder', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Delivery Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Delivery Time (days)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.deliveryTime}
            onChange={(e) => handleInputChange('deliveryTime', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Shelf Life */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Shelf Life (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.shelfLife}
            onChange={(e) => handleInputChange('shelfLife', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Storage Instructions */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Storage Instructions
        </label>
        <textarea
          value={formData.storageInstructions}
          onChange={(e) => handleInputChange('storageInstructions', e.target.value)}
          rows={3}
          placeholder="Enter storage instructions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Primary Suppliers */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Primary Suppliers
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSupplier}
            onChange={(e) => setNewSupplier(e.target.value)}
            placeholder="Add supplier name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addSupplier}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.suppliers.length > 0 && (
          <div className="space-y-2">
            {formData.suppliers.map((supplier, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <span className="text-blue-800 font-medium">{supplier}</span>
                <button
                  onClick={() => removeSupplier(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backup Suppliers */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Backup Suppliers
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newBackupSupplier}
            onChange={(e) => setNewBackupSupplier(e.target.value)}
            placeholder="Add backup supplier name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addBackupSupplier}
            className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.backupSuppliers.length > 0 && (
          <div className="space-y-2">
            {formData.backupSuppliers.map((supplier, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <span className="text-yellow-800 font-medium">{supplier}</span>
                <button
                  onClick={() => removeBackupSupplier(index)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
