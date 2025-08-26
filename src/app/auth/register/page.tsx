'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MessageCircle, Mail, Phone, Eye, EyeOff, Building, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'account' | 'business' | 'verification'>('account');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (step === 'account') {
        // Validate account details
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        setStep('business');
      } else if (step === 'business') {
        // Validate business details
        if (!formData.businessName.trim()) {
          toast.error('Business name is required');
          return;
        }
        setStep('verification');
      } else {
        // Complete registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderAccountStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="phone" className="form-label">
          Phone number
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="0803 XXX XXXX"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
          className="w-full phone-input"
        />
        <p className="form-help">Enter your Nigerian phone number</p>
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="form-help">Must be at least 8 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Confirm password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        Continue
      </Button>
    </form>
  );

  const renderBusinessStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="businessName" className="form-label">
          Business name
        </label>
        <div className="relative">
          <Input
            id="businessName"
            type="text"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            required
            className="w-full pl-10"
          />
          <Building className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="businessAddress" className="form-label">
          Business address (optional)
        </label>
        <div className="relative">
          <Input
            id="businessAddress"
            type="text"
            placeholder="Enter your business address"
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            className="w-full pl-10"
          />
          <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <p className="form-help">This will appear on your invoices</p>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setStep('account')}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" loading={isLoading}>
          Continue
        </Button>
      </div>
    </form>
  );

  const renderVerificationStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify your email</h3>
        <p className="text-gray-600">
          We've sent a verification code to <strong>{formData.email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="otp" className="form-label">
            Verification code
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full text-center text-lg tracking-widest"
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setStep('business')}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={isLoading}
            onClick={handleSubmit}
          >
            Verify & Complete
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button className="text-primary-600 hover:text-primary-500 font-medium">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'account':
        return 'Create your account';
      case 'business':
        return 'Business information';
      case 'verification':
        return 'Verify your email';
      default:
        return 'Create your account';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'account':
        return 'Enter your details to get started';
      case 'business':
        return 'Tell us about your business';
      case 'verification':
        return 'Verify your email to complete registration';
      default:
        return 'Enter your details to get started';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">InvoicePro</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
          <p className="text-gray-600">{getStepDescription()}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'account' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${
              step === 'business' || step === 'verification' ? 'bg-primary-500' : 'bg-gray-200'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'business' ? 'bg-primary-500 text-white' : 
              step === 'verification' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-12 h-1 ${
              step === 'verification' ? 'bg-primary-500' : 'bg-gray-200'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'verification' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {step === 'account' && renderAccountStep()}
          {step === 'business' && renderBusinessStep()}
          {step === 'verification' && renderVerificationStep()}
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}