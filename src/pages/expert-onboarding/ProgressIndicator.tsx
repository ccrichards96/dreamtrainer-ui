interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  title = "Setup Your Account",
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center w-full">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isLast = step === totalSteps;

          return (
            <div key={step} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors z-10 ${
                  step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-1 mx-4 transition-colors ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
