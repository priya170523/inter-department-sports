import React from "react";
import { cn } from "../../lib/utils";

export default function GlowingCard({ children, className }) {
    return (
        <div className={cn("relative group/card", className)}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover/card:opacity-100 transition duration-1000 group-hover/card:duration-200"></div>
            <div className="relative h-full bg-surface border border-white/10 rounded-2xl p-4 overflow-hidden shadow-xl drop-shadow-xl backdrop-blur-xl">
                {children}
            </div>
        </div>
    );
}

export function GlowingCardTitle({ children, className }) {
    return (
        <h3 className={cn("text-xl font-bold text-gray-100 mb-2", className)}>
            {children}
        </h3>
    );
}

export function GlowingCardDescription({ children, className }) {
    return (
        <p className={cn("text-gray-400 text-sm", className)}>
            {children}
        </p>
    );
}
