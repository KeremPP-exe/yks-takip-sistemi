import { useState } from "react";
import { Calculator, Info, RotateCcw } from "lucide-react";
import { calculateYksScores, estimateRank } from "../lib/calculator";
import { cn } from "../lib/utils";

export default function RankCalculator() {
    const [obp, setObp] = useState<number>(85);
    const [tyt, setTyt] = useState({ turkish: 0, social: 0, math: 0, science: 0 });
    const [ayt, setAyt] = useState({
        math: 0, literature: 0, history: 0, geography: 0,
        physics: 0, chemistry: 0, biology: 0,
        history2: 0, geography2: 0, philosophy: 0, religion: 0
    });
    const [results, setResults] = useState<any>(null);

    const handleCalculate = () => {
        const scores = calculateYksScores(tyt, ayt, obp);
        setResults(scores);
    };

    const handleReset = () => {
        setTyt({ turkish: 0, social: 0, math: 0, science: 0 });
        setAyt({
            math: 0, literature: 0, history: 0, geography: 0,
            physics: 0, chemistry: 0, biology: 0,
            history2: 0, geography2: 0, philosophy: 0, religion: 0
        });
        setObp(85);
        setResults(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
                            <Calculator size={28} />
                        </div>
                        Sıralama Hesaplama
                    </h1>
                    <p className="text-muted-foreground text-slate-500 font-medium">MEB OGM Materyal verilerine dayalı gerçekçi simülasyon.</p>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <RotateCcw size={16} /> Temizle
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                        {/* OBP */}
                        <section>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Ortaöğretim Başarı Puanı (OBP)</label>
                            <input
                                type="number"
                                value={obp || ""}
                                onChange={(e) => setObp(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-bold text-lg"
                                placeholder="50-100 arası"
                            />
                        </section>

                        {/* TYT Nets */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-blue-100 dark:border-blue-900/30 pb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                TYT Netlerin
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <NetInput label="Türkçe" value={tyt.turkish} onChange={(v) => setTyt({ ...tyt, turkish: v })} max={40} />
                                <NetInput label="Sosyal" value={tyt.social} onChange={(v) => setTyt({ ...tyt, social: v })} max={20} />
                                <NetInput label="Matematik" value={tyt.math} onChange={(v) => setTyt({ ...tyt, math: v })} max={40} />
                                <NetInput label="Fen" value={tyt.science} onChange={(v) => setTyt({ ...tyt, science: v })} max={20} />
                            </div>
                        </section>

                        <button
                            onClick={handleCalculate}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                        >
                            Hesapla & Sıralamamı Gör
                        </button>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl flex gap-3">
                        <Info className="text-amber-600 shrink-0" size={20} />
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
                            Bu hesaplama motoru OGM Materyal/MEB katsayılarını kullanır. Sıralamalar 2024 yılı verilerine dayalı tahmini aralıklardır.
                        </p>
                    </div>
                </div>

                {/* AYT Inputs & Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-orange-500 flex items-center gap-2 border-b border-orange-100 dark:border-orange-900/30 pb-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            AYT Netlerin
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Matematik & Fen (SAY)</h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <NetInput label="Matematik" value={ayt.math} onChange={(v) => setAyt({ ...ayt, math: v })} max={40} />
                                    <NetInput label="Fizik" value={ayt.physics} onChange={(v) => setAyt({ ...ayt, physics: v })} max={14} />
                                    <NetInput label="Kimya" value={ayt.chemistry} onChange={(v) => setAyt({ ...ayt, chemistry: v })} max={13} />
                                    <NetInput label="Biyoloji" value={ayt.biology} onChange={(v) => setAyt({ ...ayt, biology: v })} max={13} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Edebiyat & Sosyal-1 (EA/SÖZ)</h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <NetInput label="Edebiyat" value={ayt.literature} onChange={(v) => setAyt({ ...ayt, literature: v })} max={24} />
                                    <NetInput label="Tarih-1" value={ayt.history} onChange={(v) => setAyt({ ...ayt, history: v })} max={10} />
                                    <NetInput label="Coğrafya-1" value={ayt.geography} onChange={(v) => setAyt({ ...ayt, geography: v })} max={6} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Sosyal-2 (SÖZ)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <NetInput label="Tarih-2" value={ayt.history2} onChange={(v) => setAyt({ ...ayt, history2: v })} max={11} />
                                <NetInput label="Coğrafya-2" value={ayt.geography2} onChange={(v) => setAyt({ ...ayt, geography2: v })} max={11} />
                                <NetInput label="Felsefe G." value={ayt.philosophy} onChange={(v) => setAyt({ ...ayt, philosophy: v })} max={12} />
                                <NetInput label="Din K." value={ayt.religion} onChange={(v) => setAyt({ ...ayt, religion: v })} max={6} />
                            </div>
                        </div>
                    </div>

                    {results && (
                        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
                            {/* Result Table Header */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Puan Türü</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-500 uppercase tracking-wider text-center border-l border-border/50 bg-blue-500/5">Ham Puan</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-center bg-blue-500/10">Ham Sıralama</th>
                                            <th className="px-6 py-4 text-xs font-bold text-emerald-500 uppercase tracking-wider text-center border-l border-border/50 bg-emerald-500/5">Yerleştirme</th>
                                            <th className="px-6 py-4 text-xs font-bold text-emerald-600 uppercase tracking-wider text-center bg-emerald-500/10">Yerl. Sıralama</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <ResultRow label="TYT" raw={results.tytRaw} placement={results.tytPlacement} field="TYT" color="blue" />
                                        <ResultRow label="SAY" raw={results.aytSayRaw} placement={results.aytSayPlacement} field="SAY" color="orange" />
                                        <ResultRow label="EA" raw={results.aytEaRaw} placement={results.aytEaPlacement} field="EA" color="purple" />
                                        <ResultRow label="SÖZ" raw={results.aytSozRaw} placement={results.aytSozPlacement} field="SOZ" color="amber" />
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center">
                                <p className="text-[11px] text-slate-400 font-medium">Bu sonuçlar bilgilendirme amaçlıdır. ÖSYM tarafından açıklanan resmi verilere göre farklılık gösterebilir.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function NetInput({ label, value, onChange, max }: { label: string, value: number, onChange: (v: number) => void, max: number }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
            <input
                type="number"
                step="0.25"
                min="0"
                max={max}
                value={value || ""}
                onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (isNaN(v)) onChange(0);
                    else onChange(Math.min(v, max));
                }}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary-500/50 outline-none text-sm font-bold"
                placeholder="0"
            />
        </div>
    );
}

function ResultRow({ label, raw, placement, field, color }: { label: string, raw: number, placement: number, field: any, color: string }) {
    const rawRank = estimateRank(raw, field);
    const placementRank = estimateRank(placement, field);

    const colors: any = {
        blue: "text-blue-500",
        orange: "text-orange-500",
        purple: "text-purple-500",
        amber: "text-amber-500",
        emerald: "text-emerald-500"
    };

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
            <td className="px-6 py-5">
                <span className={cn("font-extrabold text-lg", colors[color])}>{label}</span>
            </td>
            <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white border-l border-border/50">
                {raw.toFixed(3)}
            </td>
            <td className="px-6 py-5 text-center font-black text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5">
                {rawRank}
            </td>
            <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white border-l border-border/50">
                {placement.toFixed(3)}
            </td>
            <td className="px-6 py-5 text-center font-black text-slate-900 dark:text-white bg-emerald-500/5 dark:bg-emerald-500/10">
                {placementRank}
            </td>
        </tr>
    );
}
