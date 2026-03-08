import { useState } from "react";
import { useStudyContext } from "../context/StudyContext";
import { ChevronLeft, ChevronRight, X, Clock, BookOpen, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECT_OPTIONS = [
    "TYT Türkçe", "TYT Matematik", "TYT Sosyal", "TYT Fen",
    "AYT Matematik", "AYT Fizik", "AYT Kimya", "AYT Biyoloji",
    "AYT Edebiyat", "AYT Tarih", "AYT Coğrafya"
];

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function Calendar() {
    const { studyLogs, addLog, deleteLog } = useStudyContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [durationHours, setDurationHours] = useState<number>(0);
    const [durationMinutes, setDurationMinutes] = useState<number>(0);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [notes, setNotes] = useState("");

    const prevMonth = () => {
        setDirection(-1);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setDirection(1);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const openModal = (dateStr: string) => {
        setSelectedDate(dateStr);
        const log = studyLogs[dateStr];
        if (log) {
            setDurationHours(log.durationHours);
            setDurationMinutes(log.durationMinutes);
            setSubjects(log.subjects);
            setNotes(log.notes);
        } else {
            setDurationHours(0);
            setDurationMinutes(0);
            setSubjects([]);
            setNotes("");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    const handleSave = () => {
        if (selectedDate) {
            addLog(selectedDate, {
                date: selectedDate,
                durationHours,
                durationMinutes,
                subjects,
                notes
            });
            closeModal();
        }
    };

    const handleDelete = () => {
        if (selectedDate && window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
            deleteLog(selectedDate);
            closeModal();
        }
    };

    const toggleSubject = (sub: string) => {
        if (subjects.includes(sub)) {
            setSubjects(subjects.filter(s => s !== sub));
        } else {
            setSubjects([...subjects, sub]);
        }
    };

    // Calendar logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // JS getDay(): Sun = 0, Mon = 1 ... Sat = 6. Let's make Mon = 0, Sun = 6
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const renderCalendarGrid = () => {
        const grid = [];
        // Empty cells for offset
        for (let i = 0; i < startOffset; i++) {
            grid.push(<div key={`empty-${i}`} className="p-2 md:p-4 min-h-[80px] md:min-h-[120px] bg-slate-50/50 dark:bg-slate-800/10 border border-transparent rounded-lg hidden sm:block"></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            // YYYY-MM-DD format with leading zeros
            const m = (month + 1).toString().padStart(2, '0');
            const d = day.toString().padStart(2, '0');
            const dateStr = `${year}-${m}-${d}`;

            const log = studyLogs[dateStr];
            const hasData = !!log;

            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            grid.push(
                <div
                    key={day}
                    onClick={() => openModal(dateStr)}
                    className={`relative p-2 md:p-4 min-h-[70px] md:min-h-[120px] bg-card border border-border/50 hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800/50 transition-all shadow-sm rounded-lg group ${isToday ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
                >
                    <span className={`text-sm md:text-base font-medium ${hasData ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {day}
                    </span>

                    {hasData && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    )}

                    {hasData && (
                        <div className="hidden sm:block mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1 overflow-hidden">
                            <p className="truncate font-semibold text-emerald-600 dark:text-emerald-500">
                                {log.durationHours}s {log.durationMinutes}d
                            </p>
                            {log.subjects.length > 0 && (
                                <p className="truncate opacity-80">{log.subjects.length} Ders</p>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return grid;
    };

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Çalışma Günlüğü</h1>
                    <p className="text-muted-foreground text-slate-500 mt-1">Günlük çalışmalarını kaydet ve programını takip et.</p>
                </div>

                <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-2xl border border-border shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="w-32 text-center font-bold text-lg text-slate-800 dark:text-slate-200">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border shadow-sm rounded-3xl p-4 md:p-6">
                <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2 md:mb-4">
                    {DAYS.map(d => (
                        <div key={d} className="hidden sm:block text-center text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{d}</div>
                    ))}
                    {["P", "S", "Ç", "P", "C", "C", "P"].map((d, i) => (
                        <div key={`${d}-${i}`} className="sm:hidden text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
                    ))}
                </div>

                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <motion.div
                            key={currentDate.getTime()}
                            custom={direction}
                            initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4"
                        >
                            {renderCalendarGrid()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
                    <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border/50 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/20">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Çalışma Kaydı</h3>
                                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                                    {new Date(selectedDate!).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto w-full">
                            {/* Duration */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <Clock size={16} className="text-amber-500" /> Toplam Çalışma Süresi
                                </label>
                                <div className="flex gap-4">
                                    <div className="flex-1 max-w-[50%]">
                                        <div className="relative">
                                            <input type="number" min="0" max="24" value={durationHours || ""} onChange={e => setDurationHours(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500/20 outline-none transition-all sm:pl-16 pl-2" />
                                            <span className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">Saat</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-[50%]">
                                        <div className="relative">
                                            <input type="number" min="0" max="59" value={durationMinutes || ""} onChange={e => setDurationMinutes(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500/20 outline-none transition-all sm:pl-20 pl-2" />
                                            <span className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">Dakika</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subjects */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <BookOpen size={16} className="text-secondary-500" /> Çalışılan Dersler
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECT_OPTIONS.map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => toggleSubject(sub)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${subjects.includes(sub)
                                                ? 'bg-secondary-50 border-secondary-300 text-secondary-700 dark:bg-secondary-500/20 dark:border-secondary-500/50 dark:text-secondary-400'
                                                : 'bg-card border-border text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <FileText size={16} className="text-teal-500" /> Konular / Notlar
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Neler çalıştın? Hangi konuları bitirdin?"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500/20 outline-none transition-all min-h-[120px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-slate-50/50 dark:bg-slate-800/20">
                            {studyLogs[selectedDate!] ? (
                                <button onClick={handleDelete} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">Kaydı Sil</button>
                            ) : <div></div>}
                            <div className="flex gap-3">
                                <button onClick={closeModal} className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors">İptal</button>
                                <button onClick={handleSave} className="px-5 py-2 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 active:scale-95 transition-all">Kaydet</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
