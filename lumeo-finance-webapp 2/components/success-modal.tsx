"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

export function SuccessModal({ isOpen, onClose, name }: SuccessModalProps) {
    useEffect(() => {
        if (isOpen) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md border-none bg-white p-10 text-center"
                showCloseButton={false}
            >
                <DialogHeader className="mb-6 space-y-4 text-center">
                    <DialogTitle className="text-2xl text-slate-800">
                        🎉 You&apos;re In, {name}!
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-600">
                        You are so close to being a founding member of the team!
                    </DialogDescription>
                </DialogHeader>
                <button
                    onClick={onClose}
                    className="cursor-pointer rounded-[25px] border-none bg-gradient-to-r from-orange-400 to-orange-600 px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                >
                    Close
                </button>
            </DialogContent>
        </Dialog>
    );
}
