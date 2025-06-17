"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { BetaPreview } from "@/components/beta-preview";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";
import { SuccessModal } from "@/components/success-modal";
import { EntryModal } from "@/components/entry-modal";
import { GreetingModal } from "@/components/greeting-modal";
import { sendGoogleAnalyticsEvent } from "@/components/analytics";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";

function useScrollAnalytics() {
    const [milestone, setMilestone] = useState(0);

    const { scrollYProgress } = useScroll();
    const scrollPercent = useTransform(() => scrollYProgress.get() * 100);

    useMotionValueEvent(scrollPercent, "change", (latestScrollPercent) => {
        const scrollMilestones = [0, 25, 50, 75, 100];
        const highestMilestoneReached = scrollMilestones.reduce(
            (highestScrollMilestone, scrollMilestone) =>
                latestScrollPercent >= scrollMilestone
                    ? scrollMilestone
                    : highestScrollMilestone,
            0,
        );
        if (highestMilestoneReached > milestone) {
            setMilestone(highestMilestoneReached);
            sendGoogleAnalyticsEvent("scroll_depth", {
                event_category: "engagement",
                event_label: highestMilestoneReached + "%",
            });
        }
    });
}

export default function HomePage() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [showGreetingModal, setShowGreetingModal] = useState(false);
    const [submittedName, setSubmittedName] = useState("");

    useScrollAnalytics();

    useEffect(() => {
        setShowGreetingModal(true);
    }, []);

    const handleWaitlistSuccess = (name: string) => {
        setSubmittedName(name);
        setShowSuccessModal(true);
    };

    const handleGreetingModalClose = () => {
        setShowGreetingModal(false);
        setShowEntryModal(true);

        sendGoogleAnalyticsEvent("modal_open", {
            event_category: "engagement",
            event_label: "entry_modal_shown",
        });
    };

    const handleEntryModalClose = () => {
        setShowEntryModal(false);

        sendGoogleAnalyticsEvent("click", {
            event_category: "engagement",
            event_label: "entry_modal_button",
        });

        // Scroll to waitlist
        const waitlistSection = document.getElementById("waitlist");
        if (waitlistSection) {
            waitlistSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <>
            <FloatingElements />
            <Header />
            <Hero />
            <Features />
            <BetaPreview />
            <WaitlistSection onSuccess={handleWaitlistSuccess} />
            <Footer />

            <GreetingModal
                open={showGreetingModal}
                onOpenChange={setShowGreetingModal}
                onScrollToWaitlist={() => {
                    handleGreetingModalClose();
                }}
            />

            <EntryModal
                isOpen={showEntryModal}
                onClose={handleEntryModalClose}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                name={submittedName}
            />
        </>
    );
}
