"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, type MotionProps } from "motion/react";
import { sendGoogleAnalyticsEvent } from "./analytics";

const features = [
    {
        icon: "🤖",
        title: "AI Financial Advisor in Your Pocket",
        description:
            "Get personalized recommendations and see exactly how every purchase impacts your future. No more guessing, no more regret purchases.",
    },
    {
        icon: "⚡",
        title: "Effortless Automation That Actually Works",
        description:
            "Round-up savings, smart transfers, and automated budgeting that require zero daily effort. Save money while you sleep.",
    },
    {
        icon: "🎯",
        title: "Pre-Purchase Impact Simulator",
        description:
            "Visualize the real cost of any purchase before you buy. See how that $200 dinner affects your vacation fund in real-time.",
    },
    {
        icon: "🏆",
        title: "Turn Saving Into a Social Game",
        description:
            "Join savings challenges, compete with friends, and build wealth together. Finally, peer pressure that helps your bank account.",
    },
    {
        icon: "📚",
        title: "Financial Literacy Made Fun",
        description:
            "Interactive lessons and real-time coaching that build your confidence without the boring textbook approach.",
    },
    {
        icon: "🔗",
        title: "Everything Connected, Nothing Forgotten",
        description:
            "Unified platform for subscriptions, bills, budgets, and savings. One app to rule them all, zero things falling through the cracks.",
    },
];

const container: MotionProps = {
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

const item: MotionProps = {
    variants: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    },
};

export function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            sendGoogleAnalyticsEvent("page_view", {
                event_category: "section_view",
                event_label: "features",
            });
        }
    }, [isInView]);

    return (
        <section
            id="features"
            className="bg-gradient-to-br from-orange-400/3 to-orange-600/5 px-10 py-20"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-[60px] text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 text-4xl font-bold text-slate-800"
                    >
                        Financial Anxiety → Financial Confidence
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mx-auto max-w-lg text-lg leading-relaxed text-slate-500"
                    >
                        We solve the real problems that keep you up at night,
                        turning financial stress into financial success
                    </motion.p>
                </div>

                <motion.div
                    ref={ref}
                    {...container}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            {...item}
                            className="rounded-2xl border border-slate-200/30 bg-white/70 p-8 text-center backdrop-blur-[10px] transition-all duration-500 hover:-translate-0.5 hover:shadow-xl"
                        >
                            <div className="mx-auto mb-5 flex h-15 w-15 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl">
                                {feature.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-slate-800">
                                {feature.title}
                            </h3>
                            <p className="leading-relaxed text-slate-500">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
