'use client';

import React, { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface NetworkErrorProps {
  title?: string;
  description?: string;
  onRetry: () => void | Promise<void>;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  title = 'Connection Error',
  description = 'Unable to connect to the server. Please check your internet connection and try again.',
  onRetry,
  isLoading = false,
  children,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await Promise.resolve(onRetry());
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[300px] p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <WifiOff className="w-12 h-12 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        <Button
          onClick={handleRetry}
          disabled={isRetrying || isLoading}
          className="w-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying || isLoading ? 'Retrying...' : 'Retry'}
        </Button>
        {children}
      </div>
    </div>
  );
};

export default NetworkError;
