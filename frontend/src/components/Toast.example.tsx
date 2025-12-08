/**
 * Toast Notification System - Usage Examples
 * 
 * This file demonstrates how to use the toast notification system
 * throughout the application.
 */

import React from 'react';
import { useToast } from '@/contexts/ToastContext';
import Button from './ui/Button';

export const ToastExamples: React.FC = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Examples</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => showSuccess('Operation completed successfully!')}
          variant="primary"
        >
          Show Success Toast
        </Button>

        <Button
          onClick={() => showError('An error occurred. Please try again.')}
          variant="primary"
        >
          Show Error Toast
        </Button>

        <Button
          onClick={() => showInfo('Here is some helpful information.')}
          variant="primary"
        >
          Show Info Toast
        </Button>

        <Button
          onClick={() => showWarning('Please review this warning message.')}
          variant="primary"
        >
          Show Warning Toast
        </Button>

        <Button
          onClick={() => showSuccess('This toast will dismiss after 3 seconds', 3000)}
          variant="outline"
        >
          Custom Duration (3s)
        </Button>

        <Button
          onClick={() => {
            showSuccess('First notification');
            setTimeout(() => showInfo('Second notification'), 500);
            setTimeout(() => showWarning('Third notification'), 1000);
          }}
          variant="outline"
        >
          Multiple Toasts
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Usage in Components:</h3>
        <pre className="text-sm bg-white p-4 rounded overflow-x-auto">
{`import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const handleAction = async () => {
    try {
      await someApiCall();
      showSuccess('Action completed successfully!');
    } catch (error) {
      showError('Failed to complete action.');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}`}
        </pre>
      </div>
    </div>
  );
};
