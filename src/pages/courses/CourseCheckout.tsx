import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { createCheckoutSession } from '../../services/api/billing';
import { useCheckoutContext } from '../../contexts';
import type { Course } from '../../types/modules';

export default function CourseCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { activeCheckout, loadCheckoutData } = useCheckoutContext();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!slug) {
        setError('No course specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use cached checkout data if available, otherwise fetch it
        const checkoutData = activeCheckout?.course.slug === slug
          ? activeCheckout
          : await loadCheckoutData(slug);

        setCourse(checkoutData.course);
        const pricing = checkoutData.pricing;

        if (!pricing.priceId) {
          throw new Error('This course is not available for purchase. No payment method configured.');
        }

        // Create checkout session using the price ID from pricing endpoint
        const { checkoutUrl } = await createCheckoutSession({
          priceIds: [pricing.priceId],
          successUrl: `${window.location.origin}/checkout/success?type=course&courseId=${checkoutData.course.id}`,
          cancelUrl: `${window.location.origin}/courses/${checkoutData.course.slug}`,
          mode: pricing.type === 'recurring' ? 'subscription' : 'payment',
          courseId: checkoutData.course.id,
        });

        // Redirect to Stripe checkout
        window.location.href = checkoutUrl;
      } catch (err) {
        console.error('Error creating checkout session:', err);
        setError(err instanceof Error ? err.message : 'Failed to create checkout session');
        setLoading(false);
      }
    };

    initiateCheckout();
  }, [slug, activeCheckout, loadCheckoutData]);

  const handleBackToCourse = () => {
    if (course?.slug) {
      navigate(`/courses/${course.slug}`);
    } else {
      navigate('/courses');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Setting up checkout...</h1>

          <p className="text-gray-600">
            Please wait while we redirect you to our secure payment page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h1>

          <p className="text-gray-600 mb-6">{error}</p>

          <button
            onClick={handleBackToCourse}
            className="w-full py-3 px-6 inline-flex items-center justify-center text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 transition-all"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // This state should not be reached as we redirect immediately,
  // but we'll show a loading state just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to checkout...</p>
      </div>
    </div>
  );
}
