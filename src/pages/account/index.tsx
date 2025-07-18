import { useState, useEffect } from 'react';
import { Loader2, Info, Save, AlertCircle, LifeBuoy } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

// Phone number validation regex
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // E.164 format

// Placeholder data structure - this will be replaced with API data later
const accountData = {
  plan: {
    current: 'Free Plan',
    nextBillingDate: null, // No billing for free plan
  },
  security: {
    twoFactorEnabled: false,
  },
};

const AccountPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth0();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phone_number || '',
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
  });

  // Check if user logged in via social provider
  const isSocialLogin = user?.sub?.includes('oauth2') || user?.sub?.includes('google') || user?.sub?.includes('facebook');
  const socialProvider = user?.sub?.split('|')[0]?.replace('-oauth2', '') || 'social provider';

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return ''; // Empty is valid
    if (!PHONE_REGEX.test(phone)) {
      return 'Please enter a valid phone number in E.164 format (e.g., +12125551234)';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate phone number on change
    if (field === 'phoneNumber') {
      setErrors(prev => ({
        ...prev,
        phoneNumber: validatePhoneNumber(value)
      }));
    }
  };

  useEffect(() => {
    // Check if any form fields have been modified from their initial values
    const hasChanges = 
      formData.name !== (user?.name || '') ||
      formData.phoneNumber !== (user?.phone_number || '');
    
    setHasUnsavedChanges(hasChanges && !errors.phoneNumber);
  }, [formData, user, errors]);

  const handleSaveChanges = async () => {
    // Validate all fields before saving
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      setErrors(prev => ({ ...prev, phoneNumber: phoneError }));
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/account/update', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAccessTokenSilently()}`
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     phoneNumber: formData.phoneNumber
      //   })
      // });
      
      alert('Changes saved successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradePlan = async () => {
    setIsUpgrading(true);
    
    // Simulate API call to Stripe
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // TODO: Replace with actual Stripe integration
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     priceId: 'price_123', // Replace with actual price ID
      //     successUrl: `${window.location.origin}/account?success=true`,
      //     cancelUrl: `${window.location.origin}/account?canceled=true`,
      //   }),
      // });
      // const { url } = await response.json();
      // window.location.href = url;
      
      // For now, just show a success message
      alert('This will redirect to Stripe in the future.');
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      alert('Failed to initiate upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute will handle the redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <button
          onClick={handleSaveChanges}
          disabled={!hasUnsavedChanges || isSaving}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            hasUnsavedChanges && !isSaving
              ? 'bg-[#c5a8de] text-white hover:bg-[#7c5e99]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                defaultValue={user.email || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                    errors.phoneNumber 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+12125551234"
                />
                {errors.phoneNumber && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter your phone number starting with your country code (e.g., +1 for US/Canada, +44 for UK). Include your area code and number without spaces or special characters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={isSocialLogin}
                className={`text-blue-600 hover:text-blue-800 text-sm ${isSocialLogin ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Change Password
              </button>
              {isSocialLogin && (
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                    <p>You logged in with {socialProvider}. To change your password, please visit your {socialProvider} account settings.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plan & Usage Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan & Usage</h2>
          <div className="space-y-4">
            {/* Plan Info Row */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pr-6 font-medium">Current Plan</th>
                    <th className="pr-6 font-medium">Status</th>
                    <th className="pr-6 font-medium">Next Billing Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#f7f4fa] rounded">
                    <td className="py-2 pr-6 pl-4 text-lg font-medium text-gray-900">{accountData.plan.current}</td>
                    <td className="py-2 pr-6 pl-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Active</span>
                    </td>
                    <td className="py-2 pr-6 pl-4 text-gray-700">{accountData.plan.nextBillingDate || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button 
              onClick={handleUpgradePlan}
              disabled={isUpgrading}
              className="w-full bg-[#c5a8de] text-white py-2 px-4 rounded-md hover:bg-[#7c5e99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              
              {isUpgrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Manage Plan'
              )}
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Support</h2>
          <div className="flex flex-col items-center text-center py-4 space-y-6">
            <LifeBuoy className="w-16 h-16 text-blue-500" />
            <div>
              <p className="text-lg font-medium text-gray-800">Need help with anything?</p>
              <p className="text-gray-600 mt-1">Our support team is here to assist you with any questions or issues.</p>
            </div>
            <button 
              onClick={() => window.location.href = 'mailto:support@uxbrite.com'}
              className="bg-[#c5a8de] text-white py-2 px-6 rounded-md hover:bg-[#7c5e99] flex items-center justify-center gap-2 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-[#e6d8f5]">
                {accountData.security.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AccountPage;
