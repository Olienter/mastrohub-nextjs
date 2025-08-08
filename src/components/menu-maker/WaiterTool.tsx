import React, { useState } from 'react';
import { User, MessageSquare, Clock, Wine, AlertTriangle, Edit3, Save, X } from 'lucide-react';

interface WaiterManual {
  customerDescription: string;
  recommendations: string[];
  pairing: string[];
  specialRequests: string[];
  portionInfo: string;
  alternatives: string[];
  servingTime: number;
}

interface WaiterToolProps {
  waiterManual?: WaiterManual;
  onSave: (waiterManual: WaiterManual) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function WaiterTool({ 
  waiterManual, 
  onSave, 
  isEditing = false, 
  onEdit, 
  onCancel 
}: WaiterToolProps) {
  const [formData, setFormData] = useState<WaiterManual>({
    customerDescription: waiterManual?.customerDescription || '',
    recommendations: waiterManual?.recommendations || [],
    pairing: waiterManual?.pairing || [],
    specialRequests: waiterManual?.specialRequests || [],
    portionInfo: waiterManual?.portionInfo || '',
    alternatives: waiterManual?.alternatives || [],
    servingTime: waiterManual?.servingTime || 0
  });

  const [newRecommendation, setNewRecommendation] = useState('');
  const [newPairing, setNewPairing] = useState('');
  const [newSpecialRequest, setNewSpecialRequest] = useState('');
  const [newAlternative, setNewAlternative] = useState('');

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, newRecommendation.trim()]
      }));
      setNewRecommendation('');
    }
  };

  const removeRecommendation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index)
    }));
  };

  const addPairing = () => {
    if (newPairing.trim()) {
      setFormData(prev => ({
        ...prev,
        pairing: [...prev.pairing, newPairing.trim()]
      }));
      setNewPairing('');
    }
  };

  const removePairing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pairing: prev.pairing.filter((_, i) => i !== index)
    }));
  };

  const addSpecialRequest = () => {
    if (newSpecialRequest.trim()) {
      setFormData(prev => ({
        ...prev,
        specialRequests: [...prev.specialRequests, newSpecialRequest.trim()]
      }));
      setNewSpecialRequest('');
    }
  };

  const removeSpecialRequest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialRequests: prev.specialRequests.filter((_, i) => i !== index)
    }));
  };

  const addAlternative = () => {
    if (newAlternative.trim()) {
      setFormData(prev => ({
        ...prev,
        alternatives: [...prev.alternatives, newAlternative.trim()]
      }));
      setNewAlternative('');
    }
  };

  const removeAlternative = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alternatives: prev.alternatives.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isEditing && waiterManual) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Waiter Manual</h3>
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
          {/* Customer Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Customer Description</h4>
            <p className="text-gray-700">{waiterManual.customerDescription}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <div className="flex flex-wrap gap-2">
              {waiterManual.recommendations.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Pairing */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Pairing Suggestions</h4>
            <div className="flex flex-wrap gap-2">
              {waiterManual.pairing.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
            <div className="flex flex-wrap gap-2">
              {waiterManual.specialRequests.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Portion Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Portion Information</h4>
            <p className="text-gray-700">{waiterManual.portionInfo}</p>
          </div>

          {/* Alternatives */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Alternatives</h4>
            <div className="flex flex-wrap gap-2">
              {waiterManual.alternatives.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Serving Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">Serving Time:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              {waiterManual.servingTime} minutes
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Waiter Manual</h3>
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
            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customer Description */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Customer Description</label>
          <textarea
            value={formData.customerDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, customerDescription: e.target.value }))}
            placeholder="Describe the dish for customers..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Recommendations */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Recommendations</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newRecommendation}
              onChange={(e) => setNewRecommendation(e.target.value)}
              placeholder="Add recommendation..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addRecommendation()}
            />
            <button
              onClick={addRecommendation}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.recommendations.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeRecommendation(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Pairing */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Pairing Suggestions</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPairing}
              onChange={(e) => setNewPairing(e.target.value)}
              placeholder="Add pairing suggestion..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && addPairing()}
            />
            <button
              onClick={addPairing}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.pairing.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removePairing(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Special Requests</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSpecialRequest}
              onChange={(e) => setNewSpecialRequest(e.target.value)}
              placeholder="Add special request..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onKeyPress={(e) => e.key === 'Enter' && addSpecialRequest()}
            />
            <button
              onClick={addSpecialRequest}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.specialRequests.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeSpecialRequest(index)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Portion Info */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Portion Information</label>
          <textarea
            value={formData.portionInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, portionInfo: e.target.value }))}
            placeholder="Describe portion information..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Alternatives */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Alternatives</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newAlternative}
              onChange={(e) => setNewAlternative(e.target.value)}
              placeholder="Add alternative..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && addAlternative()}
            />
            <button
              onClick={addAlternative}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.alternatives.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeAlternative(index)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Serving Time */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Serving Time (minutes)</label>
          <input
            type="number"
            value={formData.servingTime}
            onChange={(e) => setFormData(prev => ({ ...prev, servingTime: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
