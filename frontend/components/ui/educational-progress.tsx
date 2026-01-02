"use client";

import { cn } from "@/lib/utils";
import { Trophy, Flame, Star, Target, Zap, Award, Medal, Crown } from "lucide-react";

/* =================================================================
   PROGRESS RING - Circular progress indicator
   ================================================================= */

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    className?: string;
    variant?: "primary" | "success" | "warning" | "danger";
    showLabel?: boolean;
    label?: string;
}

export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 6,
    className,
    variant = "primary",
    showLabel = true,
    label,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const variantColors = {
        primary: "stroke-primary",
        success: "stroke-success",
        warning: "stroke-warning",
        danger: "stroke-destructive",
    };

    return (
        <div className={cn("progress-ring", className)} style={{ width: size, height: size }}>
            <svg className="progress-ring-circle" width={size} height={size}>
                <circle
                    className="progress-ring-bg stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn("progress-ring-fill transition-all duration-1000 ease-out", variantColors[variant])}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {Math.round(progress)}%
                    </span>
                    {label && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                    )}
                </div>
            )}
        </div>
    );
}

/* =================================================================
   XP PROGRESS BAR - Level progress with XP display
   ================================================================= */

interface XPProgressBarProps {
    currentXP: number;
    levelXP: number; // XP needed for next level
    level: number;
    className?: string;
    showNumbers?: boolean;
}

export function XPProgressBar({
    currentXP,
    levelXP,
    level,
    className,
    showNumbers = true,
}: XPProgressBarProps) {
    const progress = (currentXP / levelXP) * 100;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    <span>Level {level}</span>
                </div>
                {showNumbers && (
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {currentXP.toLocaleString()} / {levelXP.toLocaleString()} XP
                    </span>
                )}
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
        </div>
    );
}

/* =================================================================
   STREAK COUNTER - Daily learning streak
   ================================================================= */

interface StreakCounterProps {
    streakDays: number;
    className?: string;
    showLabel?: boolean;
}

export function StreakCounter({
    streakDays,
    className,
    showLabel = true,
}: StreakCounterProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative">
                <span className="text-2xl animate-pulse">🔥</span>
                <div className="absolute inset-0 blur-sm bg-warning/30 rounded-full -z-10"></div>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                    {streakDays}
                </span>
                {showLabel && (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        day streak
                    </span>
                )}
            </div>
        </div>
    );
}

/* =================================================================
   ACHIEVEMENT BADGE - Gamification badges
   ================================================================= */

type AchievementType =
    | "trophy"
    | "flame"
    | "star"
    | "target"
    | "zap"
    | "award"
    | "medal"
    | "crown";

interface AchievementBadgeProps {
    type: AchievementType;
    title: string;
    description?: string;
    unlocked?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const achievementIcons = {
    trophy: Trophy,
    flame: Flame,
    star: Star,
    target: Target,
    zap: Zap,
    award: Award,
    medal: Medal,
    crown: Crown,
};

export function AchievementBadge({
    type,
    title,
    description,
    unlocked = false,
    className,
    size = "md",
}: AchievementBadgeProps) {
    const IconComponent = achievementIcons[type];

    const sizeClasses = {
        sm: "w-12 h-12 sm:w-14 sm:h-14 p-2",
        md: "w-16 h-16 sm:w-20 sm:h-20 p-4",
        lg: "w-20 h-20 sm:w-24 sm:h-24 p-5",
    };

    const iconSizes = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };

    return (
        <div className={cn("flex flex-col items-center text-center group", className)}>
            <div
                className={cn(
                    "rounded-full flex items-center justify-center transition-all duration-300",
                    sizeClasses[size],
                    unlocked
                        ? "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 grayscale"
                )}
            >
                <IconComponent
                    className={cn(
                        iconSizes[size],
                        unlocked ? "text-primary drop-shadow-sm" : "text-currentColor"
                    )}
                />
            </div>
            <h4
                className={cn(
                    "mt-3 text-sm font-bold tracking-tight",
                    unlocked
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 dark:text-slate-500"
                )}
            >
                {title}
            </h4>
            {description && (
                <p
                    className={cn(
                        "text-[10px] mt-1 max-w-[120px] leading-relaxed",
                        unlocked
                            ? "text-slate-500 dark:text-slate-400"
                            : "text-slate-300 dark:text-slate-600"
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
}

/* =================================================================
   LEARNING PROGRESS STAT - Mini stat display
   ================================================================= */

interface LearningStatProps {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function LearningStat({
    label,
    value,
    trend,
    trendValue,
    icon,
    className,
}: LearningStatProps) {
    const trendColors = {
        up: "text-success",
        down: "text-destructive",
        neutral: "text-slate-500 dark:text-slate-400",
    };

    const trendArrows = {
        up: "↑",
        down: "↓",
        neutral: "→",
    };

    return (
        <div className={cn("bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {value}
                    </p>
                    {trend && trendValue && (
                        <p className={cn("mt-1 text-xs font-bold flex items-center gap-1", trendColors[trend])}>
                            <span>{trendArrows[trend]}</span>
                            {trendValue}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2.5 bg-primary/5 dark:bg-primary/10 rounded-xl text-primary">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

/* =================================================================
   COURSE PROGRESS CARD - Shows individual course progress
   ================================================================= */

interface CourseProgressCardProps {
    courseName: string;
    instructor?: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    timeRemaining?: string;
    grade?: string;
    accentColor?: string;
    className?: string;
    onClick?: () => void;
}

export function CourseProgressCard({
    courseName,
    instructor,
    progress,
    lessonsCompleted,
    totalLessons,
    timeRemaining,
    grade,
    accentColor = "indigo",
    className,
    onClick,
}: CourseProgressCardProps) {
    const colorVariants: Record<string, string> = {
        indigo: "from-primary to-primary-600 border-primary/20",
        emerald: "from-success to-success-600 border-success/20",
        amber: "from-warning to-warning-600 border-warning/20",
        purple: "from-secondary to-secondary-600 border-secondary/20",
        sky: "from-info to-info-600 border-info/20",
        rose: "from-destructive to-destructive-600 border-destructive/20",
    };

    const progressColor = colorVariants[accentColor] || colorVariants.indigo;

    return (
        <div
            className={cn(
                "group relative bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300",
                onClick && "cursor-pointer hover:-translate-y-1",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                {/* Course Icon */}
                <div
                    className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-inner text-white text-lg sm:text-xl font-bold",
                        progressColor.split(" ").slice(0, 2).join(" ")
                    )}
                >
                    {courseName.charAt(0)}
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {courseName}
                    </h3>
                    {instructor && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {instructor}
                        </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">{progress}% complete</span>
                            <span className="text-slate-400">
                                {lessonsCompleted}/{totalLessons} lessons
                            </span>
                        </div>
                        <div className="progress-linear">
                            <div
                                className={cn(
                                    "progress-linear-fill bg-gradient-to-r",
                                    progressColor.split(" ").slice(0, 2).join(" ")
                                )}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        {timeRemaining && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {timeRemaining}
                            </span>
                        )}
                        {grade && (
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                Grade: {grade}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =================================================================
   SKELETON LOADING COMPONENTS
   ================================================================= */

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("p-4 space-y-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700", className)}>
            <div className="flex items-center gap-4">
                <div className="skeleton w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                </div>
            </div>
            <div className="skeleton h-2 w-full rounded-full" />
        </div>
    );
}

export function SkeletonStat({ className }: { className?: string }) {
    return (
        <div className={cn("stat-card", className)}>
            <div className="space-y-2">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-8 w-16 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
