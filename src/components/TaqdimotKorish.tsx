import React, { useState } from 'react';
import { Presentation, PageTab, SlideItem } from '../types';

interface TaqdimotKorishProps {
  presentation: Presentation;
  onNavigate: (tab: PageTab) => void;
  onDownloadPptx: (p: Presentation) => void;
  onDeletePresentation: (id: string) => void;
}

export const TaqdimotKorish: React.FC<TaqdimotKorishProps> = ({
  presentation,
  onNavigate,
  onDownloadPptx,
  onDeletePresentation,
}) => {
  const [filter, setFilter] = useState<'all' | 'quiz' | 'ai'>('all');
  const [fullscreenModalOpen, setFullscreenModalOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(6); // Default 1-savol oynasi
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const slides: SlideItem[] = presentation.slides && presentation.slides.length > 0 
    ? presentation.slides 
    : [
      {
        id: "s1",
        index: 1,
        title: "01. Muqova va Kirish",
        subtitle: "Bosh sahifa & Metodologiya",
        type: "cover",
        bgImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGckkkv2SnqBDnJ5GfV03alOz5jDjd5QGHrL6AL0OIVJdgqOORYHDXZTBJ8ZvN-7Xfx8RYMRhI2HwHn6Z4TONQfry7o8vCJ1O1Z_9qRdTBVWDSiYslYPw4AonN8t6n14JTY2QR0sANczAWF_YuLLZIhZlV9CATgfiW1HBpdFZPz0sEpfbgT6JuRNM9U1QMEdn7rDN2mdFNNXgtU0bYxjrOKjhLfMKlUR6VdgSazhRhUsDDJDXsQFBp5g",
      },
      {
        id: "s2",
        index: 2,
        title: "02. Mundarija",
        subtitle: "Darsning asosiy bosqichlari",
        type: "outline",
      },
      {
        id: "s3",
        index: 3,
        title: "03. Ichki sayyoralar",
        subtitle: "4K AI infografik tasvir",
        type: "content",
        bgImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzO4obFpQuASwTwXu7x84VQrB1la2o75d1bIG0YPfcEQElwnuHVv7wuV8H4CMfy-gOs352uKhrVowun2vCmZZ38hwS48-4zkZKQl0E6RZ6bv8_k8mHzZ40BdHbKwvf9RPBrwkE8YUC4_tRMuwzsCTI5veXW_gXqJ7c6-yMAeny-RO4NQ07WIZwvwpyjhDga72-83H0JlQ8Uny2BMv91PRJz9q8feOdT7qJr84KoNd7sEgiiAUg2eZytQ",
      },
      {
        id: "s4",
        index: 4,
        title: "04. Yupiter & Saturn",
        subtitle: "Taqqosiy parametrlar",
        type: "content",
        bgImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrfXdO7DQhN3Yeodyyaoxg5Fhu-i2Y4YAc0Gejuzo3-s9W8LQJ8UksF3qqLEHu2WfRXJlTalkRJ1e9fcRKz0_IEYB81SH8qF7qImFtgj_N7Z_jAp5i54-MJwIpXl_Cq3lotuEJHC8VXezcHBdg6D1NT4mevzTYqqKGyAzpDLw4qTtozTflPQKfq81teomj0MP9xu8JAtwzVZxLHpw_IdyJYb3X7VlXGGAsLW0ljDBHpFLnrHQlbmIP1Q",
      },
      {
        id: "s5",
        index: 5,
        title: "05. Viktorina start",
        subtitle: "Interaktiv dars bo'limi",
        type: "quiz-intro",
      },
      {
        id: "s6",
        index: 6,
        title: "06. 1-Savol oynasi",
        subtitle: "To'liq interaktiv tugmalar",
        type: "quiz-question",
      },
      {
        id: "s7",
        index: 7,
        title: "07. Muvaffaqiyatli reaksiya",
        subtitle: "Bog'langan trigger: 06 → B",
        type: "quiz-correct",
      },
      {
        id: "s8",
        index: 8,
        title: "08. Xato javob reaksiyasi",
        subtitle: "Bog'langan trigger: Qaytish ↩️",
        type: "quiz-wrong",
      }
    ];

  const filteredSlides = slides.filter((s) => {
    if (filter === 'quiz') return s.type.startsWith('quiz');
    if (filter === 'ai') return !!s.bgImageUrl;
    return true;
  });

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      onDownloadPptx(presentation);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#share-${presentation.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Top Success Toast Bar */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#6cf8bb]/20 via-[#e2dfff]/20 to-[#6cf8bb]/15 p-4 sm:p-5 rounded-2xl shadow-xs border border-[#6cf8bb]/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                Taqdimotingiz muvaffaqiyatli tayyorlandi!
              </span>
              <span className="font-body-md text-sm text-[#464555]">
                PowerPoint (.pptx) formati yuklab olishga tayyor. Barcha interaktiv triggerlar integratsiya qilindi.
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="px-4 py-1.5 bg-white font-code-md text-xs text-[#006c49] font-bold rounded-full shadow-xs border border-[#6cf8bb]/50">
              Fayl statusi: Tayyor (Ready)
            </span>
          </div>
        </div>

        {/* Presentation Summary & Header Hero Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#eaedff] relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#c3c0ff]/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col gap-4 z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[#464555] font-label-md text-xs">
              <button
                onClick={() => onNavigate('mening-taqdimotlarim')}
                className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Taqdimotlar ro'yxatiga qaytish
              </button>
              <span>•</span>
              <span className="text-primary font-code-md font-bold">
                ID: {presentation.id}
              </span>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-[#131b2e] tracking-tight font-extrabold">
              {presentation.title}
            </h1>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2dfff] text-primary font-label-md text-xs font-bold">
                <span className="material-symbols-outlined text-[15px]">school</span>
                {presentation.grade} {presentation.subject}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] font-label-md text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px]">slideshow</span>
                {presentation.slideCount} ta slayd
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-label-md text-xs font-bold">
                <span className="material-symbols-outlined text-[15px]">palette</span>
                {presentation.aiImagesCount} ta AI rasm
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e1e0ff] text-[#3130c0] font-label-md text-xs font-bold">
                <span className="material-symbols-outlined text-[15px]">sports_esports</span>
                {presentation.quizQuestionsCount} ta interaktiv viktorina
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#464555] font-code-md text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px]">data_usage</span>
                {presentation.fileSize || "18.4 MB (.pptx)"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#464555] font-label-md text-xs">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                {presentation.date}
              </span>
            </div>
          </div>

          {/* Quick Action Secondary Buttons */}
          <div className="flex items-center gap-2 z-10 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                setActiveSlideIndex(6);
                setFullscreenModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-label-lg text-sm font-semibold transition-all shadow-xs border border-[#eaedff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">fullscreen</span>
              <span>To'liq ekranda</span>
            </button>
            <button
              onClick={() => onNavigate('yangi-taqdimot')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-label-lg text-sm font-semibold transition-all shadow-xs border border-[#eaedff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              <span>Qayta yaratish</span>
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#ffdad6]/60 text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a] transition-all shadow-xs cursor-pointer"
              title="Taqdimotni o'chirish"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>

        {/* Download Hero Callout Box */}
        <div className="bg-gradient-to-br from-primary via-[#4f46e5] to-[#3130c0] p-6 sm:p-8 rounded-2xl shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-[#6cf8bb] animate-pulse"></span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-white font-bold">
                Rasmiy Microsoft Office formati
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-white font-bold">
              Tayyor taqdimotni yuklab oling va sinfda namoyish eting
            </h2>
            <p className="font-body-lg text-sm text-[#e2dfff] leading-relaxed">
              Bu haqiqiy <strong>Microsoft PowerPoint (.pptx)</strong> fayli bo'lib, barcha animatsiyalar, giperhavolalar, savol-javob mexanikasi va shriftlar to'liq tahrirlanadigan shaklda ochiladi.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 shrink-0 z-10 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-primary hover:bg-[#faf8ff] active:scale-[0.98] transition-all rounded-xl font-headline-sm text-sm sm:text-base font-extrabold shadow-xl group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-code-md text-[13px] font-bold flex items-center justify-center shadow-xs">
                P
              </div>
              <span>
                {isDownloading
                  ? "Fayl tayyorlanmoqda..."
                  : downloadSuccess
                  ? "Fayl yuklab olindi! ✓"
                  : "PowerPoint (.pptx) yuklab olish"}
              </span>
              <span className="material-symbols-outlined text-[24px] group-hover:translate-y-0.5 transition-transform">
                {downloadSuccess ? "check" : "download"}
              </span>
            </button>
            <span className="font-code-md text-xs text-[#e2dfff]">
              18.4 MB • O'zgartirishlar uchun ochiq
            </span>
          </div>
        </div>

        {/* Pedagogical Advisory Callout */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-[#f2f3ff] p-5 rounded-2xl shadow-xs border border-[#e2e7ff]">
          <div className="w-12 h-12 rounded-2xl bg-[#006c49] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[28px]">tips_and_updates</span>
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="font-title-md text-sm text-[#131b2e] font-bold">
              Metodik tavsiya: Darsda interaktiv doskadan foydalanish
            </span>
            <p className="font-body-md text-xs sm:text-sm text-[#464555]">
              6-8-slaydlardagi viktorina qismi PowerPoint giperhavola (action triggers) tizimiga ulangan. Interaktiv doskada (smartboard) yoki proyektor ekranida o'quvchilarga tugmalarni to'g'ridan-to'g'ri bosish imkoniyatini bering: to'g'ri javob yangi fazaga olib o'tadi, xato javob esa qaytaruvchi maslahat slaydiga yo'naltiradi.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="font-label-sm text-xs text-[#006c49] bg-[#6cf8bb]/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">touch_app</span> Interaktiv Smartboard
            </span>
          </div>
        </div>

        {/* Slide Viewer Filtering */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-col">
            <h2 className="font-headline-lg text-headline-lg text-[#131b2e] font-bold">
              Slaydlar ko'rinishi ({presentation.slideCount} ta)
            </h2>
            <span className="font-body-md text-xs sm:text-sm text-[#464555]">
              Har bir slayd ustiga bosib, matnlarni va giperhavola mantiqini tekshirishingiz mumkin
            </span>
          </div>

          <div className="inline-flex bg-[#eaedff] p-1 rounded-xl shadow-inner self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-[#131b2e] shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Barcha slaydlar ({slides.length})
            </button>
            <button
              onClick={() => setFilter('quiz')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'quiz'
                  ? 'bg-white text-[#131b2e] shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Faqat viktorinalar (5)
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ai'
                  ? 'bg-white text-[#131b2e] shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              AI Rasmli (4)
            </button>
          </div>
        </div>

        {/* Interactive Slide Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredSlides.map((slide) => {
            const isClickable = true;

            return (
              <div
                key={slide.id}
                onClick={() => {
                  setActiveSlideIndex(slide.index);
                  setFullscreenModalOpen(true);
                }}
                className="group flex flex-col bg-white rounded-2xl shadow-xs hover:shadow-md border border-[#eaedff] hover:border-primary/40 transition-all duration-200 overflow-hidden cursor-pointer"
              >
                {/* 16:9 Slide Preview Container */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex flex-col justify-between p-3.5 text-white">
                  {slide.bgImageUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url('${slide.bgImageUrl}')` }}
                    ></div>
                  ) : slide.type === 'outline' ? (
                    <div className="absolute inset-0 bg-[#f2f3ff] p-3 flex flex-col justify-between text-[#131b2e]">
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-xs text-primary font-bold">
                          Dars Rejasi & Mundarija
                        </span>
                        <span className="font-code-md text-[10px] text-[#464555]">45 daqiqa</span>
                      </div>
                      <div className="flex flex-col gap-1 my-auto">
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded text-[10px] font-semibold">
                          <span className="w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">1</span>
                          <span>Quyosh va ichki sayyoralar genezisi</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded text-[10px] font-semibold">
                          <span className="w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">2</span>
                          <span>Gaz gigantlari: Yupiter va Saturn</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded text-[10px] font-semibold">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[9px] font-bold">3</span>
                          <span>Interaktiv mustahkamlash viktorinasi</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-[#006c49] font-bold flex justify-between">
                        <span>Standart: DTS 2024</span>
                        <span>Barcha havolalar faol ✓</span>
                      </div>
                    </div>
                  ) : slide.type === 'quiz-intro' ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#4f46e5] p-3 text-white flex flex-col justify-between items-center text-center">
                      <div className="w-full flex items-center justify-between">
                        <span className="font-label-sm text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">5-Qism</span>
                        <span className="bg-[#6cf8bb] text-[#005236] px-2 py-0.5 rounded-full font-label-sm text-[9px] font-bold">
                          O'YIN REJIMI
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1 my-auto">
                        <span className="material-symbols-outlined text-[28px]">sports_esports</span>
                        <span className="font-headline-sm text-sm text-white font-extrabold">Interaktiv Viktorina!</span>
                        <span className="font-body-sm text-[10px] text-[#e2dfff]">Doskaga chiqing va to'g'ri variantni tanlang</span>
                      </div>
                      <span className="font-code-md text-[9px] text-white/80">Giperhavolalar avtomatik yoqilgan</span>
                    </div>
                  ) : slide.type === 'quiz-question' ? (
                    <div className="absolute inset-0 bg-[#e2e7ff] p-2.5 flex flex-col justify-between text-[#131b2e]">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-[9px] bg-primary text-white px-2 py-0.5 rounded font-bold">Savol #1</span>
                        <span className="font-code-md text-[9px] text-[#464555]">Giperhavola moduli</span>
                      </div>
                      <div className="text-center my-1">
                        <span className="font-headline-sm text-xs text-[#131b2e] font-extrabold leading-tight block">
                          Quyosh tizimidagi eng katta sayyora qaysi?
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="p-1 bg-white rounded text-center text-[9px] font-semibold text-[#131b2e] border border-[#eaedff]">
                          A. Mars
                        </div>
                        <div className="p-1 bg-[#6cf8bb]/40 text-[#005236] rounded text-center text-[9px] font-bold border border-[#006c49]/30">
                          B. Yupiter ⭐
                        </div>
                        <div className="p-1 bg-white rounded text-center text-[9px] font-semibold text-[#131b2e] border border-[#eaedff]">
                          C. Saturn
                        </div>
                        <div className="p-1 bg-white rounded text-center text-[9px] font-semibold text-[#131b2e] border border-[#eaedff]">
                          D. Venera
                        </div>
                      </div>
                      <div className="text-[8px] text-center text-[#464555]">B bosilsa → 07-slayd ochiladi</div>
                    </div>
                  ) : slide.type === 'quiz-correct' ? (
                    <div className="absolute inset-0 bg-[#6cf8bb]/20 p-2.5 flex flex-col justify-between items-center text-center text-[#131b2e]">
                      <div className="w-full flex items-center justify-between">
                        <span className="font-label-sm text-[9px] bg-[#006c49] text-white px-2 py-0.5 rounded font-bold">To'g'ri javob</span>
                        <span className="font-code-md text-[9px] text-[#006c49] font-bold">+10 ball</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 my-auto">
                        <span className="text-[20px]">👏</span>
                        <span className="font-headline-sm text-xs text-[#006c49] font-black">Barakalla, to'g'ri topdingiz!</span>
                        <span className="text-[9px] text-[#464555] max-w-[180px] leading-tight">Yupiter barcha sayyoralar massasidan 2.5 barobar og'irroqdir.</span>
                      </div>
                      <div className="px-2 py-0.5 bg-[#006c49] text-white rounded text-[9px] font-bold">Keyingi savolga o'tish →</div>
                    </div>
                  ) : slide.type === 'quiz-wrong' ? (
                    <div className="absolute inset-0 bg-[#ffdad6]/40 p-2.5 flex flex-col justify-between items-center text-center text-[#131b2e]">
                      <div className="w-full flex items-center justify-between">
                        <span className="font-label-sm text-[9px] bg-[#ba1a1a] text-white px-2 py-0.5 rounded font-bold">Noto'g'ri</span>
                        <span className="font-code-md text-[9px] text-[#ba1a1a] font-bold">0 ball</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 my-auto">
                        <span className="text-[20px]">❌</span>
                        <span className="font-headline-sm text-xs text-[#ba1a1a] font-black">Afsuski, javob noto'g'ri!</span>
                        <span className="text-[9px] text-[#464555] max-w-[180px] leading-tight">Ushbu sayyora katta bo'lishi mumkin, ammo Quyosh tizimi giganti boshqa.</span>
                      </div>
                      <div className="px-2 py-0.5 bg-white text-[#131b2e] rounded text-[9px] font-bold border border-[#c7c4d8]">Qayta urinib ko'rish ↩️</div>
                    </div>
                  ) : null}

                  {/* Overlay tags for image slides */}
                  {slide.bgImageUrl && (
                    <>
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-code-md text-[10px] uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white font-semibold">
                          {slide.type === 'cover' ? 'Muqova slaydi' : 'AI Generatsiya'}
                        </span>
                        <span className="font-label-sm text-[10px] bg-red-600/90 text-white px-1.5 py-0.5 rounded font-bold">
                          PPTX
                        </span>
                      </div>
                      <div className="relative z-10 flex flex-col gap-0.5 my-auto text-center">
                        <span className="font-headline-sm text-xs sm:text-sm text-white font-extrabold leading-tight">
                          {slide.title}
                        </span>
                        <span className="font-body-sm text-[10px] text-slate-200">
                          {slide.subtitle}
                        </span>
                      </div>
                      <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300">
                        <span>O'qituvchi: Nodira Karimova</span>
                        <span className="font-code-md">6-A sinf</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer Info */}
                <div className="p-3.5 flex items-center justify-between bg-white border-t border-[#f2f3ff]">
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-xs sm:text-sm text-[#131b2e] font-bold truncate">
                      {slide.title}
                    </span>
                    <span className="font-body-sm text-[11px] text-[#464555] truncate">
                      {slide.subtitle}
                    </span>
                  </div>
                  <span className="font-code-md text-xs text-[#464555] font-semibold shrink-0 ml-2">
                    0{slide.index} / 28
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bento Technical Specifications & Classroom Sequence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box 1: File Architecture */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[24px]">build</span>
              <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                Fayl arxitekturasi va muvofiqlik
              </span>
            </div>
            <div className="flex flex-col gap-2 font-body-md text-xs sm:text-sm text-[#464555]">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
                <span>Dastur formati:</span>
                <span className="font-code-md text-[#131b2e] font-bold">PPTX (Office 2016-2024 / 365)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
                <span>Shrift to'plami:</span>
                <span className="font-code-md text-[#131b2e] font-bold">Embed (Inter & Plus Jakarta)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
                <span>Giperhavola triggerlari:</span>
                <span className="font-code-md text-[#006c49] font-bold">Action Hyperlinks (Active)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff]">
                <span>Proyektor tomonlar nisbati:</span>
                <span className="font-code-md text-[#131b2e] font-bold">16:9 Widescreen</span>
              </div>
            </div>
          </div>

          {/* Box 2: Teacher Presentation Workflow */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#006c49]">
              <span className="material-symbols-outlined text-[24px]">co_present</span>
              <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                Darsda qo'llash ketma-ketligi
              </span>
            </div>
            <ul className="flex flex-col gap-3 font-body-md text-xs sm:text-sm text-[#464555]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#6cf8bb] text-[#005236] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>Yuklab olingan faylni PowerPoint yoki WPS Office dasturida oching.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#6cf8bb] text-[#005236] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Klaviatura orqali <kbd className="px-1.5 py-0.5 bg-[#eaedff] font-code-md text-xs rounded border border-[#dae2fd]">F5</kbd> tugmasini bosib to'liq ekranli namoyishni yoqing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#6cf8bb] text-[#005236] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>Viktorina slaydlari kelganda o'quvchilarni doskaga taklif qilib variantlarni bosishini so'rang.</span>
              </li>
            </ul>
          </div>

          {/* Box 3: Quick Export Options & QR Mobile Share */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">share</span>
                <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                  O'quvchilar bilan ulashish
                </span>
              </div>
              <p className="font-body-md text-xs sm:text-sm text-[#464555]">
                Ushbu slayd-shouni o'quvchilar telefonida mustaqil takrorlashlari uchun havola orqali yuboring.
              </p>
            </div>

            <div className="flex items-center gap-4 p-3 bg-[#f2f3ff] rounded-xl border border-[#e2e7ff]">
              <svg className="w-14 h-14 shrink-0 text-[#131b2e] bg-white p-1 rounded-lg border border-[#eaedff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-4h2v4h-2v-4zm-4 6h4v2h-4v-2zm6-2h2v4h-2v-4z"></path>
              </svg>
              <div className="flex flex-col">
                <span className="font-label-md text-xs text-[#131b2e] font-bold">
                  QR Kod orqali kirish
                </span>
                <span className="font-body-sm text-xs text-[#464555]">
                  O'quvchilar kodi: #ASTR-602
                </span>
                <button
                  onClick={handleCopyShareLink}
                  className="text-left font-label-sm text-xs text-primary hover:underline mt-0.5 font-bold cursor-pointer"
                >
                  {copiedLink ? "Havola nusxalandi! ✓" : "Havolani nusxalash"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#464555] font-label-sm text-xs pt-1 border-t border-[#f2f3ff]">
              <span>Kreditlar qoldig'i: <strong className="text-[#006c49] font-code-md">45 ta</strong></span>
              <span className="text-[#006c49] font-semibold">Ushbu yaratuv uchun 3 ta sarflandi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Preview Fullscreen Inspector Modal (Interactive PowerPoint Simulation!) */}
      {fullscreenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#eaedff]">
            {/* Modal Header */}
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                  To'liq ekranda ko'rish: {presentation.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-white font-code-md text-xs font-bold">
                  Slayd: {String(activeSlideIndex).padStart(2, '0')} / {slides.length}
                </span>
              </div>
              <button
                onClick={() => setFullscreenModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#eaedff] text-[#464555] hover:text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body: Active Slide Canvas */}
            <div className="p-6 sm:p-10 bg-[#faf8ff] flex flex-col items-center justify-center">
              {(() => {
                const currentSlide = slides.find((s) => s.index === activeSlideIndex) || slides[0];
                return (
                  <div className="aspect-video w-full max-w-3xl bg-slate-900 rounded-2xl shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white relative overflow-hidden">
                    {/* Background AI Image if present */}
                    {currentSlide.bgImageUrl && (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[1px] scale-105"
                        style={{ backgroundImage: `url('${currentSlide.bgImageUrl}')` }}
                      ></div>
                    )}

                    {/* Quiz Question Slide */}
                    {currentSlide.type === 'quiz-question' ? (
                      <>
                        <div className="flex justify-between items-center z-10">
                          <span className="font-label-md bg-primary px-3 py-1 rounded-lg text-white font-bold text-xs">
                            Interaktiv Savol #{currentSlide.index}
                          </span>
                          <span className="font-code-md text-xs text-slate-300">
                            DTS Standart • Interaktiv Trigger
                          </span>
                        </div>
                        <div className="text-center z-10 my-auto py-2">
                          <h3 className="font-headline-lg text-lg sm:text-2xl text-white font-black leading-tight">
                            {currentSlide.title}
                          </h3>
                          <p className="font-body-md text-xs sm:text-sm text-slate-300 mt-2">
                            {currentSlide.subtitle || "To'g'ri variantni tanlang va bosing:"}
                          </p>
                        </div>
                        {/* Interactive Buttons */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 z-10">
                          {(currentSlide.options && currentSlide.options.length > 0
                            ? currentSlide.options
                            : [
                                { label: 'A', text: "1-variant (Variant A)", isCorrect: false },
                                { label: 'B', text: "To'g'ri ilmiy javob ⭐", isCorrect: true },
                                { label: 'C', text: "3-variant (Variant C)", isCorrect: false },
                                { label: 'D', text: "4-variant (Variant D)", isCorrect: false },
                              ]
                          ).map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  const correctSlide = slides.find((s) => s.type === 'quiz-correct');
                                  setActiveSlideIndex(correctSlide ? correctSlide.index : Math.min(slides.length, currentSlide.index + 1));
                                } else {
                                  const wrongSlide = slides.find((s) => s.type === 'quiz-wrong');
                                  setActiveSlideIndex(wrongSlide ? wrongSlide.index : currentSlide.index);
                                }
                              }}
                              className={`p-3 sm:p-4 rounded-xl transition-all text-left flex items-center gap-3 cursor-pointer group ${
                                opt.isCorrect
                                  ? 'bg-[#006c49]/80 hover:bg-[#005236] text-white ring-2 ring-[#6cf8bb]'
                                  : 'bg-white/15 hover:bg-[#ba1a1a]/80 text-white'
                              }`}
                            >
                              <span className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center font-bold text-xs group-hover:bg-white group-hover:text-black">
                                {opt.label}
                              </span>
                              <span className="font-label-lg text-xs sm:text-sm font-semibold">
                                {opt.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : currentSlide.type === 'quiz-correct' ? (
                      <div className="flex flex-col items-center justify-between h-full text-center z-10 py-4">
                        <div className="w-full flex justify-between items-center">
                          <span className="font-label-md bg-[#006c49] px-3 py-1 rounded-lg text-white font-bold text-xs">
                            To'g'ri javob!
                          </span>
                          <span className="font-code-md text-xs text-[#6cf8bb] font-bold">+10 ball</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 my-auto">
                          <span className="text-5xl animate-bounce">👏</span>
                          <h3 className="font-headline-lg text-xl sm:text-2xl text-[#6cf8bb] font-black">
                            {currentSlide.title || "Barakalla, to'g'ri topdingiz!"}
                          </h3>
                          <p className="font-body-md text-xs sm:text-sm text-slate-200 max-w-md">
                            {currentSlide.subtitle || "Ajoyib natija! Siz dars mavzusini mukammal o'zlashtirdingiz."}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setActiveSlideIndex((prev) => Math.max(1, prev - 1))}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Savolga qaytish
                          </button>
                          <button
                            onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length, prev + 1))}
                            className="px-5 py-2.5 bg-[#006c49] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-[#005236] cursor-pointer"
                          >
                            Keyingi slaydga o'tish →
                          </button>
                        </div>
                      </div>
                    ) : currentSlide.type === 'quiz-wrong' ? (
                      <div className="flex flex-col items-center justify-between h-full text-center z-10 py-4">
                        <div className="w-full flex justify-between items-center">
                          <span className="font-label-md bg-[#ba1a1a] px-3 py-1 rounded-lg text-white font-bold text-xs">
                            Noto'g'ri javob
                          </span>
                          <span className="font-code-md text-xs text-[#ffdad6] font-bold">0 ball</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 my-auto">
                          <span className="text-5xl animate-pulse">❌</span>
                          <h3 className="font-headline-lg text-xl sm:text-2xl text-[#ffdad6] font-black">
                            {currentSlide.title || "Afsuski, javob noto'g'ri!"}
                          </h3>
                          <p className="font-body-md text-xs sm:text-sm text-slate-300 max-w-md">
                            {currentSlide.subtitle || "Yana bir bor o'ylab ko'ring va to'g'ri javobni tanlashga harakat qiling!"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const qSlide = slides.find((s) => s.type === 'quiz-question');
                            setActiveSlideIndex(qSlide ? qSlide.index : Math.max(1, currentSlide.index - 2));
                          }}
                          className="px-6 py-2.5 bg-white text-[#131b2e] rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">replay</span>
                          <span>Qayta urinib ko'rish</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between h-full z-10">
                        <div className="flex justify-between items-center">
                          <span className="bg-primary px-3 py-1 rounded-lg text-white font-bold text-xs">
                            Slayd #{currentSlide.index} • {currentSlide.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-[#6cf8bb]">verified</span>
                            DTS Metodikasi
                          </span>
                        </div>
                        <div className="my-auto text-center py-4 bg-black/40 backdrop-blur-xs p-6 rounded-2xl border border-white/10">
                          <h3 className="text-xl sm:text-2xl font-black text-white">
                            {currentSlide.title}
                          </h3>
                          <p className="text-sm text-slate-200 mt-2 max-w-xl mx-auto leading-relaxed">
                            {currentSlide.subtitle}
                          </p>
                          {currentSlide.badges && currentSlide.badges.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                              {currentSlide.badges.map((b, bIdx) => (
                                <span key={bIdx} className="px-2.5 py-0.5 rounded-full bg-white/20 text-[#e2dfff] text-xs font-semibold">
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>16:9 Widescreen HD</span>
                          <span>AI Avto-Slayd Engine (Gemini & Flux)</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer Navigation */}
            <div className="px-6 py-4 bg-[#f2f3ff] border-t border-[#eaedff] flex items-center justify-between">
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#eaedff] text-[#131b2e] font-label-md text-xs sm:text-sm font-semibold border border-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Oldingi slayd
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary text-white rounded-xl font-label-md text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Taqdimotni yuklab olish (.pptx)
                </button>
              </div>

              <button
                onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#eaedff] text-[#131b2e] font-label-md text-xs sm:text-sm font-semibold border border-[#eaedff] cursor-pointer"
              >
                Keyingi slayd
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#eaedff] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                Taqdimotni o'chirib tashlamoqchimisiz?
              </h3>
              <p className="font-body-md text-sm text-[#464555] leading-relaxed">
                Ushbu amalni ortga qaytarib bo'lmaydi. Barcha 28 ta slayd va yuklangan resurslar platforma xotirasidan butunlay tozalanadi.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-label-lg text-sm font-semibold transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  onDeletePresentation(presentation.id);
                  setDeleteModalOpen(false);
                  onNavigate('mening-taqdimotlarim');
                }}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white hover:bg-red-700 font-label-lg text-sm font-bold shadow-xs transition-colors"
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
