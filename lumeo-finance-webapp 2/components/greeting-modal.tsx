"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GreetingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onScrollToWaitlist: () => void;
}

export function GreetingModal({
    open,
    onOpenChange,
    onScrollToWaitlist,
}: GreetingModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="border-none bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] sm:max-w-md"
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl text-slate-800">
                        😎 We&apos;re glad you are here!
                    </DialogTitle>
                </DialogHeader>
                <p className="mb-6 text-base text-slate-600">
                    You are so close to being a founding member of the team!
                </p>
                <Button
                    onClick={() => {
                        onOpenChange(false);
                        onScrollToWaitlist();
                    }}
                    className="w-full rounded-[25px] bg-gradient-to-r from-orange-400 to-orange-600 px-6 py-3 text-base font-semibold text-white hover:from-orange-500 hover:to-orange-700"
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}
