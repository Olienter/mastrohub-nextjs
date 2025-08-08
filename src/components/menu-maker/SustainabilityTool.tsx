import React, { useState } from 'react';
import { 
  Leaf, 
  Globe, 
  Recycle, 
  TreePine, 
  Sprout,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Award
} from 'lucide-react';

interface Sustainability {
  localIngredients: string[]; // Lokálne ingrediencie
  organicIngredients: string[]; // Bio ingrediencie
  wasteReduction: string; // Minimalizácia odpadu
  carbonFootprint: number; // Ekologická stopa
  seasonalAvailability: string[]; // Sezónna dostupnosť
}

interface SustainabilityToolProps {
  sustainability?: Sustainability;
  onSave: (sustainability: Sustainability) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function SustainabilityTool({ 
  sustainability, 
  onSave, 
  isEditing = false,
  onEdit,
  onCancel 
}: SustainabilityToolProps) {
  const [formData, setFormData] = useState<Sustainability>({
    localIngredients: sustainability?.localIngredients || [],
    organicIngredients: sustainability?.organicIngredients || [],
    wasteReduction: sustainability?.wasteReduction || '',
    carbonFootprint: sustainability?.carbonFootprint || 0,
    seasonalAvailability: sustainability?.seasonalAvailability || []
  });

  const [newLocalIngredient, setNewLocalIngredient] = useState('');
  const [newOrganicIngredient, setNewOrganicIngredient] = useState('');
  const [newSeasonalItem, setNewSeasonalItem] = useState('');

  const handleInputChange = (field: keyof Sustainability, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLocalIngredient = () => {
    if (newLocalIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        localIngredients: [...prev.localIngredients, newLocalIngredient.trim()]
      }));
      setNewLocalIngredient('');
    }
  };

  const removeLocalIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      localIngredients: prev.localIngredients.filter((_, i) => i !== index)
    }));
  };

  const addOrganicIngredient = () => {
    if (newOrganicIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        organicIngredients: [...prev.organicIngredients, newOrganicIngredient.trim()]
      }));
      setNewOrganicIngredient('');
    }
  };

  const removeOrganicIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      organicIngredients: prev.organicIngredients.filter((_, i) => i !== index)
    }));
  };

  const addSeasonalItem = () => {
    if (newSeasonalItem.trim()) {
      setFormData(prev => ({
        ...prev,
        seasonalAvailability: [...prev.seasonalAvailability, newSeasonalItem.trim()]
      }));
      setNewSeasonalItem('');
    }
  };

  const removeSeasonalItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seasonalAvailability: prev.seasonalAvailability.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getCarbonFootprintColor = (footprint: number) => {
    if (footprint <= 2) return 'text-green-600';
    if (footprint <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSustainabilityScore = () => {
    let score = 0;
    if (formData.localIngredients.length > 0) score += 25;
    if (formData.organicIngredients.length > 0) score += 25;
    if (formData.wasteReduction) score += 25;
    if (formData.carbonFootprint <= 3) score += 25;
    return score;
  };

  const sustainabilityScore = getSustainabilityScore();

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Sustainability</h3>
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

        {/* Sustainability Score */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-green-600" />
              <h4 className="text-lg font-semibold text-green-800">Sustainability Score</h4>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-green-600">{sustainabilityScore}%</span>
              <div className="text-sm text-green-700">Eco-Friendly</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${sustainabilityScore}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carbon Footprint */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900">Carbon Footprint</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getCarbonFootprintColor(formData.carbonFootprint)}`}>
                {formData.carbonFootprint}
              </span>
              <span className="text-gray-500">kg CO2</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {formData.carbonFootprint <= 2 ? 'Excellent' : 
               formData.carbonFootprint <= 5 ? 'Good' : 'Needs improvement'}
            </div>
          </div>

          {/* Local Ingredients Count */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TreePine className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Local Ingredients</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                {formData.localIngredients.length}
              </span>
              <span className="text-gray-500">items</span>
            </div>
          </div>

          {/* Organic Ingredients Count */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Sprout className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Organic Ingredients</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                {formData.organicIngredients.length}
              </span>
              <span className="text-gray-500">items</span>
            </div>
          </div>

          {/* Seasonal Availability */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Recycle className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium text-gray-900">Seasonal Items</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-600">
                {formData.seasonalAvailability.length}
              </span>
              <span className="text-gray-500">items</span>
            </div>
          </div>
        </div>

        {/* Waste Reduction */}
        {formData.wasteReduction && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Waste Reduction Strategy</h4>
            <p className="text-gray-700 text-sm">
              {formData.wasteReduction}
            </p>
          </div>
        )}

        {/* Local Ingredients */}
        {formData.localIngredients.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Local Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {formData.localIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Organic Ingredients */}
        {formData.organicIngredients.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Organic Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {formData.organicIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Availability */}
        {formData.seasonalAvailability.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Seasonal Availability</h4>
            <div className="flex flex-wrap gap-2">
              {formData.seasonalAvailability.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Edit Sustainability</h3>
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

      {/* Carbon Footprint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Carbon Footprint (kg CO2)
        </label>
        <input
          type="number"
          min="0"
          max="20"
          step="0.1"
          value={formData.carbonFootprint}
          onChange={(e) => handleInputChange('carbonFootprint', parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-500">
          Lower values indicate better environmental impact
        </div>
      </div>

      {/* Waste Reduction */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Waste Reduction Strategy
        </label>
        <textarea
          value={formData.wasteReduction}
          onChange={(e) => handleInputChange('wasteReduction', e.target.value)}
          rows={3}
          placeholder="Describe your waste reduction strategies..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Local Ingredients */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Local Ingredients
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newLocalIngredient}
            onChange={(e) => setNewLocalIngredient(e.target.value)}
            placeholder="Add local ingredient..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addLocalIngredient}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.localIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.localIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full"
              >
                <span className="text-sm">{ingredient}</span>
                <button
                  onClick={() => removeLocalIngredient(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Organic Ingredients */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Organic Ingredients
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newOrganicIngredient}
            onChange={(e) => setNewOrganicIngredient(e.target.value)}
            placeholder="Add organic ingredient..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addOrganicIngredient}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.organicIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.organicIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                <span className="text-sm">{ingredient}</span>
                <button
                  onClick={() => removeOrganicIngredient(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seasonal Availability */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Seasonal Availability
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSeasonalItem}
            onChange={(e) => setNewSeasonalItem(e.target.value)}
            placeholder="Add seasonal item..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addSeasonalItem}
            className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.seasonalAvailability.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.seasonalAvailability.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full"
              >
                <span className="text-sm">{item}</span>
                <button
                  onClick={() => removeSeasonalItem(index)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sustainability Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Sustainability Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-700">Local Ingredients:</span>
            <span className="ml-2 font-medium text-green-900">{formData.localIngredients.length}</span>
          </div>
          <div>
            <span className="text-green-700">Organic Ingredients:</span>
            <span className="ml-2 font-medium text-green-900">{formData.organicIngredients.length}</span>
          </div>
          <div>
            <span className="text-green-700">Carbon Footprint:</span>
            <span className={`ml-2 font-medium ${getCarbonFootprintColor(formData.carbonFootprint)}`}>
              {formData.carbonFootprint} kg CO2
            </span>
          </div>
          <div>
            <span className="text-green-700">Sustainability Score:</span>
            <span className="ml-2 font-medium text-green-900">{sustainabilityScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
