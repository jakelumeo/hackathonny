"use client";

import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useState } from "react";

const rays = 8;

/**
 * Hook to get the opacity for the ray at the specified index.
 *
 * @param index the ray index
 * @returns the ray opacity
 */
function useRayOpacity(index: number) {
    const [opacity, setOpacity] = useState(0);
    const { scrollYProgress } = useScroll();

    const minRayProgress = index / rays;
    const maxRayProgress = (index + 1) / rays;
    const scrollProgressRange = [minRayProgress, maxRayProgress];

    const opacityRange = [0, 1];

    const opacityMotionValue = useTransform(
        scrollYProgress,
        scrollProgressRange,
        opacityRange,
    );
    useMotionValueEvent(opacityMotionValue, "change", setOpacity);

    return opacity;
}

/**
 * Individual ray of logo that uses its index to apply necessary styles.
 *
 * @param props the component props
 * @param props.index the ray index (`0` to `rays - 1`)
 * @returns the ray component for the specified index
 */
function Ray(props: { index: number }) {
    const opacity = useRayOpacity(props.index);
    const angle = (props.index / rays) * 360;
    return (
        <div
            className="absolute top-1/2 left-1/2 h-1/4 w-1/12 -translate-x-1/2 -translate-y-full rounded-full bg-orange-500"
            style={{
                opacity: opacity,
                transformOrigin: "bottom center",
                transform: `rotate(${-angle}deg) translateY(-125%)`,
            }}
        ></div>
    );
}

/**
 * Animated logo for the header. Sun ray animation is linked to scroll.
 * Default size of logo is `size-8`.
 *
 * @param props the component props
 * @returns animated logo component
 */
export function AnimatedLogo(
    props: Pick<React.ComponentPropsWithoutRef<"div">, "className">,
) {
    return (
        <div className={cn("relative size-8", props.className)}>
            <div className="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-1/2 rounded-full bg-orange-500"></div>
            {Array.from({ length: rays }, (_, i) => i).map((index) => (
                <Ray key={index} index={index} />
            ))}
        </div>
    );
}
