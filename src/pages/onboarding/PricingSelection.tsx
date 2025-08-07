import { useState } from 'react';
import { ChevronLeft, Check, Crown, Star } from 'lucide-react';
import { OnboardingData } from './index';
import ProgressIndicator from './ProgressIndicator';
import { createCheckoutSession } from '../../services/api/billing';

interface PricingSelectionProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onPrev: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const pricingPlans = [
  {
    id: 'premium',
    name: 'TOEFL MAX Writing',
    price: 47,
    period: 'month',
    priceId: 'price_1RslNR1TwH4sDeUMAhEoAPjp', // Replace with actual Stripe price ID
    description: 'Get your dream TOEFL score with personalized AI coachiing',
    icon: Crown,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      'Personalized Feedback',
      'Unlimited AI coaching sessions',
      '5 AI trainers equivalent to $1,800 or more',
      'Progress Monitoring',
      'Live Interventions with Human Experts',
      'Dedicated TOEFL guides & support'
    ],
    popular: true
  },
];

export default function PricingSelection({ data, updateData, onPrev, currentStep = 3, totalSteps = 3 }: PricingSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState(data.selectedPackage || 'premium');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    updateData({ selectedPackage: planId });
  };

  const handleComplete = async () => {
    if (!selectedPlan) return;

    try {
      setIsProcessing(true);
      
      // Find the selected plan to get its price ID
      const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);
      if (!selectedPlanData) {
        setIsProcessing(false);
        throw new Error('Selected plan not found');
      }

      // Create checkout session
      const checkoutSession = await createCheckoutSession({
        priceIds: [selectedPlanData.priceId],
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/onboarding`,
        mode: 'subscription'
      });

      // Only redirect if we successfully got a checkout session URL
      if (checkoutSession?.data?.checkoutUrl) {
        window.location.href = checkoutSession.data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setIsProcessing(false);
      // You can add user-friendly error notification here
      // For example: toast.error('Failed to process checkout. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Steps */}
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />

      {/* Content */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">
          Select the perfect plan to accelerate your English learning journey
        </p>
      </div>

      <div className="grid md:grid-cols-1 gap-6 mb-8">
        {pricingPlans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plan.id
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-500 ring-opacity-20'
                  : plan.borderColor
              } ${plan.bgColor}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`w-12 h-12 ${plan.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className={`w-6 h-6 ${plan.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedPlan === plan.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleComplete}
          disabled={!selectedPlan || isProcessing}
          className="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
