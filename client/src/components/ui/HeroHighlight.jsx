import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const HeroHighlight = ({
    children,
    className,
    containerClassName,
}) => {
    return (
        <div
            className={cn(
                "relative h-[40rem] flex items-center justify-center w-full group overflow-hidden",
                containerClassName
            )}
        >
            <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />

            <div className={cn("relative z-20", className)}>{children}</div>

            <div className="absolute inset-0 bg-background/50 blur-3xl -z-10" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/0 blur-[100px] -z-20"
            />
        </div>
    );
};

export const Highlight = ({
    children,
    className,
}) => {
    return (
        <motion.span
            initial={{
                backgroundSize: "0% 100%",
            }}
            animate={{
                backgroundSize: "100% 100%",
            }}
            transition={{
                duration: 2,
                ease: "linear",
                delay: 0.5,
            }}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                display: "inline",
            }}
            className={cn(
                `relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-primary to-secondary`,
                className
            )}
        >
            {children}
        </motion.span>
    );
};
