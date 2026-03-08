import { motion } from "framer-motion";
import { Cookie, ShieldCheck, Lock, Eye, Settings, FileText } from "lucide-react";

const CookiePolicy = () => {
    const sections = [
        {
            title: "1. Çerez Nedir?",
            icon: <Cookie className="w-5 h-5" />,
            content: "Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi hatırlamasını ve deneyiminizi kişiselleştirmesini sağlar."
        },
        {
            title: "2. Neden Çerez Kullanıyoruz?",
            icon: <ShieldCheck className="w-5 h-5" />,
            content: "Web sitemizi daha verimli kullanabilmeniz, performansını artırmamız ve size özel içerikler sunabilmemiz için çerezlerden yararlanıyoruz. Ayrıca güvenlik açıklarını önlemek ve trafik analizi yapmak amacıyla da çerezler kullanılmaktadır."
        },
        {
            title: "3. Çerez Türleri",
            icon: <Settings className="w-5 h-5" />,
            isGrid: true,
            items: [
                { name: "Zorunlu Çerezler", desc: "Sitenin çalışması için teknik olarak gerekli olan çerezler.", color: "text-blue-500" },
                { name: "Fonksiyonel Çerezler", desc: "Dil ve tema gibi tercihlerinizin hatırlanmasını sağlar.", color: "text-purple-500" },
                { name: "Analitik Çerezler", desc: "Ziyaretçi trafiğini anonim olarak analiz etmemize yardımcı olur.", color: "text-teal-500" }
            ]
        },
        {
            title: "4. Veri Güvenliği",
            icon: <Lock className="w-5 h-5" />,
            content: "Çerezler aracılığıyla toplanan verileriniz, gizlilik politikamıza uygun olarak korunmaktadır. Kişisel verilerinizin güvenliği bizim için önceliklidir."
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
                    Çerez Politikası
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                </p>
            </div>

            <div className="grid gap-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                {section.icon}
                            </div>
                            <h2 className="text-xl font-bold">{section.title}</h2>
                        </div>

                        {section.isGrid ? (
                            <div className="grid sm:grid-cols-3 gap-4 mt-4">
                                {section.items?.map((item, i) => (
                                    <div key={i} className="p-4 bg-foreground/5 rounded-xl border border-transparent hover:border-primary-500/20 transition-colors">
                                        <p className={`font-bold ${item.color} mb-1`}>{item.name}</p>
                                        <p className="text-sm text-foreground/70">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-foreground/70 leading-relaxed italic">
                                {section.content}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="p-8 bg-primary-500/5 border border-primary-500/10 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Eye className="w-6 h-6 text-primary-500" />
                            Şeffaflık İlkesi
                        </h3>
                        <p className="text-foreground/60 max-w-xl">
                            YKS Takip Sistemi olarak verilerinizi şeffaf bir şekilde yönetiyoruz. Çerez ayarlarınızı dilediğiniz zaman tarayıcı ayarlarınızdan değiştirebilirsiniz.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/settings'}
                        className="px-8 py-3 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all hover:shadow-xl hover:shadow-primary-500/20 active:scale-95"
                    >
                        Ayarlardan Yönet
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </div>
        </div>
    );
};

export default CookiePolicy;
