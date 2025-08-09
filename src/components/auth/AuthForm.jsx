
const AuthForm = ({ 
  children, 
  title, 
  subtitle, 
  onSubmit, 
  isLoading = false, 
  error = null,
  submitText = 'Submit',
  isValid = true 
}) => {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {children}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isValid && !isLoading
                  ? 'bg-mint-400 hover:bg-mint-500 text-neutral-900 hover:scale-105'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Loading...' : submitText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
