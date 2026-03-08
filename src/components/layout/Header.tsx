import { Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export function Header({ toggleMobileNav }: { toggleMobileNav?: () => void }) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme");
            if (saved) return saved === "dark";
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleMobileNav}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="md:hidden font-semibold text-lg bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                    ProTracker
                </div>
            </div>

            <div className="flex justify-end w-full">
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center bg-card shadow-sm border border-border"
                    aria-label="Toggle Dark Mode"
                >
                    {isDark ? (
                        <Moon size={18} className="text-secondary-400" />
                    ) : (
                        <Sun size={18} className="text-amber-500" />
                    )}
                </button>
            </div>
        </header>
    );
}
