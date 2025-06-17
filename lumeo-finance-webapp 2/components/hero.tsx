"use client";

import type React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { sendGoogleAnalyticsEvent } from "./analytics";

type HeroStats = { value: string; label: string; suffix?: string };

const heroStats: HeroStats[] = [
    { value: "2.3", suffix: "M", label: "Automatically Saved" },
    { value: "87", suffix: "%", label: "Feel More Confident" },
    { value: "3.2", suffix: "x", label: "Faster Goal Achievement" },
];

const containerAnimation: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
};

const delayedContainerAnimation = (delay: number): HTMLMotionProps<"div"> => ({
    ...containerAnimation,
    transition: { ...containerAnimation.transition, delay },
});

export function Hero() {
    const handleCTAClick = (label: string) => {
        sendGoogleAnalyticsEvent("click", {
            event_category: "engagement",
            event_label: label,
        });
    };

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="mx-auto max-w-6xl px-10 pt-[120px] pb-[60px] text-center">
            <motion.div
                {...containerAnimation}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-600"
            >
                🚀 Real people, real results, real money saved
            </motion.div>

            <motion.h1
                {...delayedContainerAnimation(0.2)}
                className="mb-6 bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-4xl leading-[1.1] font-extrabold text-transparent md:text-5xl lg:text-6xl"
            >
                Stop Stressing About Money. Start Succeeding With It.
            </motion.h1>

            <motion.p
                {...delayedContainerAnimation(0.4)}
                className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-500"
            >
                Lumeo transforms financial anxiety into confidence with
                automated savings, AI-powered guidance, and a supportive
                community. Finally, a finance app that works with your
                lifestyle, not against it.
            </motion.p>

            <motion.div
                {...delayedContainerAnimation(0.6)}
                className="mb-[60px] flex flex-wrap items-center justify-center gap-4"
            >
                <a
                    href="#waitlist"
                    className="rounded-full bg-gradient-to-r from-orange-400 to-orange-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-400/40"
                    onClick={(e) => {
                        handleNavClick(e, "#waitlist");
                        handleCTAClick("Join the Movement");
                    }}
                >
                    Join the Movement
                </a>
                <a
                    href="#beta"
                    className="flex items-center gap-2 px-6 py-4 font-medium text-slate-500 transition-colors duration-300 hover:text-orange-400"
                    onClick={(e) => {
                        handleNavClick(e, "#beta");
                        handleCTAClick("See Beta Preview");
                    }}
                >
                    See Beta Preview →
                </a>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-12">
                {heroStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <span className="block text-3xl font-bold text-orange-400">
                            {stat.value}
                            {stat.suffix}
                        </span>
                        <span className="mt-1 text-sm text-slate-500">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
