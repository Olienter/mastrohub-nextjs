import React, { useState } from 'react';
import { ChefHat, Clock, Thermometer, Utensils, Edit3, Save, X } from 'lucide-react';

interface ChefManual {
  equipment: string[];
  substitutions: string[];
  garnishing: string;
  servingTemperature: 'hot' | 'warm' | 'cold';
  portionSizes: {
    small: number;
    medium: number;
    large: number;
  };
  qualityNotes: string;
  timingNotes: string;
}

interface ChefToolProps {
  chefManual?: ChefManual;
  onSave: (chefManual: ChefManual) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function ChefTool({ 
  chefManual, 
  onSave, 
  isEditing = false, 
  onEdit, 
  onCancel 
}: ChefToolProps) {
  const [formData, setFormData] = useState<ChefManual>({
    equipment: chefManual?.equipment || [],
    substitutions: chefManual?.substitutions || [],
    garnishing: chefManual?.garnishing || '',
    servingTemperature: chefManual?.servingTemperature || 'hot',
    portionSizes: chefManual?.portionSizes || { small: 0, medium: 0, large: 0 },
    qualityNotes: chefManual?.qualityNotes || '',
    timingNotes: chefManual?.timingNotes || ''
  });

  const [newEquipment, setNewEquipment] = useState('');
  const [newSubstitution, setNewSubstitution] = useState('');

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const addSubstitution = () => {
    if (newSubstitution.trim()) {
      setFormData(prev => ({
        ...prev,
        substitutions: [...prev.substitutions, newSubstitution.trim()]
      }));
      setNewSubstitution('');
    }
  };

  const removeSubstitution = (index: number) => {
    setFormData(prev => ({
      ...prev,
      substitutions: prev.substitutions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isEditing && chefManual) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Chef Manual</h3>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Equipment */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Kitchen Equipment</h4>
            <div className="flex flex-wrap gap-2">
              {chefManual.equipment.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Substitutions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Substitutions</h4>
            <div className="flex flex-wrap gap-2">
              {chefManual.substitutions.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Garnishing */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Garnishing</h4>
            <p className="text-gray-700">{chefManual.garnishing}</p>
          </div>

          {/* Serving Temperature */}
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span className="font-medium text-gray-900">Serving Temperature:</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm capitalize">
              {chefManual.servingTemperature}
            </span>
          </div>

          {/* Portion Sizes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Portion Sizes (g)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <span className="text-sm text-gray-600">Small</span>
                <div className="font-semibold text-gray-900">{chefManual.portionSizes.small}</div>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600">Medium</span>
                <div className="font-semibold text-gray-900">{chefManual.portionSizes.medium}</div>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600">Large</span>
                <div className="font-semibold text-gray-900">{chefManual.portionSizes.large}</div>
              </div>
            </div>
          </div>

          {/* Quality Notes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Quality Notes</h4>
            <p className="text-gray-700">{chefManual.qualityNotes}</p>
          </div>

          {/* Timing Notes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Timing Notes</h4>
            <p className="text-gray-700">{chefManual.timingNotes}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Chef Manual</h3>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Equipment */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Kitchen Equipment</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              placeholder="Add equipment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
            />
            <button
              onClick={addEquipment}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.equipment.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeEquipment(index)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Substitutions */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Substitutions</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSubstitution}
              onChange={(e) => setNewSubstitution(e.target.value)}
              placeholder="Add substitution..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addSubstitution()}
            />
            <button
              onClick={addSubstitution}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.substitutions.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeSubstitution(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Garnishing */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Garnishing</label>
          <textarea
            value={formData.garnishing}
            onChange={(e) => setFormData(prev => ({ ...prev, garnishing: e.target.value }))}
            placeholder="Describe the garnishing..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
        </div>

        {/* Serving Temperature */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Serving Temperature</label>
          <select
            value={formData.servingTemperature}
            onChange={(e) => setFormData(prev => ({ ...prev, servingTemperature: e.target.value as 'hot' | 'warm' | 'cold' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
        </div>

        {/* Portion Sizes */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Portion Sizes (g)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Small</label>
              <input
                type="number"
                value={formData.portionSizes.small}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  portionSizes: { ...prev.portionSizes, small: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Medium</label>
              <input
                type="number"
                value={formData.portionSizes.medium}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  portionSizes: { ...prev.portionSizes, medium: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Large</label>
              <input
                type="number"
                value={formData.portionSizes.large}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  portionSizes: { ...prev.portionSizes, large: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Quality Notes */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Quality Notes</label>
          <textarea
            value={formData.qualityNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, qualityNotes: e.target.value }))}
            placeholder="Add quality notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
        </div>

        {/* Timing Notes */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Timing Notes</label>
          <textarea
            value={formData.timingNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, timingNotes: e.target.value }))}
            placeholder="Add timing notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
