"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LuminaCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "glass" | "gradient" | "elevated";
    gradientColor?: "indigo" | "teal" | "amber" | "rose" | "emerald" | "purple" | "orange" | "blue";
    animate?: boolean;
    glow?: boolean;
}

export function LuminaCard({
    children,
    className,
    variant = "default",
    gradientColor = "indigo",
    animate = true,
    glow = false,
    ...props
}: LuminaCardProps) {
    const baseStyles = "relative overflow-hidden transition-all duration-300";

    const variantStyles = {
        default: "bg-white dark:bg-slate-800 border-none shadow-card hover:shadow-card-hover rounded-[var(--radius-xl)]",
        glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-[var(--radius-xl)] shadow-lg",
        gradient: cn(
            "border-0 text-white rounded-[var(--radius-xl)] shadow-lg",
            gradientColor === "indigo" && "bg-gradient-to-br from-primary to-primary/80 shadow-primary/30",
            gradientColor === "teal" && "bg-gradient-to-br from-secondary to-secondary/80 shadow-secondary/30",
            gradientColor === "amber" && "bg-gradient-to-br from-warning to-warning/80 shadow-warning/30",
            gradientColor === "emerald" && "bg-gradient-to-br from-success to-success/80 shadow-success/30",
            gradientColor === "rose" && "bg-gradient-to-br from-destructive to-destructive/80 shadow-destructive/30",
            gradientColor === "purple" && "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30",
            gradientColor === "orange" && "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30",
            gradientColor === "blue" && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30"
        ),
        elevated: "bg-white dark:bg-slate-800 border-none rounded-[var(--radius-xl)] shadow-xl shadow-slate-200/50 dark:shadow-black/50",
    };

    const animationStyles = animate ? "hover:-translate-y-1 transition-transform duration-300 ease-out" : "";

    const glowStyles = glow ? cn(
        "after:absolute after:inset-0 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
        gradientColor === "indigo" && "after:shadow-[0_0_30px_var(--color-primary-500)]",
        gradientColor === "teal" && "after:shadow-[0_0_30px_var(--color-secondary-500)]",
        gradientColor === "amber" && "after:shadow-[0_0_30px_var(--color-warning-500)]",
        gradientColor === "purple" && "after:shadow-[0_0_30px_#a855f7]",
        gradientColor === "orange" && "after:shadow-[0_0_30px_#f97316]",
        gradientColor === "blue" && "after:shadow-[0_0_30px_#3b82f6]"
    ) : "";

    return (
        <div className={cn(baseStyles, variantStyles[variant], animationStyles, glowStyles, className)} {...props}>
            {/* Subtle light effect for gradient variant */}
            {variant === "gradient" && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
            )}
            {children}
        </div>
    );
}

export function LuminaCardContent({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn("p-6", className)}>{children}</div>;
}

export function LuminaCardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn("px-6 pt-6 pb-2", className)}>{children}</div>;
}

export function LuminaCardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
    return <h3 className={cn("text-lg font-bold tracking-tight text-slate-900 dark:text-white", className)}>{children}</h3>;
}
