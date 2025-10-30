import React, { ReactNode } from 'react';
import Input from './Input';
import { Typography } from './Typography';

interface FormFieldProps {
  label: string;
  error?: string;
  children?: ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  children, 
  required = false 
}) => {
  return (
    <div className="space-y-2">
      <label className="block">
        <Typography variant="caption" className="font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Typography>
        {children}
      </label>
      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

interface FormFieldWithInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormFieldWithInput = React.forwardRef<HTMLInputElement, FormFieldWithInputProps>(
  ({ label, error, required = false, ...inputProps }, ref) => {
    return (
      <FormField label={label} error={error} required={required}>
        <Input
          ref={ref}
          variant={error ? 'error' : 'default'}
          fullWidth
          {...inputProps}
        />
      </FormField>
    );
  }
);

FormFieldWithInput.displayName = 'FormFieldWithInput';

export default FormField;