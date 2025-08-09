import React from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  onKeyDown,
  error, 
  placeholder, 
  autoFocus = false,
  required = false 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-colors ${
          error ? 'border-red-400' : ''
        }`}
      />
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
 