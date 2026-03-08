import { useTrialContext } from "../context/TrialContext";
import { Trash2, AlertTriangle, Moon, Sun, Monitor, GraduationCap, Target, Beaker, BookText, Calculator } from "lucide-react";
import { useState } from "react";
import { type TrialModel } from "../types";
import { cn } from "../lib/utils";

export default function Settings() {
    const { deleteTrial, trials, obp, setObp, userField, setUserField, targetScores, setTargetScores } = useTrialContext();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
    const [tempObp, setTempObp] = useState(obp.toString());

    const handleTargetChange = (exam: 'tyt' | 'ayt' | 'info', subject: string, value: number | string) => {
        if (exam === 'info') {
            setTargetScores({
                ...targetScores,
                [subject]: value
            });
            return;
        }
        setTargetScores({
            ...targetScores,
            [exam]: {
                ...(targetScores[exam as 'tyt' | 'ayt']),
                [subject]: value
            }
        });
    };

    const clearAllData = () => {
        if (window.confirm("TÜM verileriniz silinecektir! Bu işlem geri alınamaz. Emin misiniz?")) {
            // Create a copy of ids to delete to avoid state mutation issues during loop
            const ids = trials.map((t: TrialModel) => t.id);
            ids.forEach((id: string) => deleteTrial(id));
            alert("Tüm veriler silindi.");
        }
    };

    const setAppTheme = (t: string) => {
        setTheme(t);
        const root = window.document.documentElement;
        if (t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Ayarlar</h1>
                <p className="text-muted-foreground text-slate-500">Uygulama tercihlerinizi ve verilerinizi yönetin.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                        <Monitor size={20} className="text-primary-500" />
                        Görünüm
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setAppTheme('light')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${theme === 'light' ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium' : 'border-border text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Sun size={18} /> Açık Tema
                        </button>
                        <button
                            onClick={() => setAppTheme('dark')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${theme === 'dark' ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium' : 'border-border text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Moon size={18} /> Koyu Tema
                        </button>
                    </div>

                    <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                            <Calculator size={20} className="text-orange-500" />
                            Alan Seçimi
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setUserField("SAY")}
                                className={cn(
                                    "relative flex flex-col items-start p-5 rounded-2xl border-2 transition-all group overflow-hidden text-left",
                                    userField === "SAY"
                                        ? "border-primary-500 bg-primary-50/50 dark:bg-primary-500/10 shadow-lg shadow-primary-500/10"
                                        : "border-border hover:border-slate-300 dark:hover:border-slate-700 bg-card"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-xl mb-3 transition-colors",
                                    userField === "SAY" ? "bg-primary-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                )}>
                                    <Beaker size={24} />
                                </div>
                                <span className={cn("text-lg font-bold mb-1", userField === "SAY" ? "text-primary-700 dark:text-primary-400" : "text-slate-700 dark:text-slate-200")}>
                                    Sayısal (SAY)
                                </span>
                                <span className="text-xs text-slate-500 font-medium">Matematik & Fen Bilimleri odaklı</span>
                                {userField === "SAY" && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-ping" />}
                            </button>

                            <button
                                onClick={() => setUserField("EA")}
                                className={cn(
                                    "relative flex flex-col items-start p-5 rounded-2xl border-2 transition-all group overflow-hidden text-left",
                                    userField === "EA"
                                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                                        : "border-border hover:border-slate-300 dark:hover:border-slate-700 bg-card"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-xl mb-3 transition-colors",
                                    userField === "EA" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                )}>
                                    <BookText size={24} />
                                </div>
                                <span className={cn("text-lg font-bold mb-1", userField === "EA" ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-200")}>
                                    Eşit Ağırlık (EA)
                                </span>
                                <span className="text-xs text-slate-500 font-medium">Matematik & Edebiyat-Sosyal odaklı</span>
                                {userField === "EA" && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                        <GraduationCap size={20} className="text-secondary-500" />
                        Eğitim Bilgileri (OBP)
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">Ortaöğretim Başarı Puanınız (50-100 arası), yerleştirme puanınızı hesaplamak için kullanılır.</p>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="50"
                            max="100"
                            step="0.01"
                            value={tempObp}
                            onChange={(e) => setTempObp(e.target.value)}
                            onBlur={() => {
                                let val = parseFloat(tempObp);
                                if (isNaN(val)) val = obp;
                                if (val > 100) val = 100;
                                if (val < 0) val = 0;
                                setObp(val);
                                setTempObp(val.toString());
                            }}
                            className="w-32 px-4 py-2.5 rounded-xl border border-border bg-background hover:border-slate-400 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all outline-none font-medium text-slate-900 dark:text-slate-100 text-center"
                        />
                        <span className="text-sm font-semibold text-slate-400">Puan</span>
                    </div>
                </div>

                <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                        <Target size={20} className="text-emerald-500" />
                        Hedef Netler (Mevcut Durum Kıyaslaması İçin)
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">Dashboard üzerinde hedeflerinize ne kadar ulaştığınızı görebilmek için hedeflediğiniz bölümün/üniversitenin taban netlerini girin.</p>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b border-border pb-2">Hedef Kurum Bilgileri</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Üniversite</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Boğaziçi Üniversitesi"
                                        value={targetScores.university || ""}
                                        onChange={(e) => handleTargetChange('info', 'university', e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background hover:border-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Bölüm</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Bilgisayar Mühendisliği"
                                        value={targetScores.department || ""}
                                        onChange={(e) => handleTargetChange('info', 'department', e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background hover:border-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b border-border pb-2">TYT Hedefleri</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <TargetInput label="Türkçe" val={targetScores.tyt.turkish} onChange={v => handleTargetChange('tyt', 'turkish', v)} max={40} />
                                <TargetInput label="Sosyal" val={targetScores.tyt.social} onChange={v => handleTargetChange('tyt', 'social', v)} max={20} />
                                <TargetInput label="Matematik" val={targetScores.tyt.math} onChange={v => handleTargetChange('tyt', 'math', v)} max={40} />
                                <TargetInput label="Fen" val={targetScores.tyt.science} onChange={v => handleTargetChange('tyt', 'science', v)} max={20} />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b border-border pb-2">
                                {userField === "SAY" ? "AYT Hedefleri (Sayısal)" : "AYT Hedefleri (Eşit Ağırlık)"}
                            </h4>
                            {userField === "SAY" ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <TargetInput label="Matematik" val={targetScores.ayt.math} onChange={v => handleTargetChange('ayt', 'math', v)} max={40} />
                                    <TargetInput label="Fizik" val={targetScores.ayt.physics} onChange={v => handleTargetChange('ayt', 'physics', v)} max={14} />
                                    <TargetInput label="Kimya" val={targetScores.ayt.chemistry} onChange={v => handleTargetChange('ayt', 'chemistry', v)} max={13} />
                                    <TargetInput label="Biyoloji" val={targetScores.ayt.biology} onChange={v => handleTargetChange('ayt', 'biology', v)} max={13} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-right-2 duration-300">
                                    <TargetInput label="Matematik" val={targetScores.ayt.math} onChange={v => handleTargetChange('ayt', 'math', v)} max={40} />
                                    <TargetInput label="Edebiyat" val={targetScores.ayt.literature} onChange={v => handleTargetChange('ayt', 'literature', v)} max={24} />
                                    <TargetInput label="Tarih-1" val={targetScores.ayt.history} onChange={v => handleTargetChange('ayt', 'history', v)} max={10} />
                                    <TargetInput label="Coğrafya-1" val={targetScores.ayt.geography} onChange={v => handleTargetChange('ayt', 'geography', v)} max={6} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-red-200 dark:border-red-900/30 shadow-sm rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                        <AlertTriangle size={20} />
                        Tehlikeli Alan
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">Buradaki işlemler geri alınamaz. Lütfen dikkatli kullanın.</p>

                    <button
                        onClick={clearAllData}
                        className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-5 py-2.5 rounded-xl font-medium transition-colors"
                    >
                        <Trash2 size={18} />
                        Tüm Verileri Sil
                    </button>
                </div>
            </div>
        </div>
    );
}

function TargetInput({ label, val, onChange, max }: { label: string, val: number, onChange: (v: number) => void, max: number }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    step="0.25"
                    min="0"
                    max={max}
                    value={val === 0 ? "" : val}
                    onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        if (!isNaN(parsed)) onChange(Math.min(parsed, max));
                        else onChange(0);
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background hover:border-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium"
                />
            </div>
        </div>
    );
}
