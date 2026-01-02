"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        className={cn(
            "peer h-4.5 w-4.5 shrink-0 rounded-[4px] border border-slate-300 dark:border-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            checked ? "bg-primary border-primary text-white shadow-sm" : "bg-transparent dark:bg-slate-800/50 hover:border-primary/50",
            className
        )}
        onClick={() => onCheckedChange?.(!checked)}
        {...props}
    >
        {checked && (
            <div className={cn("flex items-center justify-center text-current")}>
                <Check className="h-4 w-4" />
            </div>
        )}
    </button>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
