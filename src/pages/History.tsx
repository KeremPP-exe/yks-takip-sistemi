import { useTrialContext } from "../context/TrialContext";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2, Calendar, Award, ChevronDown, ChevronUp, Trophy, BarChart3 } from "lucide-react";
import { useState, Fragment } from "react";
import { calculateYksScores, estimateRank } from "../lib/calculator";
import { cn } from "../lib/utils";

export default function History() {
    const { trials, deleteTrial, obp, userField } = useTrialContext();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm("Bu denemeyi silmek istediğinize emin misiniz?")) {
            deleteTrial(id);
            setDeleteId(null);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    if (trials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-primary-500" />
                </div>
                <div className="max-w-md space-y-2">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Kayıt Bulunamadı</h2>
                    <p className="text-muted-foreground text-slate-500">Geçmişte kaydedilmiş bir deneme bulunmuyor.</p>
                </div>
                <Link
                    to="/add"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 active:scale-95"
                >
                    <PlusCircle size={20} />
                    <span>Yeni Deneme Ekle</span>
                </Link>
            </div>
        );
    }

    // Sort trials by date descending
    const sortedTrials = [...trials].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Deneme Geçmişi</h1>
                    <p className="text-muted-foreground mt-1 text-slate-500">Önceki sınav verileriniz ve sonuçlarınız.</p>
                </div>
                <Link
                    to="/add"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 active:scale-95"
                >
                    <PlusCircle size={18} />
                    <span>Yeni Ekle</span>
                </Link>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-border">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Tarih</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Sınav Adı</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-center">TYT</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-center">AYT</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-center">Toplam</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedTrials.map((trial) => (
                                <Fragment key={trial.id}>
                                    <tr
                                        onClick={() => toggleExpand(trial.id)}
                                        className="bg-card hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                                                <Calendar size={16} className="text-slate-400" />
                                                {new Date(trial.date).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                                {expandedId === trial.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                                {trial.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 font-semibold min-w-[3rem]">
                                                {trial.tyt.total}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-secondary-50 dark:bg-secondary-500/10 text-secondary-600 font-semibold min-w-[3rem]">
                                                {trial.ayt.total}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold">
                                                <Award size={16} className="text-amber-500" />
                                                {trial.tyt.total + trial.ayt.total}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeleteId(trial.id); }}
                                                className={`p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${deleteId === trial.id ? 'bg-red-50 dark:bg-red-500/10' : ''}`}
                                                title="Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            {deleteId === trial.id && (
                                                <div className="absolute right-8 mt-[1px] z-10 bg-card border border-border shadow-xl rounded-xl p-4 w-64 text-left animate-in fade-in zoom-in-95 origin-top-right" onClick={(e) => e.stopPropagation()}>
                                                    <p className="font-medium text-slate-900 dark:text-white mb-1">Silmeyi onayla</p>
                                                    <p className="text-xs text-slate-500 mb-4">Bu işlemi geri alamazsınız.</p>
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(null); }} className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors">İptal</button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(trial.id); }} className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-sm shadow-red-500/20">Sil</button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    {expandedId === trial.id && (
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                                            <td colSpan={6} className="px-3 sm:px-6 py-4 sm:py-6 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">

                                                {/* Score and Rank summary */}
                                                <div className={cn(
                                                    "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl border",
                                                    userField === "SAY"
                                                        ? "bg-gradient-to-r from-primary-500/10 via-teal-500/10 to-emerald-500/10 border-primary-500/20"
                                                        : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20"
                                                )}>
                                                    <div className="flex items-center gap-2 text-center sm:text-left">
                                                        <Trophy size={16} className={userField === "SAY" ? "text-primary-500" : "text-indigo-500"} />
                                                        <span className="text-[11px] sm:text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">{userField} Puan:</span>
                                                        <span className={cn(
                                                            "text-base sm:text-xl font-bold bg-clip-text text-transparent",
                                                            userField === "SAY" ? "bg-gradient-to-r from-primary-600 to-teal-500" : "bg-gradient-to-r from-indigo-600 to-purple-500"
                                                        )}>
                                                            {(userField === "SAY"
                                                                ? calculateYksScores(trial.tyt, trial.ayt, obp).aytSayPlacement
                                                                : calculateYksScores(trial.tyt, trial.ayt, obp).aytEaPlacement).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="hidden sm:block w-px h-6 bg-border"></div>
                                                    <div className="flex items-center gap-2 text-center sm:text-left">
                                                        <BarChart3 size={16} className="text-emerald-500 shrink-0" />
                                                        <span className="text-[11px] sm:text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">Tahmini Sıra:</span>
                                                        <span className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                                                            {estimateRank(
                                                                userField === "SAY"
                                                                    ? calculateYksScores(trial.tyt, trial.ayt, obp).aytSayPlacement
                                                                    : calculateYksScores(trial.tyt, trial.ayt, obp).aytEaPlacement,
                                                                userField
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                                    {/* TYT Details */}
                                                    <div className="space-y-3">
                                                        <h4 className="font-bold text-xs sm:text-sm text-primary-600 dark:text-primary-400 border-b border-primary-100 dark:border-primary-900/30 pb-2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                                            TYT Detayları
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-sm">
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 sm:gap-4 bg-card rounded-lg p-1.5 sm:p-2.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Türkçe:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.tyt.turkish}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 sm:gap-4 bg-card rounded-lg p-1.5 sm:p-2.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Sosyal:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.tyt.social}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 sm:gap-4 bg-card rounded-lg p-1.5 sm:p-2.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Mat:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.tyt.math}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 sm:gap-4 bg-card rounded-lg p-1.5 sm:p-2.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Fen:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.tyt.science}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* AYT Details */}
                                                    <div className="space-y-3">
                                                        <h4 className="font-bold text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 border-b border-secondary-100 dark:border-secondary-900/30 pb-2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary-500"></div>
                                                            AYT Detayları
                                                        </h4>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] sm:text-sm">
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Mat:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.math}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Fiz:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.physics}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Kim:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.chemistry}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Biy:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.biology}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Edb:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.literature}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Tar:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.history}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-between gap-1.5 bg-card rounded-lg p-1.5 border border-border/50 shadow-sm col-span-2 sm:col-span-1">
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Coğ:</span>
                                                                <span className="font-bold text-slate-900 dark:text-white">{trial.ayt.geography}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
