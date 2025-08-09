import React from 'react';

const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index + 1 <= currentStep
                ? 'bg-mint-400 text-neutral-900'
                : 'bg-white/10 text-gray-400'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              index + 1 <= currentStep
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>
              {step}
            </span>
            {index < totalSteps - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index + 1 < currentStep
                  ? 'bg-mint-400'
                  : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator; 