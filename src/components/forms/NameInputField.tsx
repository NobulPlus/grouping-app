import React, { useState, useEffect } from 'react';
import { ChevronDown, Edit3 } from 'lucide-react';

export interface NameInputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options?: string[];
  error?: string;
  placeholder?: string;
  required?: boolean;
}

type InputMode = 'select' | 'input';

const NameInputField: React.FC<NameInputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  placeholder,
  required = false,
}) => {
  const [mode, setMode] = useState<InputMode>(options.length > 0 ? 'select' : 'input');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMode((prevMode) => (prevMode === 'select' ? 'input' : 'select'));
      setIsTransitioning(false);
    }, 150);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {options.length > 0 && (
          <button
            type="button"
            onClick={handleModeToggle}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            aria-label={`Switch to ${mode === 'select' ? 'text input' : 'dropdown'} mode`}
          >
            {mode === 'select' ? (
              <>
                <Edit3 size={12} />
                Type manually
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                Select from list
              </>
            )}
          </button>
        )}
      </div>

      <div
        className={`relative transition-opacity duration-150 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {mode === 'select' ? (
          <div className="relative">
            <select
              id={name}
              name={name}
              value={value}
              onChange={handleSelectChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-10 min-h-[48px] border rounded-lg appearance-none bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${name}-error` : undefined}
            >
              <option value="">Select {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        ) : (
          <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={onBlur}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className={`w-full px-4 py-3 min-h-[48px] border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              hasError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        )}
      </div>

      {hasError && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm text-red-600 flex items-start gap-1"
          role="alert"
        >
          <span className="inline-block mt-0.5">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default NameInputField;
