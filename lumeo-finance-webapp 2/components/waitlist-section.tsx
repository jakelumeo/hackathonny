"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { sendGoogleAnalyticsEvent } from "./analytics";

interface WaitlistSectionProps {
    onSuccess: (name: string) => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
}

interface FormErrors {
    name: string;
    email: string;
    phone: string;
}

const containerAnimation: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 },
};

const delayedContainerAnimation = (delay: number): HTMLMotionProps<"div"> => ({
    ...containerAnimation,
    transition: { ...containerAnimation.transition, delay },
});

export function WaitlistSection({ onSuccess }: WaitlistSectionProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState<FormErrors>({
        name: "",
        email: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formInteracted, setFormInteracted] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            sendGoogleAnalyticsEvent("page_view", {
                event_category: "section_view",
                event_label: "waitlist",
            });
        }
    }, [isInView]);

    // Track form abandonment
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (formInteracted && !isSubmitting) {
                if (typeof window !== "undefined") {
                    sendGoogleAnalyticsEvent("form_abandon", {
                        event_category: "waitlist",
                        event_label: "partial_form_exit",
                    });
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [formInteracted, isSubmitting]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormInteracted(true);

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = { name: "", email: "", phone: "" };

        if (
            !formData.name.trim() ||
            formData.name.trim().split(" ").length < 2
        ) {
            newErrors.name = "Please enter your full name (first and last).";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Please enter a valid email.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Please enter your phone number.";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Submit to Google Sheets
            await fetch(
                "https://script.google.com/macros/s/AKfycbw3f2_3apOzHnNm9jnBm7m6Ud3-Zvcyb7uZK1suSzPBHiB8j7G3liS5C3Yg47_nkGcW/exec",
                {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                },
            );

            // Track conversion
            sendGoogleAnalyticsEvent("conversion", {
                send_to: "G-5BJC77BLJ5",
                event_category: "waitlist",
                event_label: "signup_success",
            });

            const firstName = formData.name.trim().split(" ")[0];
            onSuccess(firstName);

            // Reset form
            setFormData({ name: "", email: "", phone: "" });
            setFormInteracted(false);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            ref={ref}
            id="waitlist"
            className="bg-gradient-to-br from-orange-400/3 to-orange-600/5 px-10 py-20"
        >
            <motion.div {...containerAnimation} className="mx-auto max-w-6xl">
                <div className="mb-[60px] text-center">
                    <motion.h2
                        {...containerAnimation}
                        className="mb-4 text-4xl font-bold text-slate-800"
                    >
                        Join the Financial Revolution
                    </motion.h2>
                    <motion.p
                        {...delayedContainerAnimation(0.2)}
                        className="mx-auto max-w-lg text-lg leading-relaxed text-slate-500"
                    >
                        Be among the first to experience Lumeo and transform
                        your relationship with money
                    </motion.p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-md flex-col gap-4"
                >
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className="w-full rounded-3xl border-none bg-white/95 px-5 py-4 text-base text-slate-800 outline-none"
                            required
                        />
                        {errors.name && (
                            <div className="mt-1 text-left text-sm text-red-400">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Your email address"
                            className="w-full rounded-3xl border-none bg-white/95 px-5 py-4 text-base text-slate-800 outline-none"
                            required
                        />
                        {errors.email && (
                            <div className="mt-1 text-left text-sm text-red-400">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Your phone number"
                            className="w-full rounded-3xl border-none bg-white/95 px-5 py-4 text-base text-slate-800 outline-none"
                            required
                        />
                        {errors.phone && (
                            <div className="mt-1 text-left text-sm text-red-400">
                                {errors.phone}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-3xl border-none bg-gradient-to-r from-orange-400 to-orange-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/40 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Joining..." : "Join Waitlist"}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}
