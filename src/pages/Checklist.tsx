import { useState, useMemo } from "react";
import { CheckCircle2, Circle, ListChecks, Trophy } from "lucide-react";
import { cn } from "../lib/utils";
import { useTrialContext } from "../context/TrialContext";
import { useStudyContext } from "../context/StudyContext";
import { SUBJECTS_DATA } from "../data/subjects";

export default function Checklist() {
    const { userField } = useTrialContext();
    const { checklist, toggleChecklist } = useStudyContext();
    
    // Filter subjects based on userField (SAY or EA)
    const availableSubjects = useMemo(() => {
        let subjects: { id: string; name: string; exam: "TYT" | "AYT"; topics: string[] }[] = [];
        
        // Always add TYT subjects
        Object.entries(SUBJECTS_DATA.TYT).forEach(([name, topics]) => {
            subjects.push({ id: `tyt-${name}`, name, exam: "TYT", topics });
        });

        // Conditionally add AYT subjects based on userField
        Object.entries(SUBJECTS_DATA.AYT).forEach(([name, topics]) => {
            if (userField === "SAY") {
                if (["AYT Matematik", "AYT Geometri", "AYT Fizik", "AYT Kimya", "AYT Biyoloji"].includes(name)) {
                    subjects.push({ id: `ayt-${name}`, name, exam: "AYT", topics });
                }
            } else if (userField === "EA") {
                if (["AYT Matematik", "AYT Geometri", "AYT Edebiyat", "AYT Tarih", "AYT Coğrafya"].includes(name)) {
                    subjects.push({ id: `ayt-${name}`, name, exam: "AYT", topics });
                }
            }
        });

        // Specific order: TYT first, then AYT
        return subjects;
    }, [userField]);

    const [activeSubjectId, setActiveSubjectId] = useState<string>(availableSubjects[0]?.id || "");

    const activeSubject = availableSubjects.find(s => s.id === activeSubjectId);

    // Calculate progress for the active subject
    const progress = useMemo(() => {
        if (!activeSubject) return 0;
        const total = activeSubject.topics.length;
        if (total === 0) return 0;
        
        const completed = activeSubject.topics.reduce((acc, topic) => {
            return acc + (checklist[`${activeSubject.id}-${topic}`] ? 1 : 0);
        }, 0);
        
        return Math.round((completed / total) * 100);
    }, [activeSubject, checklist]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
                            <ListChecks size={28} />
                        </div>
                        Konu Takibi
                    </h1>
                    <p className="text-slate-500 font-medium">TYT ve AYT ({userField}) konularındaki ilerlemenizi kaydedin.</p>
                </div>
            </div>

            {/* Subject Tabs */}
            <div className="bg-card border border-border rounded-2xl p-2 shadow-sm overflow-x-auto custom-scrollbar">
                <div className="flex gap-2 min-w-max">
                    {availableSubjects.map((subject) => {
                        const isTYT = subject.exam === "TYT";
                        const isActive = activeSubjectId === subject.id;
                        return (
                            <button
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                    isActive 
                                        ? isTYT 
                                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" 
                                            : "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                        : "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-md", 
                                    isActive ? "bg-white/20" : isTYT ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                )}>
                                    {isTYT ? 'TYT' : 'AYT'}
                                </span>
                                {subject.name.replace(/TYT |AYT /g, '')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Subject Checklist */}
            {activeSubject && (
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Progress Bar Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {activeSubject.name} İlerlemesi
                                {progress === 100 && <Trophy className="text-yellow-500" size={20} />}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                Toplam {activeSubject.topics.length} konunun {Math.round((progress / 100) * activeSubject.topics.length)} tanesi tamamlandı.
                            </p>
                        </div>
                        <div className="text-3xl font-extrabold bg-gradient-to-br from-primary-500 to-indigo-600 bg-clip-text text-transparent">
                            %{progress}
                        </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 ease-out",
                                activeSubject.exam === "TYT" ? "bg-blue-500" : "bg-orange-500",
                                progress === 100 && "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Topic List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                        {activeSubject.topics.map((topic) => {
                            const isCompleted = checklist[`${activeSubject.id}-${topic}`] || false;
                            
                            return (
                                <button
                                    key={topic}
                                    onClick={() => toggleChecklist(activeSubject.id, topic)}
                                    className={cn(
                                        "flex justify-between items-start text-left p-4 rounded-2xl border transition-all duration-200 group relative overflow-hidden",
                                        isCompleted 
                                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/5" 
                                            : "bg-slate-50/50 dark:bg-slate-800/30 border-border hover:border-slate-300 dark:hover:border-slate-600"
                                    )}
                                >
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                                    )}
                                    <span className={cn(
                                        "text-sm font-semibold leading-tight pr-4 relative z-10 transition-colors",
                                        isCompleted ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
                                    )}>
                                        {topic}
                                    </span>
                                    
                                    <div className="relative z-10 shrink-0 mt-0.5">
                                        {isCompleted ? (
                                            <CheckCircle2 className="text-emerald-500 drop-shadow-sm animate-in zoom-in duration-300" size={20} />
                                        ) : (
                                            <Circle className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" size={20} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
