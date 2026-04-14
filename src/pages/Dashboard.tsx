import { useTrialContext } from "../context/TrialContext";
import { Link } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Award, Target, Activity, PlusCircle, Trophy, BarChart3 } from "lucide-react";
import { calculateYksScores, estimateRank } from "../lib/calculator";
import { useCountUp } from "../lib/useCountUp";
import { TargetAnalysisPanel } from "../components/dashboard/TargetAnalysisPanel";
import { cn } from "../lib/utils";


export default function Dashboard() {
    const { trials, obp, targetScores, userField } = useTrialContext();

    if (trials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <Target className="w-12 h-12 text-primary-500" />
                </div>
                <div className="max-w-md space-y-2">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Henüz Veri Yok</h2>
                    <p className="text-muted-foreground text-slate-500">Gelişiminizi takip etmek ve detaylı analizleri görmek için ilk denemenizi ekleyin.</p>
                </div>
                <Link
                    to="/add"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 active:scale-95"
                >
                    <PlusCircle size={20} />
                    <span>İlk Denemeyi Ekle</span>
                </Link>
            </div>
        );
    }

    // Calculate Stats
    const latestTrial = trials[trials.length - 1];

    // Animation specific context computation
    const scores = calculateYksScores(latestTrial.tyt, latestTrial.ayt, obp);
    const displayScore = userField === "SAY" ? scores.aytSayPlacement : scores.aytEaPlacement;
    const animatedScore = useCountUp(displayScore);
    const currentRank = estimateRank(displayScore, userField);

    const bestTyt = Math.max(...trials.map(t => t.tyt.total));
    const bestAyt = Math.max(...trials.map(t => t.ayt.total));

    const avgTyt = trials.reduce((sum, t) => sum + t.tyt.total, 0) / trials.length;
    const avgAyt = trials.reduce((sum, t) => sum + t.ayt.total, 0) / trials.length;

    // Prepare Chart Data
    const chartData = trials.map(t => ({
        name: t.name,
        Tarih: new Date(t.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
        TYT: t.tyt.total,
        AYT: t.ayt.total,
        'TYT Türkçe': t.tyt.turkish,
        'TYT Sosyal': t.tyt.social,
        'TYT Mat': t.tyt.math,
        'TYT Fen': t.tyt.science,
        'AYT Mat': t.ayt.math,
        'AYT Fizik': t.ayt.physics,
        'AYT Kimya': t.ayt.chemistry,
        'AYT Biyoloji': t.ayt.biology,
        'AYT Edebiyat': t.ayt.literature,
        'AYT Tarih': t.ayt.history,
        'AYT Coğrafya': t.ayt.geography,
    }));

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Genel Bakış</h1>
                <p className="text-muted-foreground text-slate-500">Performans istatistikleriniz ve detaylı gelişim analiziniz.</p>
            </div>

            <TargetAnalysisPanel latestTrial={latestTrial} targetScores={targetScores} userField={userField} />

            {/* Glowing Placement Card */}
            <div className={cn(
                "relative group rounded-3xl p-1 shadow-xl overflow-hidden transition-all duration-500",
                userField === "SAY"
                    ? "bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500 hover:shadow-primary-500/25"
                    : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 hover:shadow-indigo-500/25"
            )}>
                <div className={cn(
                    "absolute inset-0 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500",
                    userField === "SAY" ? "bg-gradient-to-r from-primary-600 to-teal-500" : "bg-gradient-to-r from-indigo-600 to-purple-500"
                )}></div>

                <div className="relative bg-card dark:bg-slate-900/90 backdrop-blur-xl rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn(
                                "p-2 rounded-lg",
                                userField === "SAY" ? "bg-primary-50 dark:bg-primary-500/10" : "bg-indigo-50 dark:bg-indigo-500/10"
                            )}>
                                <Trophy size={24} className={userField === "SAY" ? "text-primary-500" : "text-indigo-500"} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Tahmini Yerleştirme Puanın ({userField})
                            </h2>
                        </div>
                        <p className={cn(
                            "text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent mb-2",
                            userField === "SAY" ? "bg-gradient-to-r from-primary-500 to-teal-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
                        )}>
                            {animatedScore.toFixed(2)}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 border border-border/50 shadow-sm">
                                <BarChart3 size={14} className={userField === "SAY" ? "text-primary-500" : "text-indigo-500"} />
                                2025 Tahmini Sıra: <strong className="text-slate-900 dark:text-white">{currentRank}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                            <span>Başlangıç</span>
                            <span>Hedef (560)</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-border/50">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000 ease-out relative",
                                    userField === "SAY" ? "bg-gradient-to-r from-primary-500 to-teal-400" : "bg-gradient-to-r from-indigo-500 to-purple-400"
                                )}
                                style={{ width: `${Math.min((displayScore / 560) * 100, 100)}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-xs text-right mt-2 text-slate-400 font-medium">Maksimum puan üzerinden ilerleme</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                <StatCard
                    title="Son TYT Neti"
                    value={latestTrial.tyt.total.toString()}
                    subtitle={`${latestTrial.name} (${new Date(latestTrial.date).toLocaleDateString('tr-TR')})`}
                    icon={Activity}
                    trend={trials.length > 1 ? latestTrial.tyt.total - trials[trials.length - 2].tyt.total : 0}
                    colorClass="text-primary-500"
                    bgClass="bg-primary-50 dark:bg-primary-500/10"
                />
                <StatCard
                    title="Son AYT Neti"
                    value={latestTrial.ayt.total.toString()}
                    subtitle={`${latestTrial.name} (${new Date(latestTrial.date).toLocaleDateString('tr-TR')})`}
                    icon={Activity}
                    trend={trials.length > 1 ? latestTrial.ayt.total - trials[trials.length - 2].ayt.total : 0}
                    colorClass={userField === "SAY" ? "text-primary-500" : "text-indigo-500"}
                    bgClass={userField === "SAY" ? "bg-primary-50 dark:bg-primary-500/10" : "bg-indigo-50 dark:bg-indigo-500/10"}
                />
                <StatCard
                    title="Ortalama Netler"
                    value={`${avgTyt.toFixed(1)} / ${avgAyt.toFixed(1)}`}
                    subtitle="Tüm zamanların ortalaması (TYT / AYT)"
                    icon={TrendingUp}
                    colorClass="text-teal-500"
                    bgClass="bg-teal-50 dark:bg-teal-500/10"
                />
                <StatCard
                    title="En Yüksek Netler"
                    value={`${bestTyt} / ${bestAyt}`}
                    subtitle="TYT ve AYT rekorlarınız"
                    icon={Award}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-50 dark:bg-amber-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Progression Line Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Genel Net Gelişimi</h3>
                        <p className="text-sm text-slate-500">Zaman içindeki toplam TYT ve AYT netleriniz</p>
                    </div>
                    <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                                    itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                                <Line type="monotone" dataKey="TYT" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="AYT" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TYT Subjects Line Chart */}
                <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">TYT Ders Gelişimi</h3>
                        <p className="text-sm text-slate-500">TYT branş netlerindeki değişiminiz</p>
                    </div>
                    <div className="h-64 mt-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
                                <Line type="monotone" name="Türkçe" dataKey="TYT Türkçe" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" name="Sosyal" dataKey="TYT Sosyal" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" name="Matematik" dataKey="TYT Mat" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" name="Fen" dataKey="TYT Fen" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Subject Line Chart */}
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">AYT Derslerinin Gelişimi</h3>
                    <p className="text-sm text-slate-500">Seçili alanınıza ({userField}) ait AYT branş netlerindeki değişim</p>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                                itemStyle={{ fontWeight: 500, fontSize: '14px' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                            <Line type="monotone" name="AYT Matematik" dataKey="AYT Mat" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            {userField === "SAY" ? (
                                <>
                                    <Line type="monotone" name="Fizik" dataKey="AYT Fizik" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Kimya" dataKey="AYT Kimya" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Biyoloji" dataKey="AYT Biyoloji" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </>
                            ) : (
                                <>
                                    <Line type="monotone" name="Edebiyat" dataKey="AYT Edebiyat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Tarih" dataKey="AYT Tarih" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Coğrafya" dataKey="AYT Coğrafya" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </>
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    colorClass,
    bgClass
}: {
    title: string,
    value: string,
    subtitle: string,
    icon: any,
    trend?: number,
    colorClass: string,
    bgClass: string
}) {
    return (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${bgClass}`}>
                    <Icon size={20} className={colorClass} />
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
                {trend !== undefined && trend !== 0 && (
                    <span className={`font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'} flex border ${trend > 0 ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-red-500/20 bg-red-500/10'} px-1.5 py-0.5 rounded-md`}>
                        {trend > 0 ? '+' : ''}{trend}
                    </span>
                )}
                <span className="text-slate-400 truncate">{subtitle}</span>
            </div>
        </div>
    );
}
