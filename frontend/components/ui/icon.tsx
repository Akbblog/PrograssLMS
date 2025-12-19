
import React from 'react';
import { Icon as IconifyIcon, IconProps as IconifyProps } from '@iconify/react';
import { cn } from '@/lib/utils';

interface IconProps extends Omit<IconifyProps, 'icon'> {
    name: string;
}

/**
 * A centralized Icon component using Iconify.
 * This provides access to 100,000+ icons from any set (Material, Lucide, FontAwesome, etc.)
 * Usage: <Icon name="lucide:layout-dashboard" /> or <Icon name="mdi:school" />
 */
const Icon = ({ name, className, ...props }: IconProps) => {
    return (
        <IconifyIcon
            icon={name}
            className={cn("shrink-0", className)}
            {...props}
        />
    );
};

export default Icon;
