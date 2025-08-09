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
                : 'bg-slate-700/50 text-slate-400'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              index + 1 <= currentStep
                ? 'text-white'
                : 'text-slate-400'
            }`}>
              {step}
            </span>
            {index < totalSteps - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index + 1 < currentStep
                  ? 'bg-mint-400'
                  : 'bg-slate-700/50'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator; 