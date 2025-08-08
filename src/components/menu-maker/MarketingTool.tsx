import React, { useState } from 'react';
import { TrendingUp, Hash, Camera, Users, Calendar, Edit3, Save, X } from 'lucide-react';

interface MarketingManual {
  story: string;
  hashtags: string[];
  seasonality: string[];
  targetAudience: string[];
  trends: string[];
  background: string;
  chefStory: string;
  localIngredients: string[];
}

interface MarketingToolProps {
  marketingManual?: MarketingManual;
  onSave: (marketingManual: MarketingManual) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function MarketingTool({ 
  marketingManual, 
  onSave, 
  isEditing = false, 
  onEdit, 
  onCancel 
}: MarketingToolProps) {
  const [formData, setFormData] = useState<MarketingManual>({
    story: marketingManual?.story || '',
    hashtags: marketingManual?.hashtags || [],
    seasonality: marketingManual?.seasonality || [],
    targetAudience: marketingManual?.targetAudience || [],
    trends: marketingManual?.trends || [],
    background: marketingManual?.background || '',
    chefStory: marketingManual?.chefStory || '',
    localIngredients: marketingManual?.localIngredients || []
  });

  const [newHashtag, setNewHashtag] = useState('');
  const [newSeasonality, setNewSeasonality] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState('');
  const [newTrend, setNewTrend] = useState('');
  const [newLocalIngredient, setNewLocalIngredient] = useState('');

  const addHashtag = () => {
    if (newHashtag.trim()) {
      const hashtag = newHashtag.trim().startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }));
      setNewHashtag('');
    }
  };

  const removeHashtag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index)
    }));
  };

  const addSeasonality = () => {
    if (newSeasonality.trim()) {
      setFormData(prev => ({
        ...prev,
        seasonality: [...prev.seasonality, newSeasonality.trim()]
      }));
      setNewSeasonality('');
    }
  };

  const removeSeasonality = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seasonality: prev.seasonality.filter((_, i) => i !== index)
    }));
  };

  const addTargetAudience = () => {
    if (newTargetAudience.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, newTargetAudience.trim()]
      }));
      setNewTargetAudience('');
    }
  };

  const removeTargetAudience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, i) => i !== index)
    }));
  };

  const addTrend = () => {
    if (newTrend.trim()) {
      setFormData(prev => ({
        ...prev,
        trends: [...prev.trends, newTrend.trim()]
      }));
      setNewTrend('');
    }
  };

  const removeTrend = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trends: prev.trends.filter((_, i) => i !== index)
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

  const handleSave = () => {
    onSave(formData);
  };

  if (!isEditing && marketingManual) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Marketing Manual</h3>
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
          {/* Story */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dish Story</h4>
            <p className="text-gray-700">{marketingManual.story}</p>
          </div>

          {/* Hashtags */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Social Media Hashtags</h4>
            <div className="flex flex-wrap gap-2">
              {marketingManual.hashtags.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Seasonality */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Seasonality</h4>
            <div className="flex flex-wrap gap-2">
              {marketingManual.seasonality.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
            <div className="flex flex-wrap gap-2">
              {marketingManual.targetAudience.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current Trends</h4>
            <div className="flex flex-wrap gap-2">
              {marketingManual.trends.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Background & History</h4>
            <p className="text-gray-700">{marketingManual.background}</p>
          </div>

          {/* Chef Story */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Chef Story</h4>
            <p className="text-gray-700">{marketingManual.chefStory}</p>
          </div>

          {/* Local Ingredients */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Local Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {marketingManual.localIngredients.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Marketing Manual</h3>
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
            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Story */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Dish Story</label>
          <textarea
            value={formData.story}
            onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
            placeholder="Tell the story behind this dish..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
        </div>

        {/* Hashtags */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Social Media Hashtags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              placeholder="Add hashtag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
            />
            <button
              onClick={addHashtag}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.hashtags.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeHashtag(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Seasonality */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Seasonality</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSeasonality}
              onChange={(e) => setNewSeasonality(e.target.value)}
              placeholder="Add season..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addSeasonality()}
            />
            <button
              onClick={addSeasonality}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.seasonality.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeSeasonality(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Target Audience</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTargetAudience}
              onChange={(e) => setNewTargetAudience(e.target.value)}
              placeholder="Add target audience..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTargetAudience()}
            />
            <button
              onClick={addTargetAudience}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.targetAudience.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeTargetAudience(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Trends */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Current Trends</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTrend}
              onChange={(e) => setNewTrend(e.target.value)}
              placeholder="Add trend..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && addTrend()}
            />
            <button
              onClick={addTrend}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.trends.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeTrend(index)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Background */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Background & History</label>
          <textarea
            value={formData.background}
            onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
            placeholder="Add background and history..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        {/* Chef Story */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Chef Story</label>
          <textarea
            value={formData.chefStory}
            onChange={(e) => setFormData(prev => ({ ...prev, chefStory: e.target.value }))}
            placeholder="Add chef story..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        {/* Local Ingredients */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">Local Ingredients</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newLocalIngredient}
              onChange={(e) => setNewLocalIngredient(e.target.value)}
              placeholder="Add local ingredient..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onKeyPress={(e) => e.key === 'Enter' && addLocalIngredient()}
            />
            <button
              onClick={addLocalIngredient}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.localIngredients.map((item, index) => (
              <span key={index} className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {item}
                <button
                  onClick={() => removeLocalIngredient(index)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
