import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Star, 
  Users, 
  Clock, 
  Target,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

interface Analytics {
  popularity: number; // Popularita (1-100)
  profitability: number; // Ziskovosť v %
  seasonalTrends: string[]; // Sezónne trendy
  customerRatings: number; // Priemerné hodnotenie
  returnRate: number; // Návratnosť zákazníkov
  preparationEfficiency: number; // Efektivita prípravy
}

interface AnalyticsToolProps {
  analytics?: Analytics;
  onSave: (analytics: Analytics) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function AnalyticsTool({ 
  analytics, 
  onSave, 
  isEditing = false,
  onEdit,
  onCancel 
}: AnalyticsToolProps) {
  const [formData, setFormData] = useState<Analytics>({
    popularity: analytics?.popularity || 50,
    profitability: analytics?.profitability || 25,
    seasonalTrends: analytics?.seasonalTrends || [],
    customerRatings: analytics?.customerRatings || 4.0,
    returnRate: analytics?.returnRate || 60,
    preparationEfficiency: analytics?.preparationEfficiency || 75
  });

  const [newTrend, setNewTrend] = useState('');

  const handleInputChange = (field: keyof Analytics, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTrend = () => {
    if (newTrend.trim()) {
      setFormData(prev => ({
        ...prev,
        seasonalTrends: [...prev.seasonalTrends, newTrend.trim()]
      }));
      setNewTrend('');
    }
  };

  const removeTrend = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seasonalTrends: prev.seasonalTrends.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getPopularityColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfitabilityColor = (value: number) => {
    if (value >= 30) return 'text-green-600';
    if (value >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
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
          {/* Popularity */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900">Popularity</h4>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPopularityColor(formData.popularity)}`}
                    style={{ width: `${formData.popularity}%` }}
                  ></div>
                </div>
              </div>
              <span className={`font-semibold ${getPopularityColor(formData.popularity)}`}>
                {formData.popularity}%
              </span>
            </div>
          </div>

          {/* Profitability */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Profitability</h4>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProfitabilityColor(formData.profitability)}`}
                    style={{ width: `${formData.profitability}%` }}
                  ></div>
                </div>
              </div>
              <span className={`font-semibold ${getProfitabilityColor(formData.profitability)}`}>
                {formData.profitability}%
              </span>
            </div>
          </div>

          {/* Customer Ratings */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <h4 className="font-medium text-gray-900">Customer Ratings</h4>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(formData.customerRatings)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">
                {formData.customerRatings.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Return Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium text-gray-900">Return Rate</h4>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: `${formData.returnRate}%` }}
                  ></div>
                </div>
              </div>
              <span className="font-semibold text-purple-600">
                {formData.returnRate}%
              </span>
            </div>
          </div>

          {/* Preparation Efficiency */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium text-gray-900">Preparation Efficiency</h4>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: `${formData.preparationEfficiency}%` }}
                  ></div>
                </div>
              </div>
              <span className="font-semibold text-orange-600">
                {formData.preparationEfficiency}%
              </span>
            </div>
          </div>
        </div>

        {/* Seasonal Trends */}
        {formData.seasonalTrends.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Seasonal Trends</h4>
            <div className="flex flex-wrap gap-2">
              {formData.seasonalTrends.map((trend, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {trend}
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
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Edit Analytics</h3>
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
        {/* Popularity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Popularity (%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.popularity}
            onChange={(e) => handleInputChange('popularity', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span className="font-medium">{formData.popularity}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Profitability */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profitability (%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.profitability}
            onChange={(e) => handleInputChange('profitability', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span className="font-medium">{formData.profitability}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Customer Ratings */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Customer Ratings (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.customerRatings}
            onChange={(e) => handleInputChange('customerRatings', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Return Rate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Return Rate (%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.returnRate}
            onChange={(e) => handleInputChange('returnRate', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span className="font-medium">{formData.returnRate}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Preparation Efficiency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preparation Efficiency (%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.preparationEfficiency}
            onChange={(e) => handleInputChange('preparationEfficiency', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span className="font-medium">{formData.preparationEfficiency}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Seasonal Trends
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTrend}
            onChange={(e) => setNewTrend(e.target.value)}
            placeholder="Add seasonal trend..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTrend}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.seasonalTrends.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.seasonalTrends.map((trend, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                <span className="text-sm">{trend}</span>
                <button
                  onClick={() => removeTrend(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
