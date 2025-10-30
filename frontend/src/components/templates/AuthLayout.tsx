import React, { ReactNode } from 'react';
import { Typography } from '../atoms/Typography';
import { Card } from '../atoms/Card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen bg-clean-light flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg" padding="lg">
          <div className="text-center mb-8">
            <Typography variant="h3" className="mb-2">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body" color="muted">
                {subtitle}
              </Typography>
            )}
          </div>
          
          <div>
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;