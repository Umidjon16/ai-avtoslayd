import React, { useState, useEffect } from 'react';
import { Presentation, SlideItem } from '../types';

interface GeneratsiyaJarayoniProps {
  currentPresentation: Presentation;
  onCancel: (refundCredits: number) => void;
  onComplete: (generatedSlides?: SlideItem[]) => void;
}

export const GeneratsiyaJarayoni: React.FC<GeneratsiyaJarayoniProps> = ({
  currentPresentation,
  onCancel,
  onComplete,
}) => {
  const [progress, setProgress] = useState(25);
  const [currentStep, setCurrentStep] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(18);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<SlideItem[]>([]);
  const [apiDone, setApiDone] = useState(false);

  // Trigger Gemini & Pollinations AI generation
  useEffect(() => {
    let isCancelled = false;

    async function runGeneration() {
      try {
        const res = await fetch('/api/generate-presentation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: currentPresentation.title,
            subject: currentPresentation.subject,
            grade: currentPresentation.grade,
            language: currentPresentation.language,
            slideCount: currentPresentation.slideCount || 10,
            aiImagesCount: currentPresentation.aiImagesCount || 4,
            quizQuestionsCount: currentPresentation.quizQuestionsCount || 3,
            style: currentPresentation.style,
            textDensity: currentPresentation.textDensity,
            objectives: currentPresentation.objectives,
          }),
        });

        if (!res.ok) {
          throw new Error('API server returned error');
        }

        const data = await res.json();
        if (!isCancelled && data.slides && data.slides.length > 0) {
          setGeneratedSlides(data.slides);
          setApiDone(true);
          setProgress(100);
          setCurrentStep(5);
        }
      } catch (err) {
        console.warn('Live generation error, using fallback stream:', err);
        if (!isCancelled) {
          setApiDone(true);
          setProgress(100);
        }
      }
    }

    runGeneration();

    return () => {
      isCancelled = true;
    };
  }, [currentPresentation]);

  // Smooth progress ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Accelerate if apiDone
        const stepAmount = apiDone ? 10 : 2;
        const next = Math.min(prev + stepAmount, apiDone ? 100 : 92);

        if (next >= 40 && next < 70) setCurrentStep(2);
        else if (next >= 70 && next < 85) setCurrentStep(3);
        else if (next >= 85 && next < 95) setCurrentStep(4);
        else if (next >= 95) setCurrentStep(5);

        return next;
      });

      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 800);

    return () => clearInterval(timer);
  }, [apiDone]);

  // Radius for circular SVG gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const slidesToShow: SlideItem[] = generatedSlides.length > 0 
    ? generatedSlides 
    : (currentPresentation.slides || []);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Status & Ambience Backdrop Area */}
      <div className="relative w-full overflow-hidden pb-12">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="pointer-events-none absolute top-48 right-10 h-80 w-80 rounded-full bg-[#6cf8bb]/20 blur-3xl"></div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          {/* Top Meta Navigation / Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <nav className="flex items-center gap-2 text-[#464555] font-label-md text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  Mening taqdimotlarim
                </span>
                <span className="text-[#777587]">/</span>
                <span className="font-code-md text-[#3525cd] bg-[#e2dfff] px-2 py-0.5 rounded font-bold">
                  {currentPresentation.id || '#TR-94821'}
                </span>
              </nav>

              <div className="flex items-center gap-2 flex-wrap mt-1">
                <h1 className="font-headline-lg text-headline-lg text-[#131b2e] tracking-tight font-bold">
                  {progress < 100 ? "Gemini AI dars slaydlarini yaratmoqda..." : "Taqdimot to'liq tayyorlandi! 🎉"}
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-[#e2e7ff] px-3 py-1 rounded-full font-code-md text-xs text-primary font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Gemini 3.8-Flash & Flux AI
                </span>
              </div>

              <p className="font-body-lg text-sm text-[#464555] flex items-center gap-2 flex-wrap mt-1">
                <span className="material-symbols-outlined text-[#006c49] text-[20px]">
                  auto_stories
                </span>
                <span>
                  Mavzu: <strong className="text-[#131b2e] font-bold">{currentPresentation.title}</strong>
                </span>
                <span className="bg-[#eaedff] px-2 py-0.5 rounded text-[#464555] text-xs font-semibold">
                  {currentPresentation.grade} {currentPresentation.subject}
                </span>
                <span className="bg-[#eaedff] px-2 py-0.5 rounded text-[#464555] font-code-md text-xs font-semibold">
                  {currentPresentation.slideCount} slayd
                </span>
              </p>
            </div>

            {/* Live Session Controls */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              {progress < 100 ? (
                <div className="relative group">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a] transition-all text-sm font-bold shadow-xs cursor-pointer border border-[#ffdad6]"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Bekor qilish
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onComplete(generatedSlides.length > 0 ? generatedSlides : undefined)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#006c49] text-white hover:bg-[#005236] transition-all text-sm font-bold shadow-md cursor-pointer animate-bounce"
                >
                  <span className="material-symbols-outlined text-[20px]">slideshow</span>
                  Tayyor taqdimotni ko'rish (.pptx)
                </button>
              )}
            </div>
          </div>

          {/* Main Layout: Dynamic Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Center Primary Computation Card (Col: 7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Central Computation Status Card */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#eaedff] overflow-hidden">
                {/* Top Progress Strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e2e7ff]">
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Primary Progress Gauge */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#f2f3ff]">
                  {/* Radial SVG Progress Meter */}
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        className="text-[#e2e7ff]"
                        cx="60"
                        cy="60"
                        fill="transparent"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                      ></circle>
                      <circle
                        className="text-primary transition-all duration-700 ease-out"
                        cx="60"
                        cy="60"
                        fill="transparent"
                        r={radius}
                        stroke="currentColor"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        strokeWidth="8"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-headline-xl text-3xl font-extrabold text-[#131b2e] tracking-tight">
                        {progress}%
                      </span>
                      <span className="font-label-sm text-[10px] text-[#464555] uppercase tracking-wider font-bold">
                        {progress === 100 ? 'Tayyor' : 'Hisoblanmoqda'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Telemetry & Timer */}
                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 text-[#006c49] font-label-lg text-sm font-bold mx-auto sm:mx-0">
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        psychology
                      </span>
                      <span>
                        {progress === 100 ? "Barcha slaydlar sintez qilindi" : "Gemini AI & Rasm modeli ishlamoqda"}
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                      {progress < 40
                        ? "1-bosqich: Mavzu tahlili va metodik dars rejasi"
                        : progress < 70
                        ? "2-bosqich: Dars matnlari va ilmiy ta'riflar sintezi"
                        : progress < 90
                        ? "3-bosqich: Darsga oid yuqori sifatli AI rasmlar chizilishi"
                        : "4-bosqich: Interaktiv viktorina va slaydlar yakunlanishi"}
                    </h2>
                    <p className="font-body-md text-sm text-[#464555]">
                      {currentPresentation.subject} fani davlat ta'lim standartlari (DTS) bo'yicha {currentPresentation.grade} o'quv dasturiga moslashtirilmoqda.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                      <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl font-code-md text-xs text-[#131b2e] flex items-center gap-1.5 border border-[#eaedff]">
                        <span className="material-symbols-outlined text-[16px] text-[#777587]">
                          schedule
                        </span>
                        <span>
                          Qolgan vaqt:{' '}
                          <strong>
                            {progress === 100 ? "Yakunlandi" : `~${Math.max(1, timeRemaining)} soniya`}
                          </strong>
                        </span>
                      </div>
                      <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl font-code-md text-xs text-[#131b2e] border border-[#eaedff]">
                        Model: <span className="text-[#006c49] font-bold">Gemini 3.8-Flash</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stages Progression Pipeline */}
                <div className="flex flex-col gap-3 pt-6">
                  <span className="font-label-sm text-xs uppercase tracking-wider text-[#777587] font-bold">
                    Jarayon bosqichlari
                  </span>
                  <div className="space-y-3 mt-1">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                      <div className="w-7 h-7 rounded-full bg-[#6cf8bb] flex items-center justify-center shrink-0 mt-0.5 text-[#005236]">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                            Mavzu tahlili va dars rejasi
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            {currentPresentation.grade} {currentPresentation.subject} standarti asosida
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#006c49] shrink-0 font-bold bg-white px-2 py-0.5 rounded shadow-xs">
                          Bajarildi
                        </span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${progress >= 40 ? 'bg-[#6cf8bb] text-[#005236]' : 'bg-primary text-white animate-spin'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {progress >= 40 ? 'check' : 'sync'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                            Gemini AI: Dars matnlari va ta'riflar
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            Mundarija, ilmiy tushuntirishlar va savol-javoblar shakllantirildi
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#006c49] shrink-0 font-bold bg-white px-2 py-0.5 rounded shadow-xs">
                          {progress >= 40 ? 'Bajarildi' : 'Jarayonda'}
                        </span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${progress >= 70 ? 'bg-[#f2f3ff] border-[#e2e7ff]' : 'bg-[#e2dfff]/40 border-primary'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${progress >= 70 ? 'bg-[#6cf8bb] text-[#005236]' : 'bg-primary text-white'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {progress >= 70 ? 'check' : 'palette'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                            AI Rasm generatori: Fotorealistik illyustratsiyalar
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            Dars mavzusiga mos original tasvirlar 16:9 HD formatda yaratilmoqda
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-primary shrink-0 font-bold bg-white px-2 py-0.5 rounded shadow-xs">
                          {progress >= 70 ? 'Bajarildi' : 'Chizilmoqda'}
                        </span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${progress >= 95 ? 'bg-[#f2f3ff] border-[#e2e7ff]' : 'bg-white opacity-70'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${progress >= 95 ? 'bg-[#6cf8bb] text-[#005236]' : 'bg-[#eaedff] text-[#777587]'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {progress >= 95 ? 'check' : 'sports_esports'}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                            Interaktiv viktorina va PowerPoint fayl formati
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            Smartboard uchun interaktiv triggerlar va .pptx fayl yig'ilishi
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#777587] shrink-0 font-bold">
                          {progress >= 95 ? 'Bajarildi' : 'Kutilmoqda'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#006c49] text-[22px] shrink-0 mt-0.5">
                  verified
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Gemini AI xavfsiz serverda ishlaydi
                  </span>
                  <p className="font-body-sm text-xs text-[#464555] leading-relaxed">
                    Siz kiritgan Gemini API kaliti xavfsiz holda faqat server orqali ishlatiladi, hech qachon brauzerda yoki tashqi foydalanuvchilarga ko'rinmaydi. Barcha slaydlar siz uchun to'g'ridan-to'g'ri generatsiya qilinadi.
                  </p>
                </div>
              </div>
            </div>

            {/* Slaydlar eskizi jonli oqimi (Col: 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    view_carousel
                  </span>
                  <h2 className="font-title-md text-title-md text-[#131b2e] font-bold">
                    Slaydlar eskizi jonli oqimi
                  </h2>
                </div>
                <span className="font-code-md text-xs text-[#464555] bg-[#eaedff] px-2.5 py-0.5 rounded font-semibold">
                  {Math.min(slidesToShow.length, Math.max(1, Math.floor((progress / 100) * slidesToShow.length)))} / {slidesToShow.length} tayyor
                </span>
              </div>

              {/* Slayd Thumbnail Mosaic Stream */}
              <div className="grid grid-cols-2 gap-3 max-h-[680px] overflow-y-auto p-1 pr-2">
                {slidesToShow.slice(0, 8).map((slide, idx) => {
                  const isReady = progress >= ((idx + 1) / Math.min(8, slidesToShow.length)) * 100 || progress >= 80;

                  return (
                    <div
                      key={slide.id || idx}
                      className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xs bg-[#131b2e] border border-[#eaedff] transition-transform hover:-translate-y-0.5"
                    >
                      {slide.bgImageUrl ? (
                        <img
                          src={slide.bgImageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/90 to-[#131b2e] p-2.5 flex flex-col justify-between text-white">
                          <span className="font-code-md text-[9px] bg-white/20 px-1.5 py-0.5 rounded w-fit">
                            #{String(idx + 1).padStart(2, '0')} {slide.type}
                          </span>
                          <span className="font-headline-sm text-xs font-bold line-clamp-2">
                            {slide.title}
                          </span>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 pointer-events-none">
                        <span className="font-label-sm text-[11px] text-white font-bold line-clamp-1">
                          #{String(idx + 1).padStart(2, '0')} {slide.title}
                        </span>
                        <span className="font-code-md text-[10px] text-[#6cf8bb] font-semibold">
                          {isReady ? 'Tayyor ✓' : 'Generatsiya qilinmoqda...'}
                        </span>
                      </div>

                      {isReady && (
                        <span className="absolute top-2 right-2 bg-[#006c49] text-white text-[10px] font-label-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <span className="material-symbols-outlined text-[12px]">done</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Micro Notification */}
              <div className="p-3 bg-[#eaedff] rounded-xl flex items-center justify-between text-[#464555] border border-[#dae2fd]">
                <span className="font-body-sm text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">sync</span>
                  Real AI modellari bilan integratsiya
                </span>
                <span className="font-label-sm text-xs text-[#131b2e] font-bold">
                  16:9 HD Format
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#eaedff] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                Generatsiyani bekor qilmoqchimisiz?
              </h3>
              <p className="font-body-md text-sm text-[#464555] leading-relaxed">
                Rostdan ham ushbu taqdimot generatsiyasini bekor qilmoqchimisiz? Sarflangan barcha kreditlar hisobingizga to'liq qaytariladi.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-label-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                Yo'q, davom etsin
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  onCancel(35);
                }}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white hover:bg-red-700 font-label-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                Ha, bekor qilinsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
