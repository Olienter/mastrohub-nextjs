import React, { useState } from 'react';
import { 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Percent,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface Financial {
  ingredientCosts: number; // Náklady na ingrediencie
  laborCosts: number; // Pracovné náklady
  margin: number; // Marža v %
  pricingStrategy: string; // Cenová stratégia
  competitorPrices: number[]; // Konkurenčné ceny
  seasonalPriceChanges: string[]; // Sezónne zmeny cien
}

interface FinancialToolProps {
  financial?: Financial;
  onSave: (financial: Financial) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function FinancialTool({ 
  financial, 
  onSave, 
  isEditing = false,
  onEdit,
  onCancel 
}: FinancialToolProps) {
  const [formData, setFormData] = useState<Financial>({
    ingredientCosts: financial?.ingredientCosts || 0,
    laborCosts: financial?.laborCosts || 0,
    margin: financial?.margin || 30,
    pricingStrategy: financial?.pricingStrategy || '',
    competitorPrices: financial?.competitorPrices || [],
    seasonalPriceChanges: financial?.seasonalPriceChanges || []
  });

  const [newCompetitorPrice, setNewCompetitorPrice] = useState('');
  const [newSeasonalChange, setNewSeasonalChange] = useState('');

  const handleInputChange = (field: keyof Financial, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCompetitorPrice = () => {
    if (newCompetitorPrice.trim()) {
      const price = parseFloat(newCompetitorPrice);
      if (!isNaN(price)) {
        setFormData(prev => ({
          ...prev,
          competitorPrices: [...prev.competitorPrices, price]
        }));
        setNewCompetitorPrice('');
      }
    }
  };

  const removeCompetitorPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      competitorPrices: prev.competitorPrices.filter((_, i) => i !== index)
    }));
  };

  const addSeasonalChange = () => {
    if (newSeasonalChange.trim()) {
      setFormData(prev => ({
        ...prev,
        seasonalPriceChanges: [...prev.seasonalPriceChanges, newSeasonalChange.trim()]
      }));
      setNewSeasonalChange('');
    }
  };

  const removeSeasonalChange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seasonalPriceChanges: prev.seasonalPriceChanges.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const totalCosts = formData.ingredientCosts + formData.laborCosts;
  const suggestedPrice = totalCosts / (1 - formData.margin / 100);
  const averageCompetitorPrice = formData.competitorPrices.length > 0 
    ? formData.competitorPrices.reduce((a, b) => a + b, 0) / formData.competitorPrices.length 
    : 0;

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return 'text-green-600';
    if (margin >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriceComparisonColor = (ourPrice: number, avgCompetitor: number) => {
    if (avgCompetitor === 0) return 'text-gray-600';
    if (ourPrice < avgCompetitor * 0.9) return 'text-green-600';
    if (ourPrice > avgCompetitor * 1.1) return 'text-red-600';
    return 'text-yellow-600';
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Financial</h3>
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
          {/* Ingredient Costs */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900">Ingredient Costs</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                ${formData.ingredientCosts.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Labor Costs */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium text-gray-900">Labor Costs</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-600">
                ${formData.laborCosts.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Total Costs */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-gray-900">Total Costs</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-600">
                ${totalCosts.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Margin */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Percent className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Profit Margin</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getMarginColor(formData.margin)}`}>
                {formData.margin}%
              </span>
            </div>
          </div>

          {/* Suggested Price */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Suggested Price</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                ${suggestedPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Average Competitor Price */}
          {averageCompetitorPrice > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium text-gray-900">Avg. Competitor Price</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getPriceComparisonColor(suggestedPrice, averageCompetitorPrice)}`}>
                  ${averageCompetitorPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Strategy */}
        {formData.pricingStrategy && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Pricing Strategy</h4>
            <p className="text-gray-700 text-sm">
              {formData.pricingStrategy}
            </p>
          </div>
        )}

        {/* Competitor Prices */}
        {formData.competitorPrices.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Competitor Prices</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.competitorPrices.map((price, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded-lg text-center"
                >
                  <span className="font-medium text-gray-900">${price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Price Changes */}
        {formData.seasonalPriceChanges.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Seasonal Price Changes</h4>
            <div className="flex flex-wrap gap-2">
              {formData.seasonalPriceChanges.map((change, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {change}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Warning if no pricing strategy */}
        {!formData.pricingStrategy && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">No pricing strategy defined</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Define a pricing strategy to optimize profitability.
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
          <DollarSign className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Edit Financial</h3>
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
        {/* Ingredient Costs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ingredient Costs ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.ingredientCosts}
            onChange={(e) => handleInputChange('ingredientCosts', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Labor Costs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Labor Costs ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.laborCosts}
            onChange={(e) => handleInputChange('laborCosts', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profit Margin (%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.margin}
            onChange={(e) => handleInputChange('margin', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span className="font-medium">{formData.margin}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Pricing Strategy */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Pricing Strategy
        </label>
        <textarea
          value={formData.pricingStrategy}
          onChange={(e) => handleInputChange('pricingStrategy', e.target.value)}
          rows={3}
          placeholder="Describe your pricing strategy..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Competitor Prices */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Competitor Prices ($)
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={newCompetitorPrice}
            onChange={(e) => setNewCompetitorPrice(e.target.value)}
            placeholder="Add competitor price..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCompetitorPrice}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.competitorPrices.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {formData.competitorPrices.map((price, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">${price.toFixed(2)}</span>
                <button
                  onClick={() => removeCompetitorPrice(index)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seasonal Price Changes */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Seasonal Price Changes
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSeasonalChange}
            onChange={(e) => setNewSeasonalChange(e.target.value)}
            placeholder="Add seasonal price change..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addSeasonalChange}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.seasonalPriceChanges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.seasonalPriceChanges.map((change, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full"
              >
                <span className="text-sm">{change}</span>
                <button
                  onClick={() => removeSeasonalChange(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Financial Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Costs:</span>
            <span className="ml-2 font-medium text-blue-900">${totalCosts.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-700">Suggested Price:</span>
            <span className="ml-2 font-medium text-blue-900">${suggestedPrice.toFixed(2)}</span>
          </div>
          {averageCompetitorPrice > 0 && (
            <div>
              <span className="text-blue-700">Avg. Competitor:</span>
            <span className={`ml-2 font-medium ${getPriceComparisonColor(suggestedPrice, averageCompetitorPrice)}`}>
                ${averageCompetitorPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
