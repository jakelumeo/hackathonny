import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Lumeo - Turn Saving Into Your Superpower",
    description:
        "Lumeo transforms financial anxiety into confidence with automated savings, AI-powered guidance, and a supportive community.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <GoogleAnalytics trackingId={process.env.GA_TRACKING_ID} />
                <Suspense>{children}</Suspense>
            </body>
        </html>
    );
}
