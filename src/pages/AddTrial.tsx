import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrialContext } from "../context/TrialContext";
import { type TrialModel } from "../types";
import { Save, AlertCircle, BookOpen, Calculator, Atom, BookText, Globe2, Landmark, Trophy, Target } from "lucide-react";
import { calculateYksScores, estimateRank } from "../lib/calculator";
import { cn } from "../lib/utils";

export default function AddTrial() {
    const navigate = useNavigate();
    const { addTrial, obp, userField } = useTrialContext();

    const [name, setName] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

    const [tyt, setTyt] = useState({ turkish: 0, social: 0, math: 0, science: 0 });
    const [ayt, setAyt] = useState({ math: 0, physics: 0, chemistry: 0, biology: 0, literature: 0, history: 0, geography: 0 });

    const [error, setError] = useState("");

    const calculateTotal = (scores: Record<string, number>) => {
        return Object.values(scores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    };

    const handleSave = () => {
        if (!name.trim()) {
            setError("Lütfen sınav ismini giriniz.");
            return;
        }
        if (!date) {
            setError("Lütfen sınav tarihini giriniz.");
            return;
        }

        const newTrial: TrialModel = {
            id: Math.random().toString(36).substring(2, 11), // More robust fallback for mobile
            name: name.trim(),
            date: date,
            tyt: {
                turkish: Number(tyt.turkish) || 0,
                social: Number(tyt.social) || 0,
                math: Number(tyt.math) || 0,
                science: Number(tyt.science) || 0,
                total: calculateTotal(tyt),
            },
            ayt: {
                math: Number(ayt.math) || 0,
                physics: Number(ayt.physics) || 0,
                chemistry: Number(ayt.chemistry) || 0,
                biology: Number(ayt.biology) || 0,
                literature: Number(ayt.literature) || 0,
                history: Number(ayt.history) || 0,
                geography: Number(ayt.geography) || 0,
                total: calculateTotal(ayt),
            }
        };

        addTrial(newTrial);
        alert("Deneme başarıyla kaydedildi!"); // Feedback for mobile users
        navigate("/history");
    };

    const tytTotal = calculateTotal(tyt);
    const aytTotal = calculateTotal(ayt);

    const scores = calculateYksScores(tyt, ayt, obp);
    const displayScore = userField === "SAY" ? scores.aytSayPlacement : scores.aytEaPlacement;
    const estimatedRankResult = estimateRank(displayScore, userField);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Yeni Deneme Ekle</h1>
                    <p className="text-muted-foreground mt-1 text-slate-500">TYT ve AYT netlerinizi kaydederek gelişiminizi takip edin.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={cn(
                        "flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95",
                        userField === "SAY"
                            ? "bg-primary-600 hover:bg-primary-700 shadow-primary-500/30"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30"
                    )}
                >
                    <Save size={18} />
                    <span>Kaydet</span>
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in">
                    <AlertCircle size={20} />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Genel Bilgiler">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sınav İsmi</label>
                            <input
                                type="text"
                                placeholder="Örn: Özdebir TYT-3"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sınav Tarihi</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                            />
                        </div>
                    </div>
                </Card>

                <div className={cn(
                    "hidden md:flex flex-col justify-center items-center rounded-2xl border p-8 text-center relative overflow-hidden transition-all duration-500",
                    userField === "SAY"
                        ? "from-primary-500/10 to-teal-500/10 border-primary-200/50 dark:border-primary-500/20"
                        : "from-indigo-500/10 to-purple-500/10 border-indigo-200/50 dark:border-indigo-500/20",
                    "bg-gradient-to-br"
                )}>
                    <div className={cn(
                        "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl",
                        userField === "SAY" ? "bg-primary-500/20" : "bg-indigo-500/20"
                    )}></div>
                    <div className={cn(
                        "absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl",
                        userField === "SAY" ? "bg-teal-500/20" : "bg-purple-500/20"
                    )}></div>

                    <div className="relative z-10 w-full mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2 text-slate-800 dark:text-slate-100">
                            <Trophy size={20} className={userField === "SAY" ? "text-primary-500" : "text-indigo-500"} />
                            <h3 className="text-xl font-semibold">{userField} Yerleştirme Puanı</h3>
                        </div>
                        <p className={cn(
                            "text-5xl font-extrabold bg-clip-text text-transparent drop-shadow-sm mb-1",
                            userField === "SAY" ? "bg-gradient-to-r from-primary-600 to-teal-500" : "bg-gradient-to-r from-indigo-600 to-purple-500"
                        )}>
                            {displayScore.toFixed(2)}
                        </p>
                        <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5 mt-2 bg-card/50 backdrop-blur-sm rounded-lg py-1.5 mx-auto max-w-[200px] border border-border/50 shadow-sm">
                            <Target size={14} className="text-emerald-500" /> Tahmini Sıra: <span className="text-slate-800 dark:text-slate-200 font-bold">{estimatedRankResult}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6 relative z-10 p-4 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm w-full justify-center">
                        <div className="text-center px-4">
                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{tytTotal}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">TYT Net</p>
                        </div>
                        <div className="w-px h-12 bg-border"></div>
                        <div className="text-center px-4">
                            <p className={cn(
                                "text-3xl font-bold",
                                userField === "SAY" ? "text-primary-600 dark:text-primary-400" : "text-indigo-600 dark:text-indigo-400"
                            )}>
                                {aytTotal}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">AYT Net</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="TYT Netleri" subtitle="Temel Yeterlilik Testi">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <NumberInput
                            label="Türkçe"
                            icon={BookOpen}
                            value={tyt.turkish}
                            onChange={(v) => setTyt({ ...tyt, turkish: v })}
                            max={40}
                        />
                        <NumberInput
                            label="Sosyal Bilimler"
                            icon={Globe2}
                            value={tyt.social}
                            onChange={(v) => setTyt({ ...tyt, social: v })}
                            max={20}
                        />
                        <NumberInput
                            label="Temel Matematik"
                            icon={Calculator}
                            value={tyt.math}
                            onChange={(v) => setTyt({ ...tyt, math: v })}
                            max={40}
                        />
                        <NumberInput
                            label="Fen Bilimleri"
                            icon={Atom}
                            value={tyt.science}
                            onChange={(v) => setTyt({ ...tyt, science: v })}
                            max={20}
                        />
                    </div>
                </Card>

                <Card title="AYT Netleri" subtitle={`${userField === "SAY" ? "Sayısal" : "Eşit Ağırlık"} Alanı Odaklı`}>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className={cn("inline-block w-2 h-2 rounded-full", userField === "SAY" ? "bg-primary-500" : "bg-indigo-500")}></span>
                                Alan Derslerin
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <NumberInput
                                    label="Matematik"
                                    icon={Calculator}
                                    value={ayt.math}
                                    onChange={(v) => setAyt({ ...ayt, math: v })}
                                    max={40}
                                    highlight={true}
                                />
                                {userField === "SAY" ? (
                                    <>
                                        <NumberInput label="Fizik" icon={Atom} value={ayt.physics} onChange={(v) => setAyt({ ...ayt, physics: v })} max={14} highlight={true} />
                                        <NumberInput label="Kimya" icon={Atom} value={ayt.chemistry} onChange={(v) => setAyt({ ...ayt, chemistry: v })} max={13} highlight={true} />
                                        <NumberInput label="Biyoloji" icon={Atom} value={ayt.biology} onChange={(v) => setAyt({ ...ayt, biology: v })} max={13} highlight={true} />
                                    </>
                                ) : (
                                    <>
                                        <NumberInput label="Edebiyat" icon={BookText} value={ayt.literature} onChange={(v) => setAyt({ ...ayt, literature: v })} max={24} highlight={true} />
                                        <NumberInput label="Tarih-1" icon={Landmark} value={ayt.history} onChange={(v) => setAyt({ ...ayt, history: v })} max={10} highlight={true} />
                                        <NumberInput label="Coğrafya-1" icon={Globe2} value={ayt.geography} onChange={(v) => setAyt({ ...ayt, geography: v })} max={6} highlight={true} />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Diğer Dersler (Opsiyonel)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity">
                                {userField === "EA" ? (
                                    <>
                                        <NumberInput label="Fizik" icon={Atom} value={ayt.physics} onChange={(v) => setAyt({ ...ayt, physics: v })} max={14} />
                                        <NumberInput label="Kimya" icon={Atom} value={ayt.chemistry} onChange={(v) => setAyt({ ...ayt, chemistry: v })} max={13} />
                                        <NumberInput label="Biyoloji" icon={Atom} value={ayt.biology} onChange={(v) => setAyt({ ...ayt, biology: v })} max={13} />
                                    </>
                                ) : (
                                    <>
                                        <NumberInput label="Edebiyat" icon={BookText} value={ayt.literature} onChange={(v) => setAyt({ ...ayt, literature: v })} max={24} />
                                        <NumberInput label="Tarih-1" icon={Landmark} value={ayt.history} onChange={(v) => setAyt({ ...ayt, history: v })} max={10} />
                                        <NumberInput label="Coğrafya-1" icon={Globe2} value={ayt.geography} onChange={(v) => setAyt({ ...ayt, geography: v })} max={6} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Mobile Save Button (Floating-like at bottom) */}
            <div className="md:hidden pt-4 pb-8">
                <button
                    onClick={handleSave}
                    className={cn(
                        "w-full flex items-center justify-center gap-3 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95",
                        userField === "SAY"
                            ? "bg-primary-600 hover:bg-primary-700 shadow-primary-500/30"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30"
                    )}
                >
                    <Save size={24} />
                    Kaydet ve Bitir
                </button>
            </div>
        </div>
    );
}

function Card({ title, subtitle, children }: { title: string, subtitle?: string, children: React.ReactNode }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="mb-5">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function NumberInput({
    label,
    value,
    onChange,
    max,
    icon: Icon,
    highlight
}: {
    label: string,
    value: number,
    onChange: (v: number) => void,
    max: number,
    icon: any,
    highlight?: boolean
}) {
    const { userField } = useTrialContext();
    const borderColorClass = userField === "SAY" ? "focus:border-primary-500 focus:ring-primary-500/20" : "focus:border-indigo-500 focus:ring-indigo-500/20";
    const highlightBg = userField === "SAY" ? "bg-primary-50/10 dark:bg-primary-500/5 border-primary-100 dark:border-primary-500/20" : "bg-indigo-50/10 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20";

    return (
        <div className="relative group">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Icon size={14} className={highlight ? (userField === "SAY" ? "text-primary-500" : "text-indigo-500") : "text-slate-400"} />
                {label}
            </label>
            <div className="relative">
                <input
                    type="number"
                    step="0.25"
                    min="0"
                    max={max}
                    value={value === 0 ? "" : value}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                            if (val > max) onChange(max);
                            else onChange(val);
                        } else {
                            onChange(0);
                        }
                    }}
                    placeholder="0"
                    className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-slate-900 dark:text-slate-100 font-medium hover:border-slate-400 transition-all outline-none",
                        borderColorClass,
                        highlight && highlightBg
                    )}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-xs text-slate-400 font-medium font-mono">
                    /{max}
                </div>
            </div>
        </div>
    );
}
