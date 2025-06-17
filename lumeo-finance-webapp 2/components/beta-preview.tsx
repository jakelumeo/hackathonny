"use client";

import { useEffect, useRef } from "react";
import {
    motion,
    useInView,
    type HTMLMotionProps,
    type Variants,
} from "motion/react";
import { sendGoogleAnalyticsEvent } from "./analytics";

type BetaFeature = { icon: string; text: string };

const betaFeatures: BetaFeature[] = [
    { icon: "🧠", text: "Smart Spending Alerts" },
    { icon: "💸", text: "Automated Round-Ups" },
    { icon: "📈", text: "Real-Time Impact Tracking" },
    { icon: "👥", text: "Community Challenges" },
    { icon: "🎓", text: "Interactive Learning" },
    { icon: "🔒", text: "Bank-Level Security" },
];

const featureContainerAnimation: HTMLMotionProps<"div"> & {
    variants: Variants;
} = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-100px" },
    variants: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delayChildren: 0.3, staggerChildren: 0.1 },
        },
    },
};

const featureItemAnimation: HTMLMotionProps<"div"> & { variants: Variants } = {
    variants: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    },
};

const headerAnimation: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 },
};

const delayedHeaderAnimation = (delay: number): HTMLMotionProps<"div"> => ({
    ...headerAnimation,
    transition: { ...headerAnimation.transition, delay },
});

const buttonAnimation: HTMLMotionProps<"button"> = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 },
};

export function BetaPreview() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            sendGoogleAnalyticsEvent("page_view", {
                event_category: "section_view",
                event_label: "beta",
            });
        }
    }, [isInView]);

    const handleCTAClick = () => {
        sendGoogleAnalyticsEvent("click", {
            event_category: "engagement",
            event_label: "Get Early Access",
        });

        const waitlistSection = document.getElementById("waitlist");
        if (waitlistSection) {
            waitlistSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <section
            id="beta"
            className="bg-gradient-to-br from-orange-400/3 to-orange-600/5 px-10 py-20"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-[60px] text-center">
                    <motion.h2
                        {...headerAnimation}
                        className="mb-4 text-4xl font-bold text-slate-800"
                    >
                        Experience the Future of Finance
                    </motion.h2>
                    <motion.p
                        {...delayedHeaderAnimation(0.2)}
                        className="mx-auto max-w-lg text-lg leading-relaxed text-slate-500"
                    >
                        Join our beta program and be among the first to try
                        these game-changing features
                    </motion.p>
                </div>

                <motion.div
                    ref={ref}
                    {...featureContainerAnimation}
                    className="mb-[60px] grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6"
                >
                    {betaFeatures.map((feature) => (
                        <motion.div
                            key={feature.text}
                            {...featureItemAnimation}
                            className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/30 bg-white/70 p-6 text-center backdrop-blur-[10px] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <span className="text-3xl">{feature.icon}</span>
                            <span className="text-sm font-medium text-slate-700">
                                {feature.text}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="text-center">
                    <motion.button
                        {...buttonAnimation}
                        onClick={handleCTAClick}
                        className="rounded-full bg-gradient-to-r from-orange-400 to-orange-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-400/40"
                    >
                        Get Early Access
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
