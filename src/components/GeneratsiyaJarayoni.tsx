import React, { useState, useEffect } from 'react';
import { Presentation } from '../types';

interface GeneratsiyaJarayoniProps {
  currentPresentation: Presentation;
  onCancel: (refundCredits: number) => void;
  onComplete: () => void;
}

export const GeneratsiyaJarayoni: React.FC<GeneratsiyaJarayoniProps> = ({
  currentPresentation,
  onCancel,
  onComplete,
}) => {
  const [progress, setProgress] = useState(72);
  const [currentStep, setCurrentStep] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(42);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 1;
        if (next >= 85 && currentStep < 4) {
          setCurrentStep(4);
        } else if (next >= 95 && currentStep < 5) {
          setCurrentStep(5);
        }
        return next;
      });

      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1500);

    return () => clearInterval(timer);
  }, [currentStep]);

  // Radius for circular SVG gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
                  {progress < 100 ? "Taqdimot tayyorlanmoqda..." : "Taqdimot muvaffaqiyatli tayyorlandi! 🎉"}
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-[#e2e7ff] px-3 py-1 rounded-full font-code-md text-xs text-primary font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Job ID: {currentPresentation.jobId || '#JOB-88392'}
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
                    Generatsiyani bekor qilish
                  </button>
                  {/* Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-[#283044] text-[#eef0ff] text-xs rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-[#6cf8bb] text-[18px] shrink-0">
                        info
                      </span>
                      <span>
                        Hali fayl yakunlanmaganligi sababli bekor qilinsa, barcha sarflangan kreditlar hisobingizga to'liq qaytariladi.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onComplete}
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
                {/* Subtle Top Progress Strip */}
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
                        {progress === 100 ? 'Tayyor' : 'Tugallandi'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Telemetry & Timer */}
                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 text-[#006c49] font-label-lg text-sm font-bold mx-auto sm:mx-0">
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        cyclone
                      </span>
                      <span>
                        {progress === 100 ? "AI ishlov yakunlandi" : "AI klasteri faol hisoblamoqda"}
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                      {progress < 85
                        ? "3-bosqich: Vizual elementlar sintezi"
                        : progress < 95
                        ? "4-bosqich: Viktorina va giperhavolalar bog'lanishi"
                        : "5-bosqich: .pptx fayl siqilishi va tayyorlanishi"}
                    </h2>
                    <p className="font-body-md text-sm text-[#464555]">
                      Astronomiya darsligi metodikasi asosida ilmiy aniqlikdagi original illyustratsiyalar va giperhavolalar tuzilmoqda.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                      <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl font-code-md text-xs text-[#131b2e] flex items-center gap-1.5 border border-[#eaedff]">
                        <span className="material-symbols-outlined text-[16px] text-[#777587]">
                          schedule
                        </span>
                        <span>
                          Taxminiy vaqt:{' '}
                          <strong>
                            {progress === 100 ? "Yakunlandi" : `~${timeRemaining} soniya`}
                          </strong>
                        </span>
                      </div>
                      <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl font-code-md text-xs text-[#131b2e] border border-[#eaedff]">
                        Tezlik: <span className="text-[#006c49] font-bold">1.4 slayd/son</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stages Progression Pipeline */}
                <div className="flex flex-col gap-3 pt-6">
                  <span className="font-label-sm text-xs uppercase tracking-wider text-[#777587] font-bold">
                    Jarayon bosqichlari auditi
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
                            Mavzu tahlil qilindi va dars rejasi tuzildi
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            Davlat ta'lim standarti (DTS) 6-sinf talablariga moslashtirildi
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#006c49] shrink-0 font-bold bg-white px-2 py-0.5 rounded shadow-xs">
                          0.4 daq
                        </span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                      <div className="w-7 h-7 rounded-full bg-[#6cf8bb] flex items-center justify-center shrink-0 mt-0.5 text-[#005236]">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                            28 ta slaydning pedagogik matnlari tayyorlandi
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            Slayd ta'riflari, savol-javoblar va atamalar lug'ati shakllantirildi
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#006c49] shrink-0 font-bold bg-white px-2 py-0.5 rounded shadow-xs">
                          1.1 daq
                        </span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div
                      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                        progress < 85
                          ? "bg-[#e2dfff]/40 border-primary shadow-xs"
                          : "bg-[#f2f3ff] border-[#e2e7ff]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                          progress < 85
                            ? "bg-primary text-white"
                            : "bg-[#6cf8bb] text-[#005236]"
                        }`}
                      >
                        {progress < 85 ? (
                          <span className="material-symbols-outlined text-[18px] animate-spin">
                            progress_activity
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-title-md text-sm text-primary font-bold">
                              Mavzuga oid 4 ta yuqori sifatli AI illyustratsiya chizilmoqda...
                            </h3>
                            <span className="bg-primary text-white font-code-md text-xs px-2 py-0.5 rounded-full font-bold">
                              {Math.min(100, Math.floor((progress / 85) * 100))}%
                            </span>
                          </div>
                          <p className="font-body-sm text-xs text-[#464555]">
                            Saturn halqalari, Mars atmosferasi va Quyosh tojlari fotorealistik uslubda
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-primary font-bold bg-white px-2.5 py-0.5 rounded shrink-0 shadow-xs">
                          {progress < 85 ? "Davom etmoqda" : "Bajarildi"}
                        </span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                        progress >= 85 && progress < 95
                          ? "bg-[#e2dfff]/40 border-primary"
                          : progress >= 95
                          ? "bg-[#f2f3ff] border-[#e2e7ff]"
                          : "bg-white opacity-60 border-dashed border-[#c7c4d8]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          progress >= 95
                            ? "bg-[#6cf8bb] text-[#005236]"
                            : progress >= 85
                            ? "bg-primary text-white"
                            : "bg-[#eaedff] text-[#777587]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {progress >= 95 ? "check" : "timer"}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-semibold">
                            Interaktiv viktorina va PowerPoint giperhavolalari bog'lanmoqda
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            O'quvchilar uchun 5 ta test savoli va animatsion navigatsiya tugmalari
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#777587] shrink-0">
                          {progress >= 95 ? "Bajarildi" : progress >= 85 ? "Faol" : "Kutilmoqda"}
                        </span>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                        progress >= 95
                          ? "bg-[#6cf8bb]/20 border-[#006c49]"
                          : "bg-white opacity-60 border-dashed border-[#c7c4d8]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          progress === 100
                            ? "bg-[#6cf8bb] text-[#005236]"
                            : "bg-[#eaedff] text-[#777587]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {progress === 100 ? "check" : "archive"}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-title-md text-sm text-[#131b2e] font-semibold">
                            Yakuniy .pptx fayli yig'ilmoqda va formatlanmoqda
                          </h3>
                          <p className="font-body-sm text-xs text-[#464555]">
                            DPI siqish, shriftlarni biriktirish va yakuniy yuklab olish havola yaratish
                          </p>
                        </div>
                        <span className="font-code-md text-xs text-[#777587] shrink-0 font-bold">
                          {progress === 100 ? "Tayyor!" : "Kutilmoqda"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#777587] text-[22px] shrink-0 mt-0.5">
                  info
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-label-lg text-sm text-[#131b2e] font-semibold">
                    Vaqt me'yori haqida eslatma
                  </span>
                  <p className="font-body-sm text-xs text-[#464555] leading-relaxed">
                    Taqdimot hajmi (28 slayd) va generatsiya qilinayotgan maxsus AI rasmlar soniga qarab jarayon{' '}
                    <strong>1–3 daqiqa</strong> vaqt olishi mumkin. Server yuklamasiga qarab aniq soniyalarda yakunlanish kafolatlanmaydi. Siz ushbu sahifani yopishingiz mumkin; tayyor bo'lgach bildirishnoma yuboriladi.
                  </p>
                </div>
              </div>

              {/* Refund safeguard */}
              <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6cf8bb]/40 text-[#006c49] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">verified_user</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-sm text-[#131b2e] font-bold">
                      Xavfsizlik va kredit qaytarish kafolati
                    </span>
                    <span className="bg-[#006c49] text-white font-label-sm text-[11px] px-2 py-0.5 rounded font-bold">
                      100% Sug'urta
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-[#464555] mt-1 leading-relaxed">
                    Agar internet uzilishi yoki tizim kutilmagan xatoligi yuz bersa, yechilgan barcha kreditlar avtomatik tarzda hisobingizga 100% qaytariladi va bu haqda SMS/Email bildirishnoma beriladi.
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
                  {Math.min(28, Math.floor((progress / 100) * 28))} / 28 tayyor
                </span>
              </div>

              {/* Slayd Thumbnail Mosaic Stream */}
              <div className="grid grid-cols-2 gap-3 max-h-[680px] overflow-y-auto p-1 pr-2">
                {/* Slide 1 */}
                <div className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xs bg-[#e2e7ff] transition-transform hover:-translate-y-0.5 border border-[#eaedff]">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH1rkpYQOdRc3OY99uPABM5ERGnUqNPJHH1HDmiKodbnJaQl_CTOa2BPMRPf0t1g6uEAxHgzDnCBDD7tOhUvie9nydISrT8mj5TlpPdHP9LHMF07AkGNMie_tuHBe3MfCRnUnWtSVMw6AwSeANwry3ptwFcWhhQUhRIoTWI1r1Cl_5ObSXWkff-CrFA1U5uZE6jZ8KVoLUo02jl0mTN-CY-dlmH6N-gv1lUR_QAorvPWxXrrum3SPwRQ"
                    alt="Solar System"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="font-label-sm text-[11px] text-white font-bold">
                      #01 Sarlavha: Quyosh tizimi
                    </span>
                    <span className="font-code-md text-[10px] text-[#e2e7ff]">
                      Bajarildi • Kirish
                    </span>
                  </div>
                  <span className="absolute top-2 right-2 bg-[#006c49] text-white text-[10px] font-label-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">done</span>
                  </span>
                </div>

                {/* Slide 2 */}
                <div className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xs bg-white p-3 flex flex-col justify-between transition-transform hover:-translate-y-0.5 border border-[#eaedff]">
                  <div className="flex items-center justify-between">
                    <span className="font-code-md text-[10px] text-[#777587] font-semibold">
                      SLAYD 02
                    </span>
                    <span className="bg-[#e2dfff] text-primary font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Matn
                    </span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-xs leading-tight text-[#131b2e] font-bold line-clamp-1">
                      Sayyoralar tasnifi
                    </p>
                    <p className="font-body-sm text-[10px] text-[#464555] line-clamp-2 mt-0.5">
                      Yer guruhi va Gigant gaz sayyoralarining asosiy farqlari...
                    </p>
                  </div>
                  <div className="w-full bg-[#f2f3ff] rounded h-1">
                    <div className="bg-[#006c49] h-1 rounded w-full"></div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xs bg-[#e2e7ff] border border-[#eaedff]">
                  <div
                    className="w-full h-full bg-cover bg-center filter blur-xs brightness-75"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVgtSeJo-lwFZ435ZqXGHMxTKbtRTdAO0RReHda2NFPDRTdTrKS_NRYGYW8NvLAXz3wsH6hpFtFT2P7ibiKE0A3wj9dUkJrB8h6rzUHdmVVszZjPFRSjVEM9Y-3EuLdWWpayhTYmGZw4cE41I6_7W_Wsr-WezfL2DtJjiNjpnZot44j6r96QrXrzyiF2kgjD0exoTyi1f0wZl-1AWoxVEEfTms6eaANSiJdpMmd_VL1oTyRH_jWPoKSA')`,
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-primary/30 flex flex-col items-center justify-center text-center p-2">
                    <span className="material-symbols-outlined text-white text-[24px] animate-spin">
                      autorenew
                    </span>
                    <span className="font-label-sm text-xs text-white font-bold mt-1">
                      AI Generatsiya...
                    </span>
                    <span className="font-code-md text-[10px] text-[#e2dfff]">
                      Yupiter atmosferasi
                    </span>
                  </div>
                  <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-code-md px-1.5 py-0.5 rounded font-bold">
                    #03
                  </span>
                </div>

                {/* Slide 4 */}
                <div className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xs bg-[#e2e7ff] border border-[#eaedff]">
                  <div
                    className="w-full h-full bg-cover bg-center filter blur-xs brightness-75"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjjFAfxNIh8-ZKWdPlGwt5vKWFve8GqQ2NWquwFF3EDY3EwdfQ6ix9Dz9CYKm9hP80aJfinnvu8_tK0nk1Z2cgAfUKWmdjo7gBirywnA9Vb9F1yqpuCNaBIsk858GTPnx5jkk5JEldf2ylSRoWrYgYUX7BmM3qauzzDsW41qy8JC1UqprYzTEkZVtO7Ks6VPQ5MzzsEvQxcKMjIpI8kclQJ1X2wjznxjFwuMkiRceyAFFQNl3WOyPtrw')`,
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-primary/30 flex flex-col items-center justify-center text-center p-2">
                    <span className="material-symbols-outlined text-white text-[24px] animate-spin">
                      image
                    </span>
                    <span className="font-label-sm text-xs text-white font-bold mt-1">
                      Render: Saturn
                    </span>
                    <span className="font-code-md text-[10px] text-[#e2dfff]">
                      Optik to'rlar
                    </span>
                  </div>
                  <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-code-md px-1.5 py-0.5 rounded font-bold">
                    #04
                  </span>
                </div>

                {/* Slide 5: Quiz Wireframe */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xs bg-white p-3 flex flex-col justify-between border border-[#eaedff]">
                  <div className="flex items-center justify-between">
                    <span className="font-code-md text-[10px] text-[#777587] font-semibold">
                      SLAYD 24
                    </span>
                    <span className="bg-[#6cf8bb]/40 text-[#005236] font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Viktorina
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-3/4 bg-[#e2e7ff] rounded animate-pulse"></div>
                    <div className="h-1.5 w-full bg-[#f2f3ff] rounded animate-pulse"></div>
                    <div className="h-1.5 w-5/6 bg-[#f2f3ff] rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-3 w-1/2 bg-[#e2e7ff] rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-[#e2e7ff] rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Slide 6 */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#f2f3ff] flex flex-col items-center justify-center text-center p-3 opacity-60 border border-dashed border-[#c7c4d8]">
                  <span className="material-symbols-outlined text-[#777587] text-[22px]">
                    hourglass_empty
                  </span>
                  <span className="font-label-sm text-[11px] text-[#464555] mt-1 font-semibold">
                    Slayd 25 - Xulosa
                  </span>
                  <span className="font-code-md text-[9px] text-[#777587]">Navbatda</span>
                </div>

                {/* Slide 7 */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#f2f3ff] flex flex-col items-center justify-center text-center p-3 opacity-40 border border-dashed border-[#c7c4d8]">
                  <span className="material-symbols-outlined text-[#777587] text-[22px]">
                    hourglass_empty
                  </span>
                  <span className="font-label-sm text-[11px] text-[#464555] mt-1">
                    Slayd 26 - Manbalar
                  </span>
                  <span className="font-code-md text-[9px] text-[#777587]">Navbatda</span>
                </div>

                {/* Slide 8 */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#f2f3ff] flex flex-col items-center justify-center text-center p-3 opacity-30 border border-dashed border-[#c7c4d8]">
                  <span className="material-symbols-outlined text-[#777587] text-[22px]">
                    hourglass_empty
                  </span>
                  <span className="font-label-sm text-[11px] text-[#464555] mt-1">
                    Slayd 27 - Mustaqil ish
                  </span>
                  <span className="font-code-md text-[9px] text-[#777587]">Navbatda</span>
                </div>
              </div>

              {/* Bottom Micro Notification */}
              <div className="p-3 bg-[#eaedff] rounded-xl flex items-center justify-between text-[#464555] border border-[#dae2fd]">
                <span className="font-body-sm text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">sync</span>
                  Slaydlar sinxron yuklanmoqda
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
                Rostdan ham ushbu taqdimot generatsiyasini bekor qilmoqchimisiz? Yechilgan barcha 41 kredit balansingizga to'liq qaytariladi.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-label-lg text-sm font-semibold transition-colors"
              >
                Yo'q, davom etsin
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  onCancel(41);
                }}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white hover:bg-red-700 font-label-lg text-sm font-bold shadow-xs transition-colors"
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
