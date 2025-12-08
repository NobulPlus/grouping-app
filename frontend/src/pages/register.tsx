import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '@/components/layouts';
import { NameInputField } from '@/components/forms';
import { Button } from '@/components/ui';
import { registrationSchema, type RegistrationFormData } from '@/lib/validation';
import { useRegistration, useCheckName } from '@/hooks/useApi';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

// Sample name options for dropdowns
const SURNAME_OPTIONS = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const FIRST_NAME_OPTIONS = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const MIDDLE_NAME_OPTIONS = ['Lee', 'Ann', 'Marie', 'Lynn', 'Ray', 'Jean', 'Rose', 'Grace', 'Mae', 'Jo'];

export default function Register() {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicateInfo, setDuplicateInfo] = useState<{ group: string; date: string } | null>(null);

  // React Hook Form setup with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      surname: '',
      firstName: '',
      middleName: '',
      email: '',
      phone: '',
    },
  });

  // Watch all three name fields to enable/disable submit button
  const surname = watch('surname');
  const firstName = watch('firstName');
  const middleName = watch('middleName');

  // Check if all three names are valid (non-empty and pass validation)
  const allNamesValid = Boolean(
    surname?.trim() &&
    firstName?.trim() &&
    middleName?.trim() &&
    !errors.surname &&
    !errors.firstName &&
    !errors.middleName
  );

  // API hooks
  const checkNameMutation = useCheckName();
  const registrationMutation = useRegistration();

  const isSubmitting = checkNameMutation.isPending || registrationMutation.isPending;

  // Handle form submission
  const onSubmit = async (data: any) => {
    setSubmitError(null);
    setDuplicateInfo(null);

    try {
      // First, check if the name already exists
      const checkResult = await checkNameMutation.mutateAsync({
        surname: data.surname,
        firstName: data.firstName,
        middleName: data.middleName,
      });

      if (checkResult.exists && checkResult.user) {
        // Name already exists - show duplicate info
        setDuplicateInfo({
          group: checkResult.user.group,
          date: checkResult.user.registeredDate,
        });
        showWarning(`This name is already registered in the ${checkResult.user.group} group.`);
        return;
      }

      // Name doesn't exist - proceed with registration
      const registrationResult = await registrationMutation.mutateAsync(data);

      if (registrationResult.success) {
        // Store registration data in session storage for confirmation page
        sessionStorage.setItem('registrationData', JSON.stringify(registrationResult.data));
        
        // Show success toast
        showSuccess('Registration successful! Welcome to your team.');
        
        // Navigate to confirmation page
        router.push('/confirm');
      }
    } catch (error: any) {
      // Handle network or server errors
      const errorMessage = error?.message || 'Unable to complete registration. Please check your connection and try again.';
      setSubmitError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleRetry = () => {
    setSubmitError(null);
    setDuplicateInfo(null);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Your Team</h1>
          <p className="text-lg text-gray-600">
            Register to be automatically assigned to a group
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Registration form">
            {/* Surname Field */}
            <Controller
              name="surname"
              control={control}
              render={({ field }) => (
                <NameInputField
                  label="Surname"
                  name="surname"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={() => trigger('surname')}
                  options={SURNAME_OPTIONS}
                  error={errors.surname?.message}
                  placeholder="Enter your surname"
                  required
                />
              )}
            />

            {/* First Name Field */}
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <NameInputField
                  label="First Name"
                  name="firstName"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={() => trigger('firstName')}
                  options={FIRST_NAME_OPTIONS}
                  error={errors.firstName?.message}
                  placeholder="Enter your first name"
                  required
                />
              )}
            />

            {/* Middle Name Field */}
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <NameInputField
                  label="Middle Name"
                  name="middleName"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={() => trigger('middleName')}
                  options={MIDDLE_NAME_OPTIONS}
                  error={errors.middleName?.message}
                  placeholder="Enter your middle name"
                  required
                />
              )}
            />

            {/* Email Field (Optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      type="email"
                      id="email"
                      {...field}
                      onBlur={() => trigger('email')}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 min-h-[48px] border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-sm text-red-600 flex items-start gap-1" role="alert">
                        <span className="inline-block mt-0.5">⚠</span>
                        <span>{errors.email.message}</span>
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      type="tel"
                      id="phone"
                      {...field}
                      onBlur={() => trigger('phone')}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 min-h-[48px] border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-2 text-sm text-red-600 flex items-start gap-1" role="alert">
                        <span className="inline-block mt-0.5">⚠</span>
                        <span>{errors.phone.message}</span>
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Duplicate Name Warning */}
            {duplicateInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3" role="alert" aria-live="polite">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Name Already Registered</h3>
                  <p className="text-sm text-yellow-800">
                    This name combination is already registered in the <strong>{duplicateInfo.group}</strong> group
                    on {new Date(duplicateInfo.date).toLocaleDateString()}.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="mt-2 text-sm text-yellow-900 underline hover:text-yellow-700"
                  >
                    View your group
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert" aria-live="assertive">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Registration Failed</h3>
                  <p className="text-sm text-red-800">{submitError}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-2 text-sm text-red-900 underline hover:text-red-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={!allNamesValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
              <p className="mt-3 text-sm text-gray-500 text-center">
                All three names are required to register
              </p>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View all groups
            </button>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
