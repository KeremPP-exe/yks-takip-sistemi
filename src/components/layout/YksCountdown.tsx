import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export function YksCountdown() {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

    function calculateTimeLeft() {
        // Hedef YKS Tarihi (Örnek: 20 Haziran 2026, 10:15)
        // Eğer hedef tarih geçerse, bir sonraki yıla da güncellenebilir.
        const targetDate = new Date('2026-06-20T10:15:00').getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 10000); // 10 saniyede bir güncelle

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="p-4 mt-auto mb-6 mx-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl relative overflow-hidden group shadow-sm">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary-500/20 rounded-full blur-xl group-hover:bg-primary-500/30 transition-colors duration-500"></div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
                <Timer size={18} className="text-primary-600 dark:text-primary-400 animate-pulse" />
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 tracking-tight">YKS'ye Kalan Süre</h3>
            </div>

            <div className="flex items-center justify-between text-center relative z-10">
                <div className="flex flex-col items-center bg-card/80 dark:bg-card/50 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-border/50 min-w-[3.5rem] shadow-sm">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400 leading-none">{timeLeft.days}</span>
                    <span className="text-[9px] text-slate-500 uppercase mt-1 font-bold">Gün</span>
                </div>
                <div className="text-border dark:text-slate-600 font-bold mb-3">:</div>
                <div className="flex flex-col items-center bg-card/80 dark:bg-card/50 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-border/50 min-w-[3.5rem] shadow-sm">
                    <span className="text-xl font-bold text-slate-700 dark:text-slate-300 leading-none">{timeLeft.hours}</span>
                    <span className="text-[9px] text-slate-500 uppercase mt-1 font-bold">Saat</span>
                </div>
                <div className="text-border dark:text-slate-600 font-bold mb-3">:</div>
                <div className="flex flex-col items-center bg-card/80 dark:bg-card/50 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-border/50 min-w-[3.5rem] shadow-sm">
                    <span className="text-xl font-bold text-slate-700 dark:text-slate-300 leading-none">{timeLeft.minutes}</span>
                    <span className="text-[9px] text-slate-500 uppercase mt-1 font-bold">Dk</span>
                </div>
            </div>
        </div>
    );
}
