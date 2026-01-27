import React from 'react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className = '',
  variant = 'destructive',
}) => {
  if (count === 0) return null;

  const variantClasses = {
    default: 'bg-blue-500 text-white',
    secondary: 'bg-slate-400 text-white',
    destructive: 'bg-red-500 text-white',
  };

  return (
    <span
      className={`
        absolute -top-2 -right-2 
        flex items-center justify-center
        min-w-5 h-5
        px-1.5
        text-xs font-bold
        rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;
