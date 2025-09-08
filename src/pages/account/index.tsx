import { useState, useEffect } from 'react';
import { Loader2, Info, Save, AlertCircle, LifeBuoy, Camera, User } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

// Phone number validation regex
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // E.164 format

// Placeholder billing data structure - this will be replaced with API data
interface BillingData {
  plan: {
    current: string;
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    nextBillingDate: string | null;
    amount?: number;
    currency?: string;
  };
}

// Sample data - will be replaced by API call
const defaultBillingData: BillingData = {
  plan: {
    current: 'Free Plan',
    status: 'active',
    nextBillingDate: null, // No billing for free plan
  },
};

const AccountPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth0();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.picture || null);
  const [billingData, setBillingData] = useState<BillingData>(defaultBillingData);
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);
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

  // Fetch billing information on component mount
  useEffect(() => {
    const fetchBillingData = async () => {
      if (!user) return;
      
      setIsLoadingBilling(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Replace with actual API call
        // const response = await fetch('/users/info/billing', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${getAccessTokenSilently()}`
        //   }
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch billing data');
        // }
        // 
        // const data: BillingData = await response.json();
        // setBillingData(data);

        // For now, simulate different billing scenarios based on user email
        const mockBillingData: BillingData = user.email?.includes('premium') 
          ? {
              plan: {
                current: 'Premium Plan',
                status: 'active',
                nextBillingDate: '2025-10-03',
                amount: 29.99,
                currency: 'USD'
              },
            }
          : user.email?.includes('pro')
          ? {
              plan: {
                current: 'Pro Plan',
                status: 'active',
                nextBillingDate: '2025-09-15',
                amount: 19.99,
                currency: 'USD'
              },
            }
          : defaultBillingData;

        setBillingData(mockBillingData);
        
      } catch (error) {
        console.error('Error fetching billing data:', error);
        // Keep default data on error
        setBillingData(defaultBillingData);
      } finally {
        setIsLoadingBilling(false);
      }
    };

    fetchBillingData();
  }, [user]);

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

  const handleProfileImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Simulate API call to upload image
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('profileImage', file);
      // const response = await fetch('/api/account/upload-profile-image', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${getAccessTokenSilently()}`
      //   },
      //   body: formData
      // });
      // const { imageUrl } = await response.json();
      
      // For now, use the preview URL as the new profile image
      setProfileImage(previewUrl);
      alert('Profile picture updated successfully!');
      
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload profile image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      input.value = '';
    }
  };

  const triggerImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleProfileImageUpload;
    input.click();
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
      
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
          
          {/* Profile Image Section */}
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              {profileImage ? (
                <img
                  className="h-20 w-20 rounded-full object-cover border-4 border-gray-200"
                  src={profileImage}
                  alt="Profile"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-[#c5a8de] flex items-center justify-center text-white text-2xl font-semibold border-4 border-gray-200">
                  <User className="w-8 h-8" />
                </div>
              )}
              <button 
                onClick={triggerImageUpload}
                disabled={isUploadingImage}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <button 
                onClick={triggerImageUpload}
                disabled={isUploadingImage}
                className="mt-2 text-sm text-[#c5a8de] hover:text-[#7c5e99] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingImage ? 'Uploading...' : 'Change Profile Picture'}
              </button>
            </div>
          </div>
          
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

        {/* Plans & Usage and Support Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan & Usage Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Plan & Usage</h2>
              {isLoadingBilling && (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              )}
            </div>
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
                      <td className="py-2 pr-6 pl-4 text-lg font-medium text-gray-900">
                        {billingData.plan.current}
                        {billingData.plan.amount && (
                          <span className="text-sm text-gray-500 block">
                            ${billingData.plan.amount}/{billingData.plan.currency === 'USD' ? 'month' : 'mo'}
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-6 pl-4">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          billingData.plan.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : billingData.plan.status === 'past_due'
                            ? 'bg-yellow-100 text-yellow-700'
                            : billingData.plan.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {billingData.plan.status.charAt(0).toUpperCase() + billingData.plan.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2 pr-6 pl-4 text-gray-700">
                        {billingData.plan.nextBillingDate 
                          ? new Date(billingData.plan.nextBillingDate).toLocaleDateString()
                          : '-'
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button 
                onClick={handleUpgradePlan}
                disabled={isUpgrading || isLoadingBilling}
                className="w-full bg-[#c5a8de] text-white py-2 px-4 rounded-md hover:bg-[#7c5e99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  billingData.plan.current === 'Free Plan' ? 'Upgrade Plan' : 'Manage Plan'
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
                onClick={() => window.location.href = 'mailto:joem@thedreamtrainer.com'}
                className="bg-[#c5a8de] text-white py-2 px-6 rounded-md hover:bg-[#7c5e99] flex items-center justify-center gap-2 transition-colors"
              >
                Contact Support
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
