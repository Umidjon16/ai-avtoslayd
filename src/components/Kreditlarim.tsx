import React, { useState } from 'react';
import { UserProfile, CreditTransaction, PageTab } from '../types';

interface KreditlarimProps {
  user: UserProfile;
  transactions: CreditTransaction[];
  onNavigate: (tab: PageTab) => void;
  onOpenEditProfile?: () => void;
}

export const Kreditlarim: React.FC<KreditlarimProps> = ({
  user,
  transactions,
  onNavigate,
  onOpenEditProfile,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#464555] font-label-sm text-xs tracking-wider uppercase font-semibold">
              <span>Hisob va To'lovlar</span>
              <span>/</span>
              <span className="text-primary font-bold">Kreditlar boshqaruvi</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-[#131b2e] tracking-tight font-extrabold">
              Mening kreditlarim va hisob balansi
            </h1>
            <p className="font-body-lg text-sm text-[#464555] max-w-2xl">
              Taqdimotlar va AI rasmlar generatsiyasi uchun kreditlar hisobi va sarflanish tarixi.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            {onOpenEditProfile && (
              <button
                onClick={onOpenEditProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] font-label-md text-xs font-bold border border-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
                Profilni tahrirlash
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-label-md text-xs font-bold border border-[#6cf8bb]/60">
              <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
              Hisob faol holatda
            </span>
          </div>
        </div>

        {/* Hero Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xs border border-[#eaedff] p-6 sm:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#6cf8bb]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#c3c0ff]/20 blur-3xl pointer-events-none"></div>

          {/* Left Column: Balance Metric */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 z-10">
            {/* Glowing Gauge Ring */}
            <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-full bg-[#f2f3ff] shadow-inner">
              <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90 transform" viewBox="0 0 120 120">
                <circle
                  className="text-[#e2e7ff]"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r={50}
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-[#006c49]"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r={50}
                  stroke="currentColor"
                  strokeDasharray="314"
                  strokeDashoffset={Math.max(0, 314 - (user.credits / 100) * 314)}
                  strokeLinecap="round"
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#006c49] text-[28px]">
                  bolt
                </span>
                <span className="font-code-md text-[10px] text-[#464555] font-bold mt-0.5">
                  QOLDIQ
                </span>
              </div>
            </div>

            {/* Metric Details */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-4xl text-[#131b2e] tracking-tight font-black">
                  {user.credits}
                </span>
                <span className="font-headline-sm text-lg text-[#464555] font-semibold">
                  ta kredit mavjud
                </span>
              </div>

              {/* ID Display & Copy */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-body-md text-sm text-[#464555]">
                  Sizning shaxsiy ID raqamingiz:
                </span>
                <div className="inline-flex items-center gap-1.5 bg-[#f2f3ff] px-3 py-1 rounded-xl border border-[#eaedff]">
                  <span className="font-code-md text-sm font-bold text-[#131b2e]">
                    {user.id}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 hover:bg-[#eaedff] rounded-lg text-primary transition-colors flex items-center cursor-pointer"
                    title="ID nusxalash"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
                {copiedId && (
                  <span className="text-xs font-bold text-[#006c49] animate-fade-in">
                    Nusxalandi! ✓
                  </span>
                )}
              </div>

              <span className="font-label-sm text-xs text-[#777587] mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                To'lov qilganda ushbu ID administratorga ko'rsatiladi
              </span>
            </div>
          </div>

          {/* Right Column: CTAs */}
          <div className="flex flex-col items-start lg:items-end justify-center gap-3 z-10 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#eaedff]">
            <button
              onClick={() => {
                window.open('https://t.me/Cyber_Umidjon', '_blank');
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white font-label-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 text-center w-full sm:w-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Sotib olish</span>
            </button>
            <div className="flex items-center gap-1.5 text-[#464555] font-body-sm text-xs max-w-sm text-left lg:text-right">
              <span className="material-symbols-outlined text-[#006c49] text-[18px] shrink-0">
                redeem
              </span>
              <span>Har bir yangi ro'yxatdan o'tgan o'qituvchiga dastlabki 15 ta bepul sinov krediti beriladi.</span>
            </div>
          </div>
        </div>

        {/* Configurable Pricing & Cost Rules Card */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
              Kredit sarflanish tariflari va me'yorlari
            </h2>
            <span className="font-label-sm text-xs text-[#464555] hidden sm:inline-block">
              Standart tariflar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Item 1 */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#f2f3ff] text-primary">
                  <span className="material-symbols-outlined text-[24px]">article</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#e2dfff] font-code-md text-xs font-bold text-primary">
                  1 kredit
                </span>
              </div>
              <div>
                <span className="font-title-md text-sm text-[#131b2e] font-bold block">
                  1 ta akademik slayd
                </span>
                <p className="font-body-sm text-xs text-[#464555] mt-1 leading-relaxed">
                  Dars rejasi, matn strukturasi va pedagogik metodikaga moslashtirilgan kontent.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#6cf8bb]/30 text-[#006c49]">
                  <span className="material-symbols-outlined text-[24px]">magic_button</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#6cf8bb]/40 font-code-md text-xs font-bold text-[#005236]">
                  2 kredit
                </span>
              </div>
              <div>
                <span className="font-title-md text-sm text-[#131b2e] font-bold block">
                  1 ta AI illyustratsiya
                </span>
                <p className="font-body-sm text-xs text-[#464555] mt-1 leading-relaxed">
                  Mavzuga chuqur moslashgan, yuqori sifatli va mualliflik huquqisiz AI tasvirlari.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#f2f3ff] text-[#3130c0]">
                  <span className="material-symbols-outlined text-[24px]">quiz</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#e1e0ff] font-code-md text-xs font-bold text-[#3130c0]">
                  1 kredit
                </span>
              </div>
              <div>
                <span className="font-title-md text-sm text-[#131b2e] font-bold block">
                  Interaktiv viktorina o'yini
                </span>
                <p className="font-body-sm text-xs text-[#464555] mt-1 leading-relaxed">
                  O'quvchilar bilmini mustahkamlash uchun har bir test yoki qiziqarli savol.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#6cf8bb]/20 text-[#006c49]">
                  <span className="material-symbols-outlined text-[24px]">file_download</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-code-md text-xs font-bold">
                  0 kredit
                </span>
              </div>
              <div>
                <span className="font-title-md text-sm text-[#131b2e] font-bold block">
                  PowerPoint (.pptx) eksport
                </span>
                <p className="font-body-sm text-xs text-[#464555] mt-1 leading-relaxed">
                  Tayyor taqdimotni tahrirlash formati va to'liq faylni cheklovsiz yuklab olish.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Table Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#464555] text-[22px]">history</span>
                Kreditlar harakati tarixi
              </h2>
              <p className="font-body-sm text-xs text-[#464555]">
                Barcha sarf-xarajatlar, to'lovlar va taqdimot generatsiyasi hisoboti.
              </p>
            </div>
            <span className="font-label-sm text-xs text-[#777587]">
              Jami yozuvlar: {transactions.length} ta
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl bg-white shadow-xs border border-[#eaedff]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f3ff] text-[#464555] font-label-sm text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sana va vaqt</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Operatsiya turi / Tafsilot</th>
                  <th className="py-3.5 px-4 text-right">Miqdor</th>
                  <th className="py-3.5 px-4 text-right">Qolgan balans</th>
                  <th className="py-3.5 px-4 text-center">Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff] font-body-md text-xs text-[#131b2e]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f2f3ff]/50 transition-colors">
                    <td className="py-4 px-4 font-code-md text-[#464555] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-label-lg text-sm text-[#131b2e] font-bold">
                          {tx.title}
                        </span>
                        <span className="font-body-sm text-xs text-[#464555]">
                          {tx.detail}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-code-md text-sm font-bold whitespace-nowrap ${
                        tx.amount < 0 ? 'text-[#ba1a1a]' : 'text-[#006c49]'
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} kredit
                    </td>
                    <td className="py-4 px-4 text-right font-code-md text-sm text-[#131b2e] font-semibold whitespace-nowrap">
                      {tx.remainingBalance} kredit
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          tx.status === 'Muvaffaqiyatli'
                            ? 'bg-[#6cf8bb]/40 text-[#005236]'
                            : tx.status === 'Tasdiqlangan'
                            ? 'bg-[#6cf8bb]/40 text-[#005236]'
                            : tx.status === 'Qaytarildi'
                            ? 'bg-[#eaedff] text-primary'
                            : 'bg-[#e2dfff] text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {tx.status === 'Qaytarildi' ? 'replay' : 'check_circle'}
                        </span>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative Notice Banner */}
        <div className="rounded-2xl bg-white p-6 flex items-start gap-4 shadow-xs border border-[#eaedff]">
          <div className="p-2.5 bg-[#6cf8bb]/30 text-[#006c49] rounded-xl shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
              To'lovlar xavfsizligi va qulaylik kafolati
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-[#464555] leading-relaxed">
              Platformamizda to'g'ridan-to'g'ri bank karta ma'lumotlari kiritilmaydi va saqlanmaydi. Barcha to'lovlar rasmiy administrator orqali sizning shaxsiy{' '}
              <strong className="text-[#131b2e] font-code-md">ID: {user.id}</strong> raqamingiz asosida Payme, Click yoki Uzum orqali tezkor va xavfsiz qabul qilinadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
