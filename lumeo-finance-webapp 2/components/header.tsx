"use client";

import type React from "react";
import { sendGoogleAnalyticsEvent } from "./analytics";
import { AnimatedLogo } from "./animated-logo";

function scrollTargetIntoView(target: HTMLElement) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target instanceof HTMLElement) {
            scrollTargetIntoView(target);
        }
    };

    const handleCTAClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        sendGoogleAnalyticsEvent("click", {
            event_category: "engagement",
            event_label: "Join Waitlist",
        });
        handleNavClick(e, href);
    };

    return (
        <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-slate-200/30 bg-[rgba(248,250,252,0.9)] px-10 py-5 backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center gap-4">
                <AnimatedLogo className="size-12" />
                <span className="text-3xl font-bold tracking-tight text-slate-700">
                    Lumeo
                </span>
            </div>

            <nav className="hidden items-center gap-8 md:flex">
                <a
                    href="#features"
                    className="rounded-lg px-4 py-2 text-base font-medium text-slate-500 transition-all duration-300 hover:bg-orange-400/10 hover:text-orange-400"
                    onClick={(e) => handleNavClick(e, "#features")}
                >
                    Features
                </a>
                <a
                    href="#beta"
                    className="rounded-lg px-4 py-2 text-base font-medium text-slate-500 transition-all duration-300 hover:bg-orange-400/10 hover:text-orange-400"
                    onClick={(e) => handleNavClick(e, "#beta")}
                >
                    Beta
                </a>
                <a
                    href="#community"
                    className="rounded-lg px-4 py-2 text-base font-medium text-slate-500 transition-all duration-300 hover:bg-orange-400/10 hover:text-orange-400"
                    onClick={(e) => handleNavClick(e, "#community")}
                >
                    Community
                </a>
                <a
                    href="#waitlist"
                    className="rounded-full bg-gradient-to-r from-orange-400 to-orange-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/40"
                    onClick={(e) => handleCTAClick(e, "#waitlist")}
                >
                    Join Waitlist
                </a>
            </nav>
        </header>
    );
}
