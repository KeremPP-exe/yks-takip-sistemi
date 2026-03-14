import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { LayoutDashboard, History, PlusCircle, Settings, GraduationCap, Calendar as CalendarIcon, X, BookOpen, Calculator, ListChecks } from "lucide-react";
import { YksCountdown } from "./YksCountdown";

interface SidebarProps {
    onClose?: () => void;
    isMobile?: boolean;
}

export function Sidebar({ onClose, isMobile }: SidebarProps) {
    const location = useLocation();

    const navigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Yeni Deneme", href: "/add", icon: PlusCircle },
        { name: "Geçmiş", href: "/history", icon: History },
        { name: "Çalışma Günlüğü", href: "/calendar", icon: CalendarIcon },
        { name: "Ayarlar", href: "/settings", icon: Settings },
        { name: "Sıralama Hesaplama", href: "/siralamam-ne", icon: Calculator },
        { name: "Konu Takibi", href: "/konu-takibi", icon: ListChecks },
        { name: "Nasıl Kullanılır", href: "/kullanim-kilavuzu", icon: BookOpen },
    ];

    return (
        <div className={cn(
            "flex flex-col bg-card border-r border-border min-h-screen pt-4 transition-all",
            isMobile ? "w-full" : "hidden md:flex w-64 h-screen sticky top-0"
        )}>
            <div className="flex items-center justify-between px-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-500 text-white p-2 rounded-xl shadow-lg shadow-primary-500/30">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                            ProTracker
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">YKS Analiz</p>
                    </div>
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-1.5 p-4 mt-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-500/10"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-md shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            )}
                            <item.icon className={cn("shrink-0", isActive ? "text-primary-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <YksCountdown />
        </div>
    );
}
