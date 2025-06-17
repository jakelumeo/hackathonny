"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface EntryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EntryModal({ isOpen, onClose }: EntryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md border-none bg-white p-8 text-center"
                showCloseButton={false}
            >
                <DialogHeader className="mb-6 space-y-4 text-center">
                    <DialogTitle className="text-2xl text-slate-800">
                        🚀 Ready to Level Up?
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-600">
                        Start your savings journey with Lumeo.
                    </DialogDescription>
                </DialogHeader>
                <button
                    onClick={onClose}
                    className="cursor-pointer rounded-[25px] border-none bg-gradient-to-r from-orange-400 to-orange-600 px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                >
                    Join the Waitlist
                </button>
            </DialogContent>
        </Dialog>
    );
}
