import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck, ChevronRight } from "lucide-react";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem("cookie_consent", "all");
        setIsVisible(false);
    };

    const acceptEssential = () => {
        localStorage.setItem("cookie_consent", "essential");
        setIsVisible(false);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[60]"
                    >
                        <div className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
                            {/* Decorative background gradient */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors duration-500" />

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary-500/10 rounded-xl">
                                    <Cookie className="w-6 h-6 text-primary-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-1">
                                        Çerez Politikası
                                    </h3>
                                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                                        Size en iyi deneyimi sunmak için çerezleri kullanıyoruz. Sitemizde kalarak çerez kullanımını kabul etmiş sayılırsınız.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 hover:bg-foreground/5 rounded-lg transition-colors text-foreground/40 hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex gap-3">
                                    <button
                                        onClick={acceptAll}
                                        className="flex-1 py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/20"
                                    >
                                        Tümünü Kabul Et
                                    </button>
                                    <button
                                        onClick={() => setShowDetails(true)}
                                        className="flex-1 py-2.5 px-4 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-1 group/btn"
                                    >
                                        Detaylar
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                                <button
                                    onClick={acceptEssential}
                                    className="w-full py-2 text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
                                >
                                    Yalnızca gerekli olanları teknik olarak kullan
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDetails && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-500/10 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <h2 className="text-xl font-bold">Çerez Aydınlatma Metni</h2>
                                </div>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-6 text-sm text-foreground/80 leading-relaxed custom-scrollbar">
                                <section>
                                    <h3 className="text-foreground font-bold text-base mb-2">1. Çerez Nedir?</h3>
                                    <p>
                                        Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalarıdır.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-bold text-base mb-2">2. Çerezlerin Kullanım Amaçları</h3>
                                    <p>Sitemizde çerezler aşağıdaki amaçlarla kullanılmaktadır:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-2">
                                        <li>İşlevsellik: Dil tercihleriniz gibi seçimlerinizi hatırlamak.</li>
                                        <li>Performans: Sitemizin nasıl kullanıldığını analiz ederek deneyiminizi iyileştirmek.</li>
                                        <li>Güvenlik: Güvenlik açıklarını tespit etmek ve önlemek.</li>
                                        <li>Analitik: Kullanıcı trafiğini anlamak (Google Analytics vb.).</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-bold text-base mb-2">3. Çerez Türleri</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-foreground/5 rounded-2xl">
                                            <p className="font-bold text-primary-500 mb-1">Zorunlu Çerezler</p>
                                            <p>Sitenin düzgün çalışması için gereklidir. Bu çerezler olmadan sitenin bazı özellikleri kullanılamaz.</p>
                                        </div>
                                        <div className="p-4 bg-foreground/5 rounded-2xl">
                                            <p className="font-bold text-secondary-500 mb-1">Analitik Çerezler</p>
                                            <p>Kullanıcıların siteyle olan etkileşimini anlamamıza yardımcı olur. Veriler anonim olarak toplanır.</p>
                                        </div>
                                        <div className="p-4 bg-foreground/5 rounded-2xl">
                                            <p className="font-bold text-accent-500 mb-1">Pazarlama Çerezleri</p>
                                            <p>Size ilgi alanlarınıza göre reklamlar sunmak amacıyla kullanılır (Henüz aktif değildir).</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-bold text-base mb-2">4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
                                    <p>
                                        Tarayıcınızın ayarlarından çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz. Ancak bu durumda sitemizin bazı özellikleri çalışmayabilir. Popüler tarayıcılar için ayar sayfalarına aşağıdaki linklerden ulaşabilirsiniz:
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {['Chrome', 'Firefox', 'Safari', 'Edge'].map(browser => (
                                            <span key={browser} className="px-3 py-1 bg-foreground/5 rounded-full text-xs font-medium border border-border">
                                                {browser}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                <p className="pt-4 border-t border-border text-xs text-foreground/50">
                                    Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                                </p>
                            </div>

                            <div className="p-6 border-t border-border bg-foreground/5 flex items-center justify-between">
                                <a
                                    href="/cookie-policy"
                                    className="text-primary-500 hover:underline text-sm font-medium"
                                    onClick={() => setShowDetails(false)}
                                >
                                    Tüm Politikayı Oku
                                </a>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                                >
                                    Anladım
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
