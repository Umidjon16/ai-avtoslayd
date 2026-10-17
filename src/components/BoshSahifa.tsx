import React, { useState } from 'react';
import { Presentation, PageTab, UserProfile } from '../types';
import { TEMPLATES } from '../data/mockData';

interface BoshSahifaProps {
  user: UserProfile;
  presentations: Presentation[];
  onSelectPresentation: (p: Presentation) => void;
  onSelectTemplate: (topic: string, subject: string, grade: string) => void;
  onNavigate: (tab: PageTab) => void;
  onDownloadPptx: (presentation: Presentation) => void;
  onOpenEditProfile?: () => void;
}

export const BoshSahifa: React.FC<BoshSahifaProps> = ({
  user,
  presentations,
  onSelectPresentation,
  onSelectTemplate,
  onNavigate,
  onDownloadPptx,
  onOpenEditProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featureModalOpen, setFeatureModalOpen] = useState(false);

  const filteredPresentations = presentations.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Top Welcome Card */}
        <div className="relative w-full rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#eaedff] overflow-hidden">
          <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-[#c3c0ff]/30 blur-3xl pointer-events-none"></div>
          <div className="absolute right-48 -bottom-20 w-80 h-80 rounded-full bg-[#6cf8bb]/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f3ff] text-primary font-code-md text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                  Tizim faol • Yangilanish v2.4
                </div>
                {onOpenEditProfile && (
                  <button
                    onClick={onOpenEditProfile}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-[#f2f3ff] text-primary text-xs font-bold border border-[#eaedff] shadow-xs cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    <span>Profilni tahrirlash</span>
                  </button>
                )}
              </div>
              <h1 className="font-headline-xl text-headline-xl text-[#131b2e] tracking-tight flex items-center gap-2 flex-wrap">
                <span>Xush kelibsiz, {user.name}!</span>
                <span className="font-code-md text-base text-[#464555] font-normal">
                  (ID: #{user.id})
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-[#464555] leading-relaxed">
                Bugungi darsingiz uchun zamonaviy PowerPoint slaydlar va interaktiv viktorinalarni 2 daqiqada tayyorlang. Milliy o'quv dasturi standartlariga to'liq mos.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => onNavigate('yangi-taqdimot')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 h-11 bg-primary text-white font-label-lg text-label-lg rounded-xl shadow-md hover:bg-primary-container transition-all active:scale-95 text-center cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Yangi taqdimot yaratish</span>
              </button>
              <button
                onClick={() => {
                  window.open('https://t.me/Cyber_Umidjon', '_blank');
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-11 bg-[#006c49] text-white font-label-lg text-label-lg rounded-xl shadow-md hover:bg-[#005236] transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Sotib olish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notification Highlight Banner */}
        <div className="w-full bg-[#f2f3ff] rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#dae2fd] text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">link</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-sm text-xs px-2.5 py-0.5 rounded-full bg-primary text-white font-bold">
                  Yangi imkoniyat
                </span>
                <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                  Avtomatik giperhavolali test slaydlar
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-[#464555] mt-0.5">
                Endi PowerPoint slaydlaridagi har bir javob tugmasi avtomatik giperhavola bilan "To'g'ri javob!" yoki "Qayta urinib ko'ring" slaydiga yo'naltiradi!
              </p>
            </div>
          </div>
          <button
            onClick={() => setFeatureModalOpen(true)}
            className="shrink-0 self-end md:self-center px-4 py-2 rounded-xl bg-white text-[#131b2e] font-label-md text-label-md hover:bg-[#eaedff] transition-colors border border-[#c7c4d8] shadow-xs cursor-pointer"
          >
            Tanishib chiqish
          </button>
        </div>

        {/* 4 KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-sm text-[#464555]">Jami taqdimotlar</span>
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">slideshow</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-xl text-3xl text-[#131b2e] font-extrabold">24</span>
                <span className="font-label-md text-sm text-[#464555]">ta to'plam</span>
              </div>
              <div className="flex items-center gap-1 font-label-sm text-xs text-[#006c49] font-semibold">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+3 ta yangi bu hafta</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-sm text-[#464555]">Faol slaydlar</span>
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">layers</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-xl text-3xl text-[#131b2e] font-extrabold">680</span>
                <span className="font-label-md text-sm text-[#464555]">ta slayd</span>
              </div>
              <div className="flex items-center gap-1 font-label-sm text-xs text-[#464555]">
                <span className="material-symbols-outlined text-[16px] text-primary">extension</span>
                <span>Interaktiv o'yinlar bilan boyitilgan</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-sm text-[#464555]">Mavjud kreditlar</span>
              <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/40 text-[#006c49] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">toll</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-xl text-3xl text-[#006c49] font-extrabold">{user.credits}</span>
                <span className="font-label-md text-sm text-[#464555]">ta kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/50 text-[#005236] font-label-sm text-xs font-bold">
                  Yetarli balans
                </span>
                <span className="font-code-md text-xs text-[#464555]">ID: {user.id}</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-sm text-[#464555]">O'tkazilgan viktorinalar</span>
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">sports_esports</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-xl text-3xl text-[#131b2e] font-extrabold">18</span>
                <span className="font-label-md text-sm text-[#464555]">ta darsda</span>
              </div>
              <div className="flex items-center gap-1 font-label-sm text-xs text-[#006c49] font-semibold">
                <span className="material-symbols-outlined text-[16px]">groups</span>
                <span>O'quvchilar faolligi: 94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Templates Row */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">bookmark</span>
              <h2 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                Tezkor boshlash andozalari
              </h2>
            </div>
            <span className="font-label-md text-xs text-[#464555]">
              1 ta bosishda generatsiya
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl.title, tpl.subject, '7-sinf')}
                className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] hover:shadow-md hover:border-primary/40 transition-all group cursor-pointer flex flex-col gap-3"
              >
                <div className="w-full h-32 rounded-xl overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={tpl.image}
                    alt={tpl.title}
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-xs font-label-sm text-xs text-[#131b2e] font-bold shadow-xs">
                    {tpl.subject}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-[#131b2e] group-hover:text-primary transition-colors font-bold">
                    {tpl.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-[#464555] line-clamp-1 mt-0.5">
                    {tpl.description}
                  </span>
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between text-primary font-label-sm text-xs font-bold border-t border-[#f2f3ff]">
                  <span>Andozani tanlash</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Presentations Table Section */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#eaedff] p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md text-[#131b2e] font-bold">
                Oxirgi yaratilgan taqdimotlar
              </h2>
              <p className="font-body-sm text-body-sm text-[#464555]">
                Siz yaratgan yoki tahrir jarayonidagi slayd to'plamlari
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#464555] text-[18px]">
                  search
                </span>
                <input
                  className="h-10 pl-9 pr-4 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#464555] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all w-52 sm:w-64"
                  placeholder="Mavzular bo'yicha qidirish..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => onNavigate('mening-taqdimotlarim')}
                className="px-4 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] font-label-md text-sm font-semibold transition-colors shrink-0"
              >
                Barchasini ko'rish
              </button>
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f3ff] text-[#464555] font-label-sm text-xs uppercase tracking-wider rounded-xl">
                  <th className="py-3 px-4 rounded-l-xl">Mavzu va Fan</th>
                  <th className="py-3 px-4">Slaydlar</th>
                  <th className="py-3 px-4">Viktorina formati</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Holati</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff]">
                {filteredPresentations.map((item) => {
                  const isReady = item.status === 'Tayyor';
                  const isGenerating = item.status === 'Jarayonda';

                  return (
                    <tr key={item.id} className="hover:bg-[#f2f3ff]/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              item.subject.includes('Biologiya')
                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                : item.subject.includes('Adabiyot')
                                ? 'bg-[#e2dfff] text-[#3525cd]'
                                : item.subject.includes('Fizika')
                                ? 'bg-[#dae2fd] text-[#3525cd]'
                                : 'bg-[#6cf8bb]/30 text-[#006c49]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {item.subject.includes('Biologiya')
                                ? 'co_present'
                                : item.subject.includes('Adabiyot')
                                ? 'history_edu'
                                : item.subject.includes('Fizika')
                                ? 'science'
                                : 'square_foot'}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0 max-w-xs sm:max-w-md">
                            <button
                              onClick={() => onSelectPresentation(item)}
                              className="font-title-md text-title-md text-[#131b2e] truncate hover:text-primary transition-colors text-left font-bold"
                            >
                              {item.title}
                            </button>
                            <span className="font-body-sm text-body-sm text-[#464555]">
                              {item.grade} • {item.subject}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-body-md text-body-md text-[#131b2e] whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-code-md text-[#131b2e] font-bold">
                            {item.slideCount} ta slayd
                          </span>
                          <span className="font-label-sm text-xs text-[#464555]">
                            +{item.aiImagesCount} ta HD rasm
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.quizQuestionsCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] text-primary font-label-md text-xs font-semibold">
                            <span className="material-symbols-outlined text-[16px]">
                              videogame_asset
                            </span>
                            {item.quizQuestionsCount} ta interaktiv savol
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#464555] font-label-md text-xs">
                            Mavjud emas
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-body-sm text-body-sm text-[#464555] whitespace-nowrap">
                        {item.date}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {isReady ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#006c49] font-label-md text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                            Tayyor (.pptx)
                          </span>
                        ) : isGenerating ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae2fd] text-primary font-label-md text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                            Jarayonda...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#464555] font-label-md text-xs">
                            Qoralama
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {isReady ? (
                            <>
                              <button
                                onClick={() => onDownloadPptx(item)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] hover:bg-primary hover:text-white font-label-md text-xs font-semibold transition-colors cursor-pointer"
                                title="PowerPoint formatida yuklab olish"
                              >
                                <span className="material-symbols-outlined text-[16px]">download</span>
                                <span>.pptx</span>
                              </button>
                              <button
                                onClick={() => onSelectPresentation(item)}
                                className="p-1.5 rounded-lg text-[#464555] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors cursor-pointer"
                                title="Ko'rish"
                              >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </button>
                              <button
                                onClick={() => {
                                  onSelectTemplate(item.title, item.subject, item.grade);
                                }}
                                className="p-1.5 rounded-lg text-[#464555] hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors cursor-pointer"
                                title="Qayta yaratish"
                              >
                                <span className="material-symbols-outlined text-[20px]">sync</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onNavigate('generatsiya')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#dae2fd] text-primary hover:bg-primary hover:text-white font-label-md text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] animate-spin">
                                progress_activity
                              </span>
                              <span>Kuzatish</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Workflow Tip & Support */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#eaedff] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f3ff] text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">lightbulb</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-[#131b2e] font-bold">
                Metodik maslahat: Darsda interaktiv viktorinani qanday o'tkazish kerak?
              </span>
              <p className="font-body-sm text-body-sm text-[#464555] mt-0.5">
                PowerPoint faylini yuklab olgach, "F5" tugmasini bosing va o'quvchilarni slayd orqali navbatma-navbat javob berishga taklif qiling. Giperhavolalar avtomat ishlaydi.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFeatureModalOpen(true)}
            className="shrink-0 text-primary font-label-lg text-sm hover:underline flex items-center gap-1 font-bold"
          >
            <span>Qo'llanmani o'qish</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
      </div>

      {/* Feature Guide Modal */}
      {featureModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 border border-[#eaedff] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#e2e7ff] text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">link</span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                  Avtomatik Giperhavola Texnologiyasi
                </h3>
              </div>
              <button
                onClick={() => setFeatureModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="font-body-md text-sm text-[#464555] leading-relaxed">
              AI Avto-Slayd taqdimotlaridagi test savollari standart PowerPoint shaklida shakllanadi va har bir javob varianti uchun maxsus giperhavola (Action Trigger) biriktiriladi.
            </p>

            <div className="p-4 bg-[#f2f3ff] rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-[#006c49] font-bold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                To'g'ri variant bosilganda:
              </div>
              <p className="text-xs text-[#464555] pl-6">
                Darhol "Barakalla, to'g'ri topdingiz! 👏" degan rag'batlantiruvchi slaydga o'tadi va ball beriladi.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#ba1a1a] font-bold mt-2">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Noto'g'ri variant bosilganda:
              </div>
              <p className="text-xs text-[#464555] pl-6">
                "Afsuski, javob noto'g'ri! ❌" slaydiga yo'naltirib, qayta urinish imkonini beradi.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setFeatureModalOpen(false)}
                className="px-5 py-2.5 bg-primary text-white font-label-md text-sm rounded-xl font-bold hover:bg-primary-container transition-colors"
              >
                Tushunarli, rahmat!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
