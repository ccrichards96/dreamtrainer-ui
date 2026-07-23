import { WIZARD_STEPS } from "./types";

interface WizardHeaderProps {
  currentStep: number;
  subtitle?: string;
  heading?: string;
}

export default function WizardHeader({
  currentStep,
  subtitle,
  heading = "Let's get your partner setup completed!",
}: WizardHeaderProps) {
  const totalSteps = WIZARD_STEPS.length;

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-500 max-w-xs">{subtitle}</p>}
        </div>

        <div className="flex items-start">
          {WIZARD_STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isLast = stepNumber === totalSteps;
            const isActive = stepNumber === currentStep;

            return (
              <div key={step.label} className="flex items-start">
                <div className="flex flex-col items-center w-20">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold bg-purple-600 text-white">
                    {stepNumber}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center leading-tight font-bold ${
                      isActive ? "text-purple-600" : "text-gray-900"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && <div className="h-px w-8 lg:w-12 bg-gray-300 mt-[18px]" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
