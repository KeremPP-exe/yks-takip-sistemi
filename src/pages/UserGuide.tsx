import { BookOpen, Calculator, Calendar, Smartphone } from "lucide-react";
import { cn } from "../lib/utils";

export default function UserGuide() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-400 mb-2">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    ProTracker Kullanım Kılavuzu
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                    YKS hazırlık sürecini en verimli şekilde yönetmen için hazırladığımız kapsamlı rehber. Başarılı bir maraton için ihtiyacın olan her şey burada!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* 1. Puan Hesaplama & Deneme Takibi */}
                <GuideSection
                    title="Deneme Takibi & Puan Hesaplama"
                    description="Netlerinizi girin, sistem size 2024 katsayılarına göre en güncel puanı ve sıralamayı hesaplasın."
                    icon={Calculator}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-50 dark:bg-blue-500/10"
                    steps={[
                        "Menüden 'Yeni Deneme' butonuna tıklayın.",
                        "Deneme ismini ve tarihini seçin.",
                        "TYT ve AYT netlerinizi (en az 0.25 adımda) ilgili alanlara girin.",
                        "Alan Seçiminize (SAY/EA) göre puanın anında hesaplandığını göreceksiniz.",
                        "'Kaydet' butonuna basarak verilerini buluta kaydedin."
                    ]}
                    placeholderText="Burada [Deneme Ekleme] ekranının görüntüsü olacak ve kullanıcıya net girdiği alanlar vurgulanacak."
                />

                {/* 2. Çalışma Günlüğü */}
                <GuideSection
                    title="Çalışma Günlüğü & Planlama"
                    description="Günde kaç saat çalıştığınızı kaydedin, performansınızı takvim üzerinden görselleştirin."
                    icon={Calendar}
                    iconColor="text-purple-500"
                    iconBg="bg-purple-50 dark:bg-purple-500/10"
                    steps={[
                        "Sol menüden 'Çalışma Günlüğü' sekmesine gidin.",
                        "Takvim üzerinde kayıt eklemek istediğiniz güne tıklayın.",
                        "Çalıştığınız süreyi, konuları ve notlarınızı ekleyerek kaydedin.",
                        "Ay bazlı çalışma trafiğinizi görüntüleyerek hangi günlerde daha verimli olduğunuzu analiz edin."
                    ]}
                    placeholderText="Burada [Takvim ve Kayıt Ekleme] ekranının görüntüsü olacak, takvimdeki renkli işaretler gösterilecek."
                />

                {/* 3. PWA Yükleme */}
                <GuideSection
                    title="Uygulamayı Telefona Yükle (PWA)"
                    description="ProTracker'ı bir mobil uygulama gibi kullanın. İnternetiniz olmasa bile verilerinize erişin."
                    icon={Smartphone}
                    iconColor="text-emerald-500"
                    iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                    steps={[
                        "iPhone (Safari): Paylaş butonuna (kutu içinde ok) basın ve 'Ana Ekran'a Ekle' seçeneğini seçin.",
                        "Android (Chrome): Sağ üstteki üç noktaya tıklayın ve 'Uygulamayı Yükle' seçeneğine basın.",
                        "Artık ProTracker ana ekranınızda bir uygulama simgesi olarak görünecek!",
                        "Uygulamayı bu simge ile açtığınızda tarayıcı çubuğu gizlenir ve tam ekran deneyimi yaşarsınız."
                    ]}
                    placeholderText="Burada [Mobil Kurulum] adımlarını gösteren telefon ekranı mockup'ı bulunacak."
                />
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[32px] p-8 md:p-12 text-center text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-bold">Başarıya Hazır Mısınız?</h2>
                    <p className="text-primary-100 max-w-xl mx-auto font-medium opacity-90">
                        Sistemimizdeki her özellik, senin en yüksek potansiyele ulaşman için tasarlandı. Hadi, bugün yeni bir deneme girerek yolculuğuna başla!
                    </p>
                    <div className="flex justify-center pt-2">
                        <button className="px-8 py-3.5 bg-white text-primary-600 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                            Hemen Başlayalım
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SectionProps {
    title: string;
    description: string;
    icon: any;
    iconColor: string;
    iconBg: string;
    steps: string[];
    placeholderText: string;
}

function GuideSection({ title, description, icon: Icon, iconColor, iconBg, steps, placeholderText }: SectionProps) {
    return (
        <div className="bg-card border border-border rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110", iconBg)}>
                            <Icon className={iconColor} size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {description}
                    </p>

                    <ul className="space-y-3">
                        {steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 group/item">
                                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[10px] font-bold transition-colors group-hover/item:bg-primary-500 group-hover/item:text-white">
                                    {idx + 1}
                                </div>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1">
                    <div className="aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="space-y-4 relative z-10">
                            <div className="mx-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center">
                                <Icon className="text-slate-300" size={32} />
                            </div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed px-4">
                                {placeholderText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
