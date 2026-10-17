import React, { useState } from 'react';
import { UserProfile, Presentation } from '../types';

interface YangiTaqdimotProps {
  user: UserProfile;
  initialTopic?: string;
  initialSubject?: string;
  initialGrade?: string;
  onStartGeneration: (presentationData: Partial<Presentation>, totalCost: number) => void;
  onSaveDraft: (presentationData: Partial<Presentation>) => void;
}

export const YangiTaqdimot: React.FC<YangiTaqdimotProps> = ({
  user,
  initialTopic,
  initialSubject,
  initialGrade,
  onStartGeneration,
  onSaveDraft,
}) => {
  const [topic, setTopic] = useState(
    initialTopic || "Quyosh tizimi planetalari va kosmik fazo sirlari"
  );
  const [grade, setGrade] = useState(initialGrade || "6-sinf");
  const [subject, setSubject] = useState(
    initialSubject || "Astronomiya va Tabiatshunoslik"
  );
  const [language, setLanguage] = useState("O'zbek tili (Lotin)");
  const [objectives, setObjectives] = useState(
    "O'quvchilarda sayyoralar tartibi, ularning hajmi va tortishish kuchi haqida tushuncha shakllantirish, vizual va qiziqarli testlar orqali mustahkamlash."
  );

  const [slideCount, setSlideCount] = useState(28);
  const [style, setStyle] = useState("Akademik Moviy");
  const [textDensity, setTextDensity] = useState<'Qisqa' | 'Muvozanatli' | 'Batafsil'>('Muvozanatli');
  const [aiImagesCount, setAiImagesCount] = useState(4);

  const [quizEnabled, setQuizEnabled] = useState(true);
  const [quizCount, setQuizCount] = useState(5);
  const [quizFormat, setQuizFormat] = useState('mcq');

  // Dynamic cost calculation
  const slideCost = slideCount; // 1 credit per slide
  const aiImageCost = aiImagesCount * 2; // 2 credits per AI image
  const quizCost = quizEnabled ? quizCount : 0; // 1 credit per question
  const totalCost = slideCost + aiImageCost + quizCost;
  const remainingCredits = user.credits - totalCost;
  const isBalanceEnough = user.credits >= totalCost;

  const handleAiAutoFill = () => {
    setObjectives(
      `O'quvchilarda "${topic}" mavzusi bo'yicha ilmiy dunyoqarashni shakllantirish, asosiy qonuniyatlar va atamalarni mustahkamlash hamda interaktiv amaliy topshiriqlar orqali mantiqiy fikrlashni rivojlantirish.`
    );
  };

  const handleCreate = () => {
    if (!topic.trim()) {
      alert("Iltimos, dars mavzusini kiriting!");
      return;
    }
    if (!isBalanceEnough) {
      alert("Hisobingizda yetarli kredit mavjud emas. Iltimos, hisobingizni to'ldiring.");
      return;
    }

    onStartGeneration(
      {
        title: topic,
        subject,
        grade,
        language,
        slideCount,
        aiImagesCount,
        quizQuestionsCount: quizEnabled ? quizCount : 0,
        style,
        textDensity,
        objectives,
      },
      totalCost
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Header Context Tracker & Balance Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e2dfff] flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[28px]">auto_stories</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-xs px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-bold">
                  Pedagogik sehrgar v2.4
                </span>
                <span className="font-code-md text-xs text-[#464555]">#WIZ-88301</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-[#131b2e] mt-1 font-bold">
                Yangi taqdimot va dars loyihasi yaratish
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#f2f3ff] px-4 py-3 rounded-2xl border border-[#e2e7ff]">
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-xs text-[#464555]">Mavjud balansingiz:</span>
              <span className="font-title-md text-title-md text-[#006c49] font-bold">
                {user.credits} ta kredit
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="flex items-center md:items-start gap-3.5 p-3 rounded-xl bg-[#f2f3ff]/80 border border-[#e2e7ff]">
              <div className="w-9 h-9 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] uppercase tracking-wide text-[#006c49] font-bold">
                  1-qadam (Tayyor)
                </span>
                <span className="font-title-md text-sm text-[#131b2e] font-bold">
                  Dars ma'lumotlari
                </span>
                <span className="font-body-sm text-xs text-[#464555] truncate">
                  {subject} · {grade}
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center md:items-start gap-3.5 p-3 rounded-xl bg-[#e2dfff]/40 border-2 border-primary/40">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-[#e2dfff]">
                <span className="font-code-md text-sm font-bold">2</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] uppercase tracking-wide text-primary font-bold">
                  2-qadam (Jarayonda)
                </span>
                <span className="font-title-md text-sm text-[#131b2e] font-bold">
                  Taqdimot sozlamalari
                </span>
                <span className="font-body-sm text-xs text-[#464555]">
                  {slideCount} slayd · {style}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center md:items-start gap-3.5 p-3 rounded-xl bg-[#f2f3ff]/40 border border-[#eaedff]">
              <div className="w-9 h-9 rounded-full bg-[#e2e7ff] text-[#131b2e] flex items-center justify-center shrink-0 font-bold">
                <span className="font-code-md text-sm">3</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] uppercase tracking-wide text-[#464555] font-bold">
                  3-qadam (Sozlangan)
                </span>
                <span className="font-title-md text-sm text-[#131b2e] font-bold">
                  Interaktiv viktorina
                </span>
                <span className="font-body-sm text-xs text-[#464555]">
                  {quizEnabled ? `${quizCount} ta o'yin slaydi` : "O'chirilgan"}
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center md:items-start gap-3.5 p-3 rounded-xl bg-[#f2f3ff]/20 border border-[#eaedff]">
              <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#777587] flex items-center justify-center shrink-0">
                <span className="font-code-md text-sm font-bold">4</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] uppercase tracking-wide text-[#777587]">
                  4-qadam
                </span>
                <span className="font-title-md text-sm text-[#777587] font-semibold">
                  Tekshirish va yakun
                </span>
                <span className="font-body-sm text-xs text-[#777587]">Eksport & PPTX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Split: Forms (8 Cols) vs Calculation Sidebar (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Wizard Forms */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* SECTION 1: Dars ma'lumotlari */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 bg-[#f2f3ff]/50 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 rounded-t-2xl border-b border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#e2dfff] flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">school</span>
                  </span>
                  <div>
                    <h2 className="font-title-md text-title-md text-[#131b2e] font-bold">
                      1. Darsning asosiy ma'lumotlari
                    </h2>
                    <p className="font-body-sm text-body-sm text-[#464555]">
                      Davlat ta'lim standartlari (DTS) asosidagi dars pasporti
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-xs px-2.5 py-1 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">done_all</span> To'ldirildi
                </span>
              </div>

              {/* Mavzu Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-sm text-[#131b2e] flex items-center justify-between font-semibold">
                  <span>
                    Mavzu (Taqdimot sarlavhasi) <span className="text-[#ba1a1a]">*</span>
                  </span>
                  <span className="font-code-md text-xs text-[#464555]">
                    {topic.length} / 120 belgi
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[#777587] absolute left-3.5">
                    auto_awesome
                  </span>
                  <input
                    className="w-full bg-[#f2f3ff] text-[#131b2e] pl-11 pr-4 py-3 rounded-xl font-body-md text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none border border-transparent focus:border-primary/40 transition-all"
                    placeholder="Mavzuni kiriting..."
                    type="text"
                    maxLength={120}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <span className="font-body-sm text-xs text-[#464555] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">info</span> Dars mavzusini aniq kiriting — sun'iy intellekt reja tuzishda unga tayanadi.
                </span>
              </div>

              {/* Grid: Sinf, Fan, Til */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Sinf Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Sinf darajasi <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full appearance-none bg-[#f2f3ff] text-[#131b2e] pl-4 pr-10 py-3 rounded-xl font-body-md text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer border border-[#eaedff]"
                    >
                      <option value="5-sinf">5-sinf</option>
                      <option value="6-sinf">6-sinf</option>
                      <option value="7-sinf">7-sinf</option>
                      <option value="8-sinf">8-sinf</option>
                      <option value="9-sinf">9-sinf</option>
                      <option value="10-sinf">10-sinf</option>
                      <option value="11-sinf">11-sinf</option>
                    </select>
                    <span className="material-symbols-outlined text-[#777587] absolute right-3 top-3.5 pointer-events-none text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Fan Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    O'quv fani <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full appearance-none bg-[#f2f3ff] text-[#131b2e] pl-4 pr-10 py-3 rounded-xl font-body-md text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer truncate border border-[#eaedff]"
                    >
                      <option value="Astronomiya va Tabiatshunoslik">Astronomiya va Tabiatshunoslik</option>
                      <option value="Fizika (Laboratoriya asosida)">Fizika</option>
                      <option value="Biologiya (Davlat standarti)">Biologiya</option>
                      <option value="Adabiyot (Xamsa tahlili)">Ona tili va Adabiyot</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Geografiya">Geografiya</option>
                      <option value="Informatika">Informatika</option>
                      <option value="Tarix va jamiyat">Tarix va Jamiyat</option>
                      <option value="Kimyo">Kimyo</option>
                    </select>
                    <span className="material-symbols-outlined text-[#777587] absolute right-3 top-3.5 pointer-events-none text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Til Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Taqdimot tili <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full appearance-none bg-[#f2f3ff] text-[#131b2e] pl-4 pr-10 py-3 rounded-xl font-body-md text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer border border-[#eaedff]"
                    >
                      <option value="O'zbek tili (Lotin)">🇺🇿 O'zbek tili (Lotin)</option>
                      <option value="Ўзбек тили (Кирилл)">🇺🇿 Ўзбек тили (Кирилл)</option>
                      <option value="Rus tili">🇷🇺 Rus tili</option>
                      <option value="Qoraqalpoq tili">🇺🇿 Qoraqalpoq tili</option>
                      <option value="Ingliz tili">🇬🇧 Ingliz tili</option>
                    </select>
                    <span className="material-symbols-outlined text-[#777587] absolute right-3 top-3.5 pointer-events-none text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Dars maqsadlari (Textarea) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Dars maqsadlari va kompetensiyalar (Ixtiyoriy)
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    className="font-label-sm text-xs text-[#006c49] flex items-center gap-1 cursor-pointer hover:underline font-bold"
                  >
                    <span className="material-symbols-outlined text-[15px]">psychology</span>
                    AI bilan to'ldirish
                  </button>
                </div>
                <textarea
                  className="w-full bg-[#f2f3ff] text-[#131b2e] p-3.5 rounded-xl font-body-md text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none resize-none transition-all border border-[#eaedff]"
                  rows={3}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                />
                <span className="font-body-sm text-xs text-[#464555]">
                  Metodik talab: AI ushbu maqsadlar asosida slayd xulosalari va savollarni moslashtiradi.
                </span>
              </div>
            </div>

            {/* SECTION 2: Taqdimot sozlamalari */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-7">
              <div className="flex items-center justify-between pb-4 bg-[#f2f3ff]/50 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 rounded-t-2xl border-b border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">palette</span>
                  </span>
                  <div>
                    <h2 className="font-title-md text-title-md text-[#131b2e] font-bold">
                      2. Taqdimot sozlamalari va dizayn uslubi
                    </h2>
                    <p className="font-body-sm text-body-sm text-[#464555]">
                      Slaydlar hajmi, rang sxemasi va generativ illyustratsiyalar
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-xs px-2.5 py-1 rounded-full bg-[#e2dfff] text-primary font-bold">
                  Faol qadam
                </span>
              </div>

              {/* Slaydlar soni tanlovi */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                      Slaydlar soni
                    </span>
                    <p className="font-body-sm text-xs text-[#464555]">
                      Standart akademik 45 daqiqalik dars uchun mo'ljallangan hajm
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1 bg-[#e2e7ff] px-3.5 py-1.5 rounded-xl border border-primary/20">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {slideCount}
                    </span>
                    <span className="font-label-md text-xs text-[#464555]">ta slayd</span>
                  </div>
                </div>

                {/* Slider */}
                <div className="flex flex-col gap-2 pt-2">
                  <input
                    type="range"
                    min={15}
                    max={35}
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#e2e7ff] rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[#464555] font-code-md text-xs px-1">
                    <span className={slideCount === 15 ? 'text-primary font-bold' : ''}>
                      15 slayd (Qisqa)
                    </span>
                    <span className={slideCount === 20 ? 'text-primary font-bold' : ''}>
                      20 slayd
                    </span>
                    <span className={slideCount === 28 ? 'text-primary font-bold' : ''}>
                      28 slayd (Standart dars)
                    </span>
                    <span className={slideCount === 35 ? 'text-primary font-bold' : ''}>
                      35 slayd (Kengaytirilgan)
                    </span>
                  </div>
                </div>
              </div>

              {/* Dizayn uslubi (Visual cards) */}
              <div className="flex flex-col gap-3">
                <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                  Dizayn uslubi (Vizual andoza)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Card 1 */}
                  <div
                    onClick={() => setStyle("Akademik Moviy")}
                    className={`relative p-3.5 rounded-xl cursor-pointer transition-all flex flex-col gap-3 border ${
                      style === "Akademik Moviy"
                        ? "bg-[#e2dfff]/40 border-primary shadow-sm"
                        : "bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]"
                    }`}
                  >
                    {style === "Akademik Moviy" && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">done</span>
                      </div>
                    )}
                    <div className="w-full h-20 rounded-lg bg-white p-2 flex flex-col justify-between overflow-hidden shadow-inner border border-[#eaedff]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="w-12 h-1.5 rounded-full bg-[#e2e7ff]"></span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="w-full h-2 rounded bg-[#e2e7ff]"></span>
                        <span className="w-3/4 h-2 rounded bg-[#eaedff]"></span>
                      </div>
                      <div className="w-full h-4 rounded bg-[#e2dfff] flex items-center px-1.5">
                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                        Akademik Moviy
                      </h3>
                      <p className="font-body-sm text-xs text-[#464555] leading-tight mt-0.5">
                        Aniq, ilmiy va darslik mezonlariga mos
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div
                    onClick={() => setStyle("Zamonaviy Minimalist")}
                    className={`relative p-3.5 rounded-xl cursor-pointer transition-all flex flex-col gap-3 border ${
                      style === "Zamonaviy Minimalist"
                        ? "bg-[#e2dfff]/40 border-primary shadow-sm"
                        : "bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]"
                    }`}
                  >
                    {style === "Zamonaviy Minimalist" && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">done</span>
                      </div>
                    )}
                    <div className="w-full h-20 rounded-lg bg-white p-2 flex flex-col justify-between overflow-hidden shadow-inner border border-[#eaedff]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#131b2e]"></span>
                        <span className="w-10 h-1.5 rounded-full bg-[#e2e7ff]"></span>
                      </div>
                      <div className="space-y-1">
                        <span className="w-full h-1.5 rounded bg-[#e2e7ff]"></span>
                        <span className="w-4/5 h-1.5 rounded bg-[#e2e7ff]"></span>
                      </div>
                      <div className="w-full h-3 rounded bg-[#f2f3ff]"></div>
                    </div>
                    <div>
                      <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                        Zamonaviy Minimalist
                      </h3>
                      <p className="font-body-sm text-xs text-[#464555] leading-tight mt-0.5">
                        Kam matn, katta bo'shliq va yirik shriftlar
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div
                    onClick={() => setStyle("Ijodiy Yorqin")}
                    className={`relative p-3.5 rounded-xl cursor-pointer transition-all flex flex-col gap-3 border ${
                      style === "Ijodiy Yorqin"
                        ? "bg-[#e2dfff]/40 border-primary shadow-sm"
                        : "bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]"
                    }`}
                  >
                    {style === "Ijodiy Yorqin" && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">done</span>
                      </div>
                    )}
                    <div className="w-full h-20 rounded-lg bg-gradient-to-tr from-[#4b4dd8] to-[#6cf8bb] p-2 flex flex-col justify-between overflow-hidden shadow-inner text-white">
                      <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-primary text-[10px] font-bold">
                        ★
                      </span>
                      <div className="w-full h-3 rounded bg-white/90"></div>
                    </div>
                    <div>
                      <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                        Ijodiy Yorqin
                      </h3>
                      <p className="font-body-sm text-xs text-[#464555] leading-tight mt-0.5">
                        Boshlang'ich va faol interaktiv darslar uchun
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div
                    onClick={() => setStyle("Tabiat va Ekologiya")}
                    className={`relative p-3.5 rounded-xl cursor-pointer transition-all flex flex-col gap-3 border ${
                      style === "Tabiat va Ekologiya"
                        ? "bg-[#e2dfff]/40 border-primary shadow-sm"
                        : "bg-[#f2f3ff] border-transparent hover:bg-[#eaedff]"
                    }`}
                  >
                    {style === "Tabiat va Ekologiya" && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">done</span>
                      </div>
                    )}
                    <div className="w-full h-20 rounded-lg bg-white p-2 flex flex-col justify-between overflow-hidden shadow-inner border border-[#eaedff]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                        <span className="w-8 h-1.5 rounded-full bg-[#6ffbbe]"></span>
                      </div>
                      <div className="w-full h-4 rounded bg-[#6cf8bb]/40 flex items-center px-1">
                        <span className="w-6 h-1.5 bg-[#006c49] rounded-full"></span>
                      </div>
                      <div className="w-full h-2 rounded bg-[#e2e7ff]"></div>
                    </div>
                    <div>
                      <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                        Tabiat va Ekologiya
                      </h3>
                      <p className="font-body-sm text-xs text-[#464555] leading-tight mt-0.5">
                        Biologiya, geografiya va atrof-muhit mavzulari
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matn zichligi & AI rasmlar tanlovi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Matn zichligi */}
                <div className="flex flex-col gap-2">
                  <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Matn zichligi (Slayd tuzilishi)
                  </span>
                  <div className="p-1.5 bg-[#f2f3ff] rounded-xl flex items-center gap-1 border border-[#eaedff]">
                    {(['Qisqa', 'Muvozanatli', 'Batafsil'] as const).map((density) => (
                      <button
                        key={density}
                        type="button"
                        onClick={() => setTextDensity(density)}
                        className={`flex-1 py-2 px-3 text-center rounded-lg font-label-md text-xs transition-all ${
                          textDensity === density
                            ? 'bg-white text-primary shadow-xs font-bold'
                            : 'text-[#464555] hover:text-[#131b2e]'
                        }`}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                  <span className="font-body-sm text-xs text-[#464555]">
                    Tavsiya: Asosiy fikrlar tezislari + tushuntirish izohlari.
                  </span>
                </div>

                {/* AI rasmlar soni */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                      AI mualliflik illyustratsiyalari
                    </span>
                    <span className="font-code-md text-xs text-[#006c49] font-bold">
                      +2 kredit / dona
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 2, 4, 6].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setAiImagesCount(count)}
                        className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                          aiImagesCount === count
                            ? 'bg-primary text-white font-bold shadow-xs'
                            : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555]'
                        }`}
                      >
                        {count} ta
                      </button>
                    ))}
                  </div>
                  <span className="font-body-sm text-xs text-[#464555]">
                    Kosmik va ilmiy mavzular uchun yuqori aniqlikdagi DALL·E 3 generatsiyasi.
                  </span>
                </div>
              </div>

              {/* Generatsiya qilinadigan rasmlar vizual prevyusi */}
              <div className="p-4 rounded-xl bg-[#f2f3ff]/70 border border-[#e2e7ff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs text-[#131b2e] flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-primary">image</span>
                    Kutilayotgan AI illyustratsiyalar uslubi (Kosmos & Astronomiya):
                  </span>
                  <span className="font-label-sm text-xs text-primary font-semibold">
                    {aiImagesCount} ta fotorealistik rasm
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="relative h-24 rounded-xl overflow-hidden group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV29_N_MoCyoxmRj-RsKv_HWumcnR8e-oYWqz2konAZeXrlnOt_Qk2LIaVTbBz2GI5ARq9qIrrvRC2U6WA1ZgdHcP_TKV8CCrC1maMLRZWqmf1K6JJ_FKxgHE7Vyuws52Vh2bqYThoxvTplnXqFwt9u0zbpYt7hCSI5Qipx4EKUjLeHd4HXMdWACju4BoX-qE3zExXVlEWQQoGPW5HGyKH-qsGK7rByVU5cKrLogv-65qmd5xNB69emw"
                      alt="Saturn halqalari"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#131b2e]/80 text-white font-code-md text-[10px]">
                      Saturn halqalari
                    </span>
                  </div>
                  <div className="relative h-24 rounded-xl overflow-hidden group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSS8i-aPuHfAnQrG_S_2Sa1rgJCbgPxaru8I43UdXN7vvF1SxsV5Ou5RHBvmuBZ6jMf96tOnqV3gfJJ2v_IF_N8ns4xYH5OlYiuCgr_e42oL30QVKJQvc2Swmqf6OjLxVGx35Q45Yr2fwxW2U02a2Y-AmD0JsQNgECkLape_udm48Dho-Z0vFPxT_CYI_JP7W4r59VMlddQzcm8jjcFSwGBWtwLV-pI4WbWS8ZELgDisnpUVLpIi4pQQ"
                      alt="Quyosh va orbitasi"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#131b2e]/80 text-white font-code-md text-[10px]">
                      Quyosh va orbitasi
                    </span>
                  </div>
                  <div className="relative h-24 rounded-xl overflow-hidden group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1bTi5wt4KPf3Z1fsr-_HOn2BQ4CR8NzBgi7Ly_G01EGdSdg0vulNYQMBf_ML-9bel6OvFU8JjPjQzTOof1Ic9LHMP52927GRX2b8yrfCCoUEMlpIt8r314o9i4DWVe9HdyWRImSE3832leN4DsIdbv34JRdnyGFW_NxlQ9_7sjTjD8vN30eogT1Tmon5__l6r7eID3UKfwrLZzBaSFHx9baptMHKx6URx44ReODllRfphhM7-OBswdA"
                      alt="Mars relefi"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#131b2e]/80 text-white font-code-md text-[10px]">
                      Mars relefi
                    </span>
                  </div>
                  <div className="relative h-24 rounded-xl overflow-hidden group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ_H7-JGBOyoIwSVecBZ8iacnBsR2StBcQPrxlvM7qd6CrQHNg10H2QerckAo6oPVb6y8MWcK9x0kw8so1h8U72K_aSw10Fy3Ug-a3Q0tlTeiDpiweGAi96STG633MmX_eZuQGgP53eEaLHDfoayX3XCJY0rrk9XVsJawuKnan8KMmqCGoLtMD353DTrDHlDKUR32LheHXGVjf3XYociiqihS8G86bMCGI0qSfY5GRMHV1084vXUn-A"
                      alt="Galaktikalar"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#131b2e]/80 text-white font-code-md text-[10px]">
                      Galaktikalar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Interaktiv viktorina va test o'yini */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 bg-[#f2f3ff]/50 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 rounded-t-2xl border-b border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#006c49] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                  </span>
                  <div>
                    <h2 className="font-title-md text-title-md text-[#131b2e] font-bold">
                      3. Interaktiv o'yin va viktorina (PowerPoint Quiz)
                    </h2>
                    <p className="font-body-sm text-body-sm text-[#464555]">
                      Dars oxirida o'quvchilar bilmini sinovdan o'tkazuvchi giperhavolali o'yin
                    </p>
                  </div>
                </div>
                {/* Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizEnabled}
                    onChange={(e) => setQuizEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#006c49] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c7c4d8] after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  <span className="ml-2.5 font-label-lg text-sm text-[#131b2e] hidden sm:inline font-semibold">
                    {quizEnabled ? "Yoqilgan" : "O'chirilgan"}
                  </span>
                </label>
              </div>

              {quizEnabled && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Savollar soni */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-sm text-[#131b2e] font-semibold">
                        Savollar soni
                      </label>
                      <div className="relative">
                        <select
                          value={quizCount}
                          onChange={(e) => setQuizCount(Number(e.target.value))}
                          className="w-full appearance-none bg-[#f2f3ff] text-[#131b2e] pl-4 pr-10 py-3 rounded-xl font-body-md text-sm focus:ring-2 focus:ring-[#006c49] outline-none cursor-pointer border border-[#eaedff]"
                        >
                          <option value={3}>3 ta test savoli</option>
                          <option value={5}>5 ta test savoli (Tavsiya etiladi)</option>
                          <option value={7}>7 ta test savoli</option>
                          <option value={10}>10 ta test savoli</option>
                        </select>
                        <span className="material-symbols-outlined text-[#777587] absolute right-3 top-3.5 pointer-events-none text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Format */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-sm text-[#131b2e] font-semibold">
                        O'yin formati
                      </label>
                      <div className="relative">
                        <select
                          value={quizFormat}
                          onChange={(e) => setQuizFormat(e.target.value)}
                          className="w-full appearance-none bg-[#f2f3ff] text-[#131b2e] pl-4 pr-10 py-3 rounded-xl font-body-md text-sm focus:ring-2 focus:ring-[#006c49] outline-none cursor-pointer border border-[#eaedff]"
                        >
                          <option value="mcq">Ko'p variantli (A, B, C, D) interaktiv tugmalar</option>
                          <option value="tf">To'g'ri / Noto'g'ri (Mantiqiy viktorina)</option>
                          <option value="blitz">Tezkor blits-savollar</option>
                        </select>
                        <span className="material-symbols-outlined text-[#777587] absolute right-3 top-3.5 pointer-events-none text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlight Box with Visual Mechanism Diagram */}
                  <div className="p-5 rounded-2xl bg-[#f2f3ff] flex flex-col sm:flex-row gap-5 items-start border border-[#e2e7ff]">
                    <div className="w-12 h-12 rounded-2xl bg-[#e2dfff] text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">touch_app</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                          PowerPoint avtomatik giperhavola mexanizmi
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6cf8bb]/40 text-[#005236]">
                          Hech qanday dastursiz ishlaydi
                        </span>
                      </div>
                      <p className="font-body-md text-sm text-[#464555] leading-relaxed">
                        Har bir test savoli javob variantlari bosilganda, PowerPoint ichidagi giperhavolalar orqali darhol{' '}
                        <strong className="text-[#006c49]">"To'g'ri javob! 👏"</strong> yoki{' '}
                        <strong className="text-[#ba1a1a]">"Qayta urinib ko'ring ❌"</strong> slaydlariga yo'naltiradi. O'qituvchi kompyuterdan yoki proyektordan butun sinf bilan jonli viktorina o'ynashi mumkin.
                      </p>

                      {/* Mini Visual Flow Representation */}
                      <div className="flex items-center flex-wrap gap-2 pt-2">
                        <div className="px-3 py-1.5 rounded-xl bg-white text-[#131b2e] font-label-md text-xs flex items-center gap-1.5 shadow-xs border border-[#eaedff]">
                          <span className="material-symbols-outlined text-[16px] text-primary">help</span>
                          Savol slaydi
                        </div>
                        <span className="material-symbols-outlined text-[#777587] text-[18px]">
                          arrow_forward
                        </span>
                        <div className="px-3 py-1.5 rounded-xl bg-white text-[#006c49] font-label-md text-xs flex items-center gap-1.5 shadow-xs border border-[#eaedff] font-bold">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          "A" bosilsa: To'g'ri (+1 ball)
                        </div>
                        <span className="material-symbols-outlined text-[#777587] text-[18px]">
                          alt_route
                        </span>
                        <div className="px-3 py-1.5 rounded-xl bg-white text-[#ba1a1a] font-label-md text-xs flex items-center gap-1.5 shadow-xs border border-[#eaedff] font-bold">
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          "B, C" bosilsa: Qaytish
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Calculation & Cost Breakdown Sticky Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 bg-[#f2f3ff]/50 -mx-6 -mt-6 p-6 rounded-t-2xl border-b border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  <h3 className="font-title-md text-title-md text-[#131b2e] font-bold">
                    Kredit hisob-kitobi
                  </h3>
                </div>
                <span className="font-code-md text-xs text-[#464555] font-bold">
                  Hisoblash: Jonli
                </span>
              </div>

              {/* Itemized Breakdown */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#464555] text-[18px]">
                      slideshow
                    </span>
                    <span className="font-body-md text-sm text-[#131b2e]">
                      {slideCount} ta taqdimot slaydi
                    </span>
                  </div>
                  <span className="font-code-md text-sm text-[#131b2e] font-bold">
                    {slideCost} kredit
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#464555] text-[18px]">brush</span>
                    <span className="font-body-md text-sm text-[#131b2e]">
                      {aiImagesCount} ta AI mualliflik rasmi
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-xs text-[#464555]">
                      {aiImagesCount} × 2 =
                    </span>
                    <span className="font-code-md text-sm text-[#131b2e] font-bold">
                      {aiImageCost} kredit
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#464555] text-[18px]">quiz</span>
                    <span className="font-body-md text-sm text-[#131b2e]">
                      Interaktiv viktorina ({quizEnabled ? `${quizCount} savol` : "0"})
                    </span>
                  </div>
                  <span className="font-code-md text-sm text-[#131b2e] font-bold">
                    {quizCost} kredit
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#464555] text-[18px]">
                      description
                    </span>
                    <span className="font-body-md text-sm text-[#131b2e]">
                      Metodik izohlar va dars rejasi
                    </span>
                  </div>
                  <span className="font-label-sm text-xs px-2 py-0.5 rounded bg-[#6cf8bb]/40 text-[#005236] font-bold">
                    BEPUL
                  </span>
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 rounded-xl bg-[#eaedff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Jami zarur kredit:
                  </span>
                  <span className="font-headline-sm text-xl text-primary font-extrabold">
                    {totalCost} ta
                  </span>
                </div>
                <div className="h-px bg-[#c7c4d8]/40 w-full"></div>
                <div className="flex flex-col gap-1.5 font-body-sm text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#464555]">Hozirgi balansingiz:</span>
                    <span className="font-code-md text-[#131b2e] font-bold">
                      {user.credits} ta
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#464555]">Yaratilgandan so'ng qoldiq:</span>
                    <span
                      className={`font-code-md font-bold ${
                        remainingCredits >= 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {remainingCredits} ta kredit
                    </span>
                  </div>
                </div>

                {/* Balance usage bar */}
                <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-1 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isBalanceEnough ? 'bg-primary' : 'bg-[#ba1a1a]'
                    }`}
                    style={{
                      width: `${Math.min(100, (totalCost / Math.max(1, user.credits)) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Pedagogical Safety Notice */}
              <div className="flex gap-2.5 p-3 rounded-xl bg-[#f2f3ff] text-[#464555] border border-[#e2e7ff]">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  verified_user
                </span>
                <p className="font-body-sm text-xs leading-relaxed">
                  Sehrgar maydonlarini o'zgartirish mutlaqo bepul. Kreditlar faqat{' '}
                  <strong className="text-[#131b2e]">"Taqdimotni yaratish"</strong> tugmasi bosilib, taqdimot fayli shakllangach yechiladi.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary text-white hover:bg-primary-container font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  Taqdimotni yaratish ({totalCost} kredit)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSaveDraft({
                      title: topic,
                      subject,
                      grade,
                      language,
                      slideCount,
                      aiImagesCount,
                      quizQuestionsCount: quizEnabled ? quizCount : 0,
                      style,
                      textDensity,
                      objectives,
                      status: 'Qoralama',
                    })
                  }
                  className="w-full py-3 px-6 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] font-label-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark</span>
                  Qoralama sifatida saqlash
                </button>
              </div>

              {/* Quick Support Help */}
              <div className="flex items-center justify-center gap-2 text-[#464555] pt-1">
                <span className="material-symbols-outlined text-[16px]">headset_mic</span>
                <span className="font-body-sm text-xs">
                  Yordam kerakmi?{' '}
                  <a
                    className="text-primary underline font-medium"
                    href="https://t.me/ai_avtoslayd_support"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram qo'llab-quvvatlash
                  </a>
                </span>
              </div>
            </div>

            {/* DTS Guarantee */}
            <div className="p-4 rounded-2xl bg-[#f2f3ff] border border-[#e2e7ff] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6cf8bb] flex items-center justify-center text-[#005236] shrink-0 font-bold">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-xs text-[#131b2e] font-bold">
                  Xalq ta'limi vazirligi standarti
                </span>
                <span className="font-body-sm text-xs text-[#464555]">
                  45 daqiqalik dars bloklariga to'liq moslashgan tuzilma.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
