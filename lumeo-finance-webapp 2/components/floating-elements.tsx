export function FloatingElements() {
    return (
        <div className="pointer-events-none fixed inset-0">
            <div
                className="absolute top-1/5 left-1/12 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400/10 to-orange-600/5"
                style={{ animation: "var(--animate-float)" }}
            />
            <div
                className="absolute top-3/5 right-1/6 h-15 w-15 rounded-full bg-gradient-to-br from-orange-400/10 to-orange-600/5"
                style={{ animation: "var(--animate-float-delayed-2)" }}
            />
            <div
                className="absolute bottom-1/3 left-1/6 h-20 w-20 rounded-full bg-gradient-to-br from-orange-400/10 to-orange-600/5"
                style={{ animation: "var(--animate-float-delayed-4)" }}
            />
        </div>
    );
}
