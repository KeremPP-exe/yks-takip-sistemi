import { useEffect, useState } from "react";

export function useCountUp(end: number, duration: number = 1500) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // easeOutQuart formula for smooth deceleration
            const ease = 1 - Math.pow(1 - progress, 4);
            setCount(end * ease);

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        animationFrame = window.requestAnimationFrame(step);

        return () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, duration]);

    return count;
}
