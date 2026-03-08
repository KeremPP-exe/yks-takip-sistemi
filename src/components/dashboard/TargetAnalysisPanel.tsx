import { type TrialModel, type TargetScoresModel } from "../../types";
import { Target, GraduationCap } from "lucide-react";
import { useCountUp } from "../../lib/useCountUp";

interface Props {
    latestTrial: TrialModel;
    targetScores: TargetScoresModel;
    userField: "SAY" | "EA";
}

export function TargetAnalysisPanel({ latestTrial, targetScores, userField }: Props) {
    const subjects = [
        { label: "TYT Türkçe", current: latestTrial.tyt.turkish, target: targetScores.tyt.turkish },
        { label: "TYT Sosyal", current: latestTrial.tyt.social, target: targetScores.tyt.social },
        { label: "TYT Matematik", current: latestTrial.tyt.math, target: targetScores.tyt.math },
        { label: "TYT Fen", current: latestTrial.tyt.science, target: targetScores.tyt.science },
        { label: "AYT Matematik", current: latestTrial.ayt.math, target: targetScores.ayt.math },
        ...(userField === "SAY" ? [
            { label: "AYT Fizik", current: latestTrial.ayt.physics, target: targetScores.ayt.physics },
            { label: "AYT Kimya", current: latestTrial.ayt.chemistry, target: targetScores.ayt.chemistry },
            { label: "AYT Biyoloji", current: latestTrial.ayt.biology, target: targetScores.ayt.biology },
        ] : [
            { label: "AYT Edebiyat", current: latestTrial.ayt.literature, target: targetScores.ayt.literature },
            { label: "AYT Tarih-1", current: latestTrial.ayt.history, target: targetScores.ayt.history },
            { label: "AYT Coğrafya-1", current: latestTrial.ayt.geography, target: targetScores.ayt.geography },
        ])
    ];

    const validSubjects = subjects.filter(s => {
        // Her zaman hedefi olanları göster
        if (s.target > 0) return true;

        // Alan derslerini hedef 0 olsa bile göster (kullanıcıyı hedef belirlemeye teşvik eder)
        const fieldRelevantLabels = userField === "SAY"
            ? ["AYT Fizik", "AYT Kimya", "AYT Biyoloji"]
            : ["AYT Edebiyat", "AYT Tarih-1", "AYT Coğrafya-1"];

        return fieldRelevantLabels.includes(s.label);
    });

    if (validSubjects.length === 0) {
        return null; // Don't show if no targets are set
    }

    // Hesaplama: Hedefi aşan derslerde max ulaşılan değer "hedef" oranında sayılır
    const totalEffectiveCurrent = validSubjects.reduce((acc, s) => acc + Math.min(s.current, s.target), 0);
    const totalTarget = validSubjects.reduce((acc, s) => acc + s.target, 0);

    const percent = totalTarget > 0 ? (totalEffectiveCurrent / totalTarget) * 100 : 0;

    const animatedPercent = useCountUp(percent, 1500);

    return (
        <div className="bg-gradient-to-br from-card to-card/50 border border-border shadow-md rounded-[24px] p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity duration-500 opacity-50 group-hover:opacity-100 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                            <Target className="text-emerald-500" size={24} />
                        </div>
                        Hedefe Ne Kadar Yakınsın?
                    </h2>
                    {(targetScores.university || targetScores.department) && (
                        <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-max px-3 py-1 rounded-lg border border-emerald-500/20">
                            <GraduationCap size={16} />
                            {targetScores.university && <span>{targetScores.university}</span>}
                            {targetScores.university && targetScores.department && <span>-</span>}
                            {targetScores.department && <span>{targetScores.department}</span>}
                        </div>
                    )}
                    <p className="text-slate-500 font-medium mt-2 text-sm">Son denemen ile hedeflerin karşılaştırılıyor.</p>
                </div>
                <div className="text-left md:text-right bg-emerald-50 dark:bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-500/20">
                    <div className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Genel İlerleme</div>
                    <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        %{Math.round(animatedPercent)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 relative z-10">
                {validSubjects.map((s, i) => (
                    <SubjectBar key={i} item={s} />
                ))}
            </div>
        </div>
    );
}

function SubjectBar({ item }: { item: { label: string; current: number; target: number } }) {
    const isSuccess = item.target > 0 && item.current >= item.target;
    const diff = item.current - item.target;
    // Cap progress at 100% physically to avoid overflow, but log visually if exceeded
    const progress = item.target > 0 ? Math.min((item.current / item.target) * 100, 100) : 0;

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.target > 0
                    ? (isSuccess
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                        : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400')
                    : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'
                    }`}>
                    {item.target > 0
                        ? (isSuccess ? `Hedef Aşıldı (+${diff})` : `Kalan: ${diff.toFixed(2)}`)
                        : "Hedef Ayarlanmadı"
                    }
                </span>
            </div>

            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-border/50">
                <div
                    className={`h-full transition-all duration-1000 ease-out relative ${isSuccess ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-rose-500'}`}
                    style={{ width: `${progress}%` }}
                >
                    {isSuccess && <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 animate-pulse"></div>}
                </div>
            </div>

            <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500 dark:text-slate-400"><span className="text-slate-900 dark:text-white">{item.current}</span> Net</span>
                <span className="text-slate-400 dark:text-slate-500">Hedef: {item.target}</span>
            </div>
        </div>
    );
}
