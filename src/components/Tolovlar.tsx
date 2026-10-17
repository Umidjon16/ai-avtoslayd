import React, { useState } from 'react';
import { UserProfile, PaymentRequest } from '../types';
import { TELEGRAM_ADMIN_URL } from '../utils/storage';

interface TolovlarProps {
  user: UserProfile;
  paymentRequests: PaymentRequest[];
  onSubmitPaymentRequest: (pkgName: string, credits: number, price: string) => void;
}

export const Tolovlar: React.FC<TolovlarProps> = ({
  user,
  paymentRequests,
  onSubmitPaymentRequest,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    credits: number;
    price: string;
  } | null>(null);
  const [requestSubmittedToast, setRequestSubmittedToast] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleBuyCreditsDirect = (pkgName: string = "Standart to'plam", credits: number = 100, price: string = "95,000 so'm") => {
    // Copy ID automatically for user convenience
    navigator.clipboard.writeText(`Assalomu alaykum! AI Avto-Slayd uchun kredit sotib olmoqchiman. Mening ID raqamim: ${user.id}, Tanlangan tarif: ${pkgName} (${credits} kredit).`);
    // Create payment request in system
    onSubmitPaymentRequest(pkgName, credits, price);
    // Directly open Telegram @Cyber_Umidjon
    window.open(TELEGRAM_ADMIN_URL, '_blank');
    setRequestSubmittedToast(true);
    setTimeout(() => setRequestSubmittedToast(false), 4500);
  };

  const handleSelectPackage = (name: string, credits: number, price: string) => {
    handleBuyCreditsDirect(name, credits, price);
  };

  // Filter user's payment requests
  const userRequests = paymentRequests.filter(
    (req) => req.teacherId === user.id
  );

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Banner with ID card */}
        <div className="relative overflow-hidden bg-[#f2f3ff] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#e2e7ff]">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/4 -bottom-24 w-64 h-64 rounded-full bg-[#6cf8bb]/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white w-fit shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                <span className="font-label-sm text-xs text-primary tracking-wide uppercase font-bold">
                  Xavfsiz hisob to'ldirish
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg md:text-3xl text-[#131b2e] font-extrabold">
                Kredit sotib olish va hisobni to'ldirish
              </h1>
              <p className="font-body-lg text-sm text-[#464555] leading-relaxed">
                Bank karta ma'lumotlarini saytga kiritish talab etilmaydi. Barcha to'lovlar xavfsiz va shaffof tarzda rasmiy administrator orqali Click yoki Payme orqali tasdiqlanadi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#eaedff] min-w-[320px]">
              <div className="w-12 h-12 rounded-xl bg-[#e2dfff] text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">badge</span>
              </div>
              <div className="flex flex-col flex-1 text-center sm:text-left">
                <span className="font-label-md text-xs text-[#464555]">
                  Sizning to'lov ID raqamingiz
                </span>
                <span className="font-code-md text-2xl text-primary font-black tracking-wider">
                  {user.id}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyId}
                  className="w-full sm:w-auto h-11 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-label-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer border border-[#eaedff]"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  <span>{copiedId ? "Nusxalandi! ✓" : "ID nusxalash"}</span>
                </button>
                <button
                  onClick={() => handleBuyCreditsDirect("Tezkor to'plam", 100, "95,000 so'm")}
                  className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white font-label-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Sotib olish</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#006c49] bg-white/90 px-4 py-3 rounded-xl border border-[#eaedff]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] shrink-0 text-[#006c49]">info</span>
              <span className="font-body-sm text-xs sm:text-sm text-[#131b2e] font-medium">
                Muhim eslatma: To'lov chekini yuborayotganda ushbu 5 xonali{' '}
                <strong className="font-code-md text-primary font-bold">{user.id}</strong> ID raqamingizni Telegram xabarida albatta yozib qoldiring!
              </span>
            </div>
            <a
              href={TELEGRAM_ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs shrink-0 hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>t.me/Cyber_Umidjon</span>
            </a>
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-headline-md text-[#131b2e] font-bold">
                Mavjud tariflar va to'plamlar
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-[#464555]">
                O'zingizga ma'qul bo'lgan kredit to'plamini tanlang
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#005236] border border-[#6cf8bb]/50">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span className="font-label-sm text-xs font-bold">
                1 ta to'liq slayd = o'rtacha 20-25 kredit
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-[#eaedff] hover:shadow-md transition-shadow relative">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-base text-[#131b2e] font-bold">
                    Boshlang'ich to'plam
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#464555]">
                    <span className="material-symbols-outlined text-[18px]">school</span>
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl text-3xl text-[#131b2e] font-black">
                      35,000
                    </span>
                    <span className="font-label-lg text-sm text-[#464555]">so'm</span>
                  </div>
                  <p className="font-body-sm text-xs text-[#464555] mt-1">
                    Sinab ko'rish va tezkor dars rejalashtirish uchun
                  </p>
                </div>
                <div className="h-px bg-[#eaedff] my-1"></div>
                <ul className="flex flex-col gap-2.5 font-body-md text-xs text-[#131b2e]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span><strong>30 ta kredit</strong> darhol taqdim etiladi</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#464555]">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>1-2 ta to'liq dars taqdimoti uchun</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#464555]">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>PowerPoint (.pptx) formatida yuklab olish</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleBuyCreditsDirect("Boshlang'ich to'plam", 30, "35,000 so'm")}
                className="mt-6 h-11 w-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Sotib olish</span>
              </button>
            </div>

            {/* Tier 2 (Popular) */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-xl border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white font-label-sm text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
                Ommabop tarif
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-base text-primary font-bold">
                    O'qituvchi standarti
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#e2dfff] flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">star</span>
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl text-3xl text-primary font-black">
                      95,000
                    </span>
                    <span className="font-label-lg text-sm text-[#464555]">so'm</span>
                  </div>
                  <p className="font-body-sm text-xs text-[#006c49] font-bold mt-1">
                    20% tejamkor to'plam
                  </p>
                </div>
                <div className="h-px bg-[#eaedff] my-1"></div>
                <ul className="flex flex-col gap-2.5 font-body-md text-xs text-[#131b2e]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span><strong>100 ta kredit</strong> darhol taqdim etiladi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>4-5 ta to'liq professional taqdimot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>Interaktiv viktorina o'yinlarini yaratish</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#464555]">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>Navbatsiz AI avlod tezligi</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleBuyCreditsDirect("O'qituvchi standarti", 100, "95,000 so'm")}
                className="mt-6 h-11 w-full bg-primary hover:bg-primary-container text-white rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Sotib olish</span>
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-[#eaedff] hover:shadow-md transition-shadow relative">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-base text-[#131b2e] font-bold">
                    Maktab / Faol o'qituvchi
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#464555]">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl text-3xl text-[#131b2e] font-black">
                      210,000
                    </span>
                    <span className="font-label-lg text-sm text-[#464555]">so'm</span>
                  </div>
                  <p className="font-body-sm text-xs text-[#464555] mt-1">
                    Butun chorak yoki fan oyliklari uchun
                  </p>
                </div>
                <div className="h-px bg-[#eaedff] my-1"></div>
                <ul className="flex flex-col gap-2.5 font-body-md text-xs text-[#131b2e]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span><strong>250 ta kredit</strong> darhol taqdim etiladi</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#464555]">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>12-15 ta dars taqdimotlari to'plami</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#464555]">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>Barcha dars ishlanmalari va testlar</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#464555]">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">check_circle</span>
                    <span>Shaxsiy metodik konsultatsiya</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleBuyCreditsDirect("Maktab / Faol o'qituvchi", 250, "210,000 so'm")}
                className="mt-6 h-11 w-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Sotib olish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step by step guide */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-md text-headline-md text-[#131b2e] font-bold">
              Qadamma-qadam to'lov yo'riqnomasi
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-[#464555]">
              Telegram orqali hisobni 5 daqiqada to'ldirish tartibi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-primary text-white font-headline-sm text-sm flex items-center justify-center font-bold">
                    1
                  </span>
                  <span className="material-symbols-outlined text-[#464555] text-[24px]">
                    contact_support
                  </span>
                </div>
                <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                  Telegram adminiga murojaat qiling
                </h3>
                <p className="font-body-sm text-xs text-[#464555]">
                  Bizning rasmiy yordamchi administratorimiz har kuni 09:00 dan 21:00 gacha faol javob beradi.
                </p>
              </div>
              <a
                className="h-10 w-full bg-[#e2dfff] hover:bg-[#c3c0ff] text-primary font-label-md text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                href={TELEGRAM_ADMIN_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[16px]">near_me</span>
                <span>@Cyber_Umidjon ga yozish</span>
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-primary text-white font-headline-sm text-sm flex items-center justify-center font-bold">
                    2
                  </span>
                  <span className="material-symbols-outlined text-[#464555] text-[24px]">tag</span>
                </div>
                <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                  ID va tarif nomini yuboring
                </h3>
                <p className="font-body-sm text-xs text-[#464555]">
                  Adminga ID raqamingiz va kerakli kredit miqdorini yozing.
                </p>
              </div>
              <div className="p-3 bg-[#f2f3ff] rounded-xl font-code-md text-xs text-[#131b2e] border-l-3 border-primary">
                "Assalomu alaykum, ID: {user.id}, 100 ta kredit olmoqchiman"
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-primary text-white font-headline-sm text-sm flex items-center justify-center font-bold">
                    3
                  </span>
                  <span className="material-symbols-outlined text-[#464555] text-[24px]">
                    receipt_long
                  </span>
                </div>
                <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                  To'lovni amalga oshiring
                </h3>
                <p className="font-body-sm text-xs text-[#464555]">
                  Administrator taqdim etgan rasmiy karta raqamiga Click yoki Payme orqali to'lov qiling va kvitansiyani yuboring.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[#464555] text-xs font-semibold">
                <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified</span>
                <span>Click & Payme qabul qilinadi</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#006c49] text-white font-headline-sm text-sm flex items-center justify-center font-bold">
                    4
                  </span>
                  <span className="material-symbols-outlined text-[#006c49] text-[24px]">
                    account_balance_wallet
                  </span>
                </div>
                <h3 className="font-title-md text-sm text-[#131b2e] font-bold">
                  Kreditlar darhol qo'shiladi
                </h3>
                <p className="font-body-sm text-xs text-[#464555]">
                  Chek tekshirilgach (odatda 5-15 daqiqa ichida), balansingizga kreditlar avtomatik tarzda tushadi.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[#006c49] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
                <span>O'rtacha faollashuv: 8 daqiqa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Requests & Safety banner */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  table_chart
                </span>
                <h2 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                  To'lov so'rovlari holati
                </h2>
              </div>
              <span className="font-label-sm text-xs text-[#464555]">
                Oxirgi {userRequests.length} ta tranzaksiya
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f3ff] text-[#464555] font-label-sm text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">So'rov ID</th>
                      <th className="py-3 px-4 font-semibold">Kredit</th>
                      <th className="py-3 px-4 font-semibold">Sana</th>
                      <th className="py-3 px-4 font-semibold">Holati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f3ff] font-body-md text-xs">
                    {userRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                        <td className="py-3.5 px-4 font-code-md text-[#131b2e] font-bold">
                          {req.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-primary">
                          {req.requestedCredits} ta
                        </td>
                        <td className="py-3.5 px-4 text-[#464555]">{req.date}</td>
                        <td className="py-3.5 px-4">
                          {req.status === 'Kutilmoqda' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] text-primary font-bold">
                              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                              <span>Kutilmoqda (Admin tekshiruvida)</span>
                            </span>
                          ) : req.status === 'Tasdiqlandi' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-bold">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span>Tasdiqlandi (+{req.requestedCredits} kredit)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                              <span>Rad etildi</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-4">
            <div className="bg-[#6cf8bb]/15 border border-[#6cf8bb]/40 rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-3 text-[#006c49]">
                <div className="w-10 h-10 rounded-full bg-[#006c49]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">shield</span>
                </div>
                <h3 className="font-headline-sm text-base text-[#131b2e] font-bold leading-tight">
                  100% Xavfsiz to'lov
                </h3>
              </div>
              <p className="font-body-md text-xs sm:text-sm text-[#464555] leading-relaxed">
                Platformamizda barcha to'lovlar rasmiy administrator kafolati ostida amalga oshiriladi. Agarda texnik sabablarga ko'ra kreditlar hisobingizga qo'shilmasa, to'liq summa zudlik bilan qaytariladi.
              </p>
              <div className="flex items-center gap-1.5 text-[#005236] font-label-sm text-xs pt-1 font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>O'qituvchilar huquqlari to'liq himoyalangan</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#464555] shrink-0">
                <span className="material-symbols-outlined text-[20px]">headset_mic</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-sm text-[#131b2e] font-bold">
                  Savolingiz bormi?
                </span>
                <span className="font-body-sm text-xs text-[#464555]">
                  Admin bilan bog'lanish:{' '}
                  <a
                    className="text-primary font-bold hover:underline"
                    href={TELEGRAM_ADMIN_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @Cyber_Umidjon
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Checkout / Simulation Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#eaedff] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-lg text-[#131b2e] font-bold">
                To'lov so'rovini tasdiqlash
              </h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#f2f3ff] rounded-xl flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#464555]">Tanlangan tarif:</span>
                <span className="font-bold text-[#131b2e]">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Kreditlar miqdori:</span>
                <span className="font-bold text-primary font-code-md">
                  +{selectedPackage.credits} kredit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Summa:</span>
                <span className="font-bold text-[#006c49] text-sm">
                  {selectedPackage.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">O'qituvchi ID:</span>
                <span className="font-bold text-[#131b2e] font-code-md">#{user.id}</span>
              </div>
            </div>

            <p className="font-body-sm text-xs text-[#464555]">
              Tugmani bosishingiz bilan Telegram (@Cyber_Umidjon) ochiladi va buyurtmangiz navbatga qo'shiladi.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPackage(null)}
                className="px-4 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  handleBuyCreditsDirect(selectedPackage.name, selectedPackage.credits, selectedPackage.price);
                  setSelectedPackage(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Telegram @Cyber_Umidjon ga o'tish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {requestSubmittedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-[#6cf8bb]/40">
          <span className="material-symbols-outlined text-[#6cf8bb] text-[22px]">
            send
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              Telegram (@Cyber_Umidjon) sahifasiga yo'naltirilmoqda!
            </span>
            <span className="text-[11px] text-[#cfcfe2]">
              Sizning #{user.id} ID raqamingiz xotiraga nusxalandi.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
