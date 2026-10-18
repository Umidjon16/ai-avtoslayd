import React, { useState } from 'react';
import { UserProfile, PaymentRequest, AuditLog, SystemPricing } from '../types';
import { ADMIN_EMAIL, TELEGRAM_ADMIN_URL } from '../utils/storage';

interface AdminPanelProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  paymentRequests: PaymentRequest[];
  auditLogs: AuditLog[];
  pricing: SystemPricing;
  isAdminAuthenticated: boolean;
  onAdminLogin: (email: string, pass: string) => boolean;
  onAdminLogout: () => void;
  onApprovePayment: (reqId: string, teacherId: string, credits: number) => void;
  onRejectPayment: (reqId: string) => void;
  onManualCreditAdjust: (teacherId: string, amount: number, reason: string) => void;
  onUpdatePricing: (newPricing: SystemPricing) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  allUsers,
  paymentRequests,
  auditLogs,
  pricing,
  isAdminAuthenticated,
  onAdminLogin,
  onAdminLogout,
  onApprovePayment,
  onRejectPayment,
  onManualCreditAdjust,
  onUpdatePricing,
}) => {
  // Gate authentication state
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active receipt modal
  const [activeReceipt, setActiveReceipt] = useState<PaymentRequest | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastError, setToastError] = useState(false);

  // User search & Credit adjustment
  const [searchUserQuery, setSearchUserQuery] = useState('48291');
  const [adjAmount, setAdjAmount] = useState('+20');
  const [adjReason, setAdjReason] = useState('To\'lov tekshiruvi tasdig\'i');
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfile | null>(null);

  // Pricing inputs
  const [slidePrice, setSlidePrice] = useState(pricing.slidePrice);
  const [aiImagePrice, setAiImagePrice] = useState(pricing.aiImagePrice);
  const [quizPrice, setQuizPrice] = useState(pricing.quizPrice);
  const [welcomeBonus, setWelcomeBonus] = useState(pricing.welcomeBonus);

  // Cloudflare & AI settings
  const [cfAccountId, setCfAccountId] = useState('');
  const [cfApiToken, setCfApiToken] = useState('');
  const [preferredEngine, setPreferredEngine] = useState<'pollinations' | 'cloudflare'>('pollinations');
  const [isCfSaving, setIsCfSaving] = useState(false);
  const [cfConfigured, setCfConfigured] = useState(false);

  React.useEffect(() => {
    fetch('/api/settings/ai')
      .then((res) => res.json())
      .then((data) => {
        if (data.cloudflare) {
          setCfConfigured(data.cloudflare.isConfigured);
        }
        if (data.preferredImageEngine) {
          setPreferredEngine(data.preferredImageEngine);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAiSettings = async () => {
    setIsCfSaving(true);
    try {
      const res = await fetch('/api/settings/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: cfAccountId,
          apiToken: cfApiToken,
          preferredEngine,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCfConfigured(data.cloudflareConfigured);
        showToast("Cloudflare va AI sozlamalari muvaffaqiyatli saqlandi!");
      }
    } catch (err) {
      showToast("Sozlamalarni saqlashda xatolik yuz berdi", true);
    } finally {
      setIsCfSaving(false);
    }
  };

  const showToast = (msg: string, isError = false) => {
    setToastMessage(msg);
    setToastError(isError);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleAdminGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (adminEmailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError(
        `Kirish taqiqlangan! Faqat rasmiy Bosh Administrator (${ADMIN_EMAIL}) tizimga kirish huquqiga ega.`
      );
      return;
    }

    const success = onAdminLogin(adminEmailInput, adminPasswordInput);
    if (!success) {
      setLoginError("Admin paroli noto'g'ri! Iltimos, to'g'ri administrator parolini kiriting.");
    } else {
      showToast("Bosh Administrator muvaffaqiyatli autentifikatsiyadan o'tdi!");
    }
  };

  // User search result
  const searchedUser = allUsers.find(
    (u) =>
      u.id === searchUserQuery.trim() ||
      u.email.toLowerCase() === searchUserQuery.trim().toLowerCase() ||
      u.name.toLowerCase().includes(searchUserQuery.trim().toLowerCase())
  );

  const handleApplyCreditChange = (targetUserId: string, amountStr: string, reason: string) => {
    const num = parseInt(amountStr.replace('+', ''), 10);
    if (isNaN(num) || num === 0) {
      showToast("Iltimos, noldan farqli to'g'ri kredit miqdorini kiriting", true);
      return;
    }

    const finalAmount = amountStr.startsWith('-') ? -Math.abs(num) : Math.abs(num);
    const targetUser = allUsers.find((u) => u.id === targetUserId);
    if (!targetUser) {
      showToast("Foydalanuvchi topilmadi", true);
      return;
    }

    if (finalAmount < 0 && targetUser.credits + finalAmount < 0) {
      const confirmNeg = confirm(
        `Diqqat: ${targetUser.name} hisobida ${targetUser.credits} kredit bor. ${Math.abs(
          finalAmount
        )} kredit ayirilsa balans manfiy bo'ladi. Davom etilsinmi?`
      );
      if (!confirmNeg) return;
    }

    onManualCreditAdjust(targetUserId, finalAmount, reason);
    setSelectedUserForModal(null);
    showToast(
      `${targetUser.name} (ID: ${targetUser.id}) hisobiga ${
        finalAmount > 0 ? `+${finalAmount}` : finalAmount
      } kredit muvaffaqiyatli o'zgartirildi!`
    );
  };

  const handleSavePricing = () => {
    onUpdatePricing({
      slidePrice: Number(slidePrice),
      aiImagePrice: Number(aiImagePrice),
      quizPrice: Number(quizPrice),
      welcomeBonus: Number(welcomeBonus),
    });
    showToast("Tizim narx siyosati parametrlari muvaffaqiyatli saqlandi va kuchga kirdi!");
  };

  const pendingRequests = paymentRequests.filter((r) => r.status === 'Kutilmoqda');

  // IF NOT AUTHENTICATED AS ADMIN: Show High-Security Admin Login Gate
  if (!isAdminAuthenticated && currentUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#eaedff] p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#ba1a1a]"></div>

          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[36px]">security</span>
            </div>
            <h1 className="font-headline-md text-xl font-black text-[#131b2e]">
              Admin Panel — Xavfsiz Kirish
            </h1>
            <p className="font-body-sm text-xs text-[#464555]">
              Ushbu bo'lim faqat Bosh Administrator uchun mo'ljallangan. Kirish uchun ruxsat etilgan Gmail va parolni kiriting.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs flex items-center gap-2 border border-[#ba1a1a]/30">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminGateLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#131b2e]">
                Administrator Google Pochta (Gmail)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">
                  admin_panel_settings
                </span>
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="qosimovumidjon1602@gmail.com"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#f2f3ff] text-xs font-code-md text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-[#eaedff]"
                />
              </div>
              <span className="text-[10px] text-[#777587]">
                Faqat rasmiy pochta: <strong>{ADMIN_EMAIL}</strong>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#131b2e] flex items-center justify-between">
                <span>Admin Paroli</span>
                <span className="text-[10px] text-[#777587]">Standart: admin</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting..."
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#f2f3ff] text-xs font-code-md text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-[#eaedff]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#283044] hover:bg-[#131b2e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Admin Panelga Kirish</span>
            </button>
          </form>

          <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-center gap-2 text-[#464555] text-xs border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified</span>
            <span>Barcha kirish urinishlari xavfsizlik auditida qayd etiladi.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Admin Master Banner */}
      <div className="w-full bg-[#283044] text-[#eef0ff] px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-label-sm text-xs tracking-wide uppercase font-bold">
              <span className="material-symbols-outlined text-[15px]">shield</span>
              Tizim ma'muriyati (Admin Panel) — Xavfsiz rejim
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6cf8bb] animate-pulse"></span>
              <span className="font-code-md text-xs text-[#d2d9f4]">
                Bosh Administrator: <strong>Umidjon Qosimov</strong> ({ADMIN_EMAIL})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={TELEGRAM_ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-lg bg-[#3525cd] text-white hover:bg-primary-container text-xs font-bold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              Telegram @Cyber_Umidjon
            </a>
            <button
              onClick={onAdminLogout}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#ba1a1a] text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#464555]">
              <span className="font-label-md text-xs uppercase tracking-wider font-semibold">
                Jami o'qituvchilar
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="font-headline-lg text-2xl text-[#131b2e] font-extrabold">
                {allUsers.length + 1480}
              </span>
              <div className="mt-1 flex items-center gap-1 text-[#006c49] font-label-sm text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+{allUsers.length} ta ro'yxatda</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#464555]">
              <span className="font-label-md text-xs uppercase tracking-wider font-semibold">
                Faol o'qituvchilar
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#006c49]">
                <span className="material-symbols-outlined text-[20px]">person_check</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="font-headline-lg text-2xl text-[#131b2e] font-extrabold">
                930
              </span>
              <div className="mt-1 flex items-center gap-1 text-[#464555] font-body-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                <span>Oxirgi 24 soatda faol</span>
              </div>
            </div>
          </div>

          <div className="bg-[#e2e7ff] p-5 rounded-2xl shadow-xs border border-[#c3c0ff] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#ffdad6]/40 pointer-events-none"></div>
            <div className="flex items-center justify-between text-[#131b2e]">
              <span className="font-label-md text-xs uppercase tracking-wider font-bold">
                Kutilayotgan to'lovlar
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white font-code-md text-[10px] flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Diqqat
              </span>
            </div>
            <div className="mt-4 flex flex-col relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-2xl text-[#ba1a1a] font-extrabold">
                  {pendingRequests.length} ta
                </span>
                <span className="font-label-sm text-xs text-[#464555]">so'rov</span>
              </div>
              <span className="mt-1 font-label-sm text-xs text-[#ba1a1a] font-bold">
                Ko'rib chiqish talab etiladi
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#464555]">
              <span className="font-label-md text-xs uppercase tracking-wider font-semibold">
                Jami Balanslar
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">token</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="font-headline-lg text-2xl text-[#131b2e] font-code-md font-extrabold">
                {allUsers.reduce((sum, u) => sum + u.credits, 0)}
              </span>
              <span className="mt-1 font-body-sm text-xs text-[#464555]">
                Mavjud foydalanuvchilar zaxirasi
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#464555]">
              <span className="font-label-md text-xs uppercase tracking-wider font-semibold">
                Taqdimotlar
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#006c49]">
                <span className="material-symbols-outlined text-[20px]">slideshow</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <span className="font-headline-lg text-2xl text-[#131b2e] font-extrabold">
                3,920 ta
              </span>
              <span className="mt-1 font-code-md text-xs text-primary font-bold">
                .pptx formatida eksport
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Foydalanuvchilar Bazasini Boshqarish & ID orqali Kredit Qo'shish/Ayirish */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#006c49]"></div>
              <h2 className="font-headline-md text-headline-md text-[#131b2e] font-bold">
                Foydalanuvchilar Bazasini Boshqarish & ID orqali Kredit O'zgartirish
              </h2>
            </div>
            <span className="text-xs text-[#464555] font-semibold">
              Barcha foydalanuvchilar: {allUsers.length} ta
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Quick Search & Direct Adjustment (Col 5) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#131b2e]">
                  Foydalanuvchini ID, Ism yoki Gmail orqali qidirish:
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#464555] text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Masalan: 48291, Nodira yoki gmail..."
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-[#eaedff]"
                  />
                </div>
              </div>

              {searchedUser ? (
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff] flex flex-col gap-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={searchedUser.avatarUrl}
                        alt={searchedUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#131b2e]">
                            {searchedUser.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#6cf8bb]/40 text-[#005236]">
                            {searchedUser.role === 'admin' ? 'Admin' : "O'qituvchi"}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#464555] block">
                          ID: <strong className="font-code-md text-primary font-bold">#{searchedUser.id}</strong> • {searchedUser.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#eaedff]">
                    <span className="text-xs text-[#464555]">Hozirgi mavjud kredit:</span>
                    <span className="font-code-md text-sm font-bold text-[#006c49]">
                      {searchedUser.credits} ta kredit
                    </span>
                  </div>

                  {/* Adjustment controls */}
                  <div className="flex flex-col gap-2 pt-1">
                    <label className="text-xs font-bold text-[#131b2e]">
                      Kredit qo'shish (+) yoki ayirish (-):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adjAmount}
                        onChange={(e) => setAdjAmount(e.target.value)}
                        placeholder="+20 yoki -10"
                        className="w-28 h-10 px-3 rounded-lg bg-white text-xs font-code-md font-bold text-[#131b2e] border border-[#c7c4d8] text-center"
                      />
                      <select
                        value={adjReason}
                        onChange={(e) => setAdjReason(e.target.value)}
                        className="flex-1 h-10 px-2 rounded-lg bg-white text-xs text-[#131b2e] border border-[#c7c4d8]"
                      >
                        <option value="To'lov tekshiruvi tasdig'i">To'lov tekshiruvi tasdig'i</option>
                        <option value="Texnik uzilish kompensatsiyasi">Texnik uzilish kompensatsiyasi</option>
                        <option value="Rag'batlantirish / Bonus">Rag'batlantirish / Bonus</option>
                        <option value="Xato hisoblangan kreditni qaytarish (-)">Xato hisoblangan kreditni qaytarish (-)</option>
                        <option value="Jarima yoki bekor qilish (-)">Jarima yoki bekor qilish (-)</option>
                      </select>
                    </div>

                    {/* Quick chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {['+10', '+25', '+50', '+100', '-10', '-25'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAdjAmount(amt)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold font-code-md transition-colors ${
                            amt.startsWith('+')
                              ? 'bg-[#6cf8bb]/40 text-[#005236] hover:bg-[#6cf8bb]'
                              : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white'
                          }`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyCreditChange(searchedUser.id, adjAmount, adjReason)
                      }
                      className="w-full h-10 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        published_with_changes
                      </span>
                      <span>Kreditni O'zgartirishni Tasdiqlash</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#f2f3ff] text-center text-xs text-[#464555] border border-dashed border-[#c7c4d8]">
                  "{searchUserQuery}" bo'yicha foydalanuvchi topilmadi.
                </div>
              )}
            </div>

            {/* Right: All Registered Users Table (Col 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden flex flex-col">
              <div className="p-4 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                  Ro'yxatdan o'tgan foydalanuvchilar ro'yxati
                </span>
                <span className="font-code-md text-xs text-primary font-bold">
                  {allUsers.length} ta hisob
                </span>
              </div>

              <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#faf8ff] text-[#464555] sticky top-0 border-b border-[#eaedff]">
                    <tr>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Ism va Maktab</th>
                      <th className="py-2.5 px-3">Gmail Pochta</th>
                      <th className="py-2.5 px-3 text-right">Balans</th>
                      <th className="py-2.5 px-3 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f3ff]">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#f2f3ff]/50 transition-colors">
                        <td className="py-3 px-3 font-code-md text-primary font-bold">
                          #{u.id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#131b2e]">{u.name}</span>
                            <span className="text-[10px] text-[#464555]">{u.school}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#464555] font-code-md text-[11px]">
                          {u.email}
                        </td>
                        <td className="py-3 px-3 text-right font-code-md text-[#006c49] font-bold">
                          {u.credits} kredit
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchUserQuery(u.id);
                              setSelectedUserForModal(u);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#eaedff] text-primary hover:bg-primary hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            +/- Kredit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Kutilayotgan to'lovlarni tasdiqlash navbati */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <h2 className="font-headline-md text-headline-md text-[#131b2e] font-bold">
                Kutilayotgan to'lovlarni tasdiqlash navbati
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] font-code-md text-xs font-bold">
                {pendingRequests.length} ta faol
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#464555] font-body-sm text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">verified</span>
              <span>Avtomatik qayta-tasdiqlashdan himoyalangan</span>
            </div>
          </div>

          <div className="w-full bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f2f3ff] text-[#464555] font-label-sm text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">So'rov ID</th>
                    <th className="py-3 px-4">O'qituvchi ID va Ismi</th>
                    <th className="py-3 px-4">So'ralgan kredit</th>
                    <th className="py-3 px-4">To'lov summasi</th>
                    <th className="py-3 px-4">To'lov cheki / Skrinshot</th>
                    <th className="py-3 px-4">Sana</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f3ff]">
                  {paymentRequests.map((req) => {
                    const isPending = req.status === 'Kutilmoqda';

                    return (
                      <tr
                        key={req.id}
                        className={`transition-colors ${
                          isPending ? 'hover:bg-[#f2f3ff]/40' : 'opacity-50 bg-[#faf8ff]'
                        }`}
                      >
                        <td className="py-4 px-4 font-code-md text-primary font-bold">
                          {req.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-label-lg text-xs font-bold text-[#131b2e]">
                              {req.teacherName}
                            </span>
                            <span className="font-code-md text-[11px] text-[#464555]">
                              ID: {req.teacherId} • {req.school}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 font-code-md text-xs text-[#006c49] font-bold">
                            <span className="material-symbols-outlined text-[16px]">token</span>
                            {req.requestedCredits} kredit
                          </span>
                        </td>
                        <td className="py-4 px-4 font-code-md text-xs text-[#131b2e] font-semibold">
                          {req.amount}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setActiveReceipt(req)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] font-label-sm text-xs hover:bg-[#eaedff] transition-colors border border-[#eaedff] font-semibold cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              receipt_long
                            </span>
                            Chekni ko'rish ({req.method})
                          </button>
                        </td>
                        <td className="py-4 px-4 text-[#464555]">{req.date}</td>
                        <td className="py-4 px-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  onApprovePayment(req.id, req.teacherId, req.requestedCredits);
                                  showToast(
                                    `${req.id} to'lovi tasdiqlandi va ${req.teacherName} hisobiga +${req.requestedCredits} kredit qo'shildi!`
                                  );
                                }}
                                className="h-8 px-3 rounded-xl bg-[#006c49] text-white font-bold inline-flex items-center gap-1 hover:bg-[#005236] transition-all shadow-xs cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  check_circle
                                </span>
                                Tasdiqlash
                              </button>
                              <button
                                onClick={() => {
                                  onRejectPayment(req.id);
                                  showToast(`${req.id} so'rovi rad etildi.`, true);
                                }}
                                className="h-8 px-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-bold inline-flex items-center gap-1 hover:bg-[#ba1a1a] hover:text-white transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px]">cancel</span>
                                Rad
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                req.status === 'Tasdiqlandi'
                                  ? 'bg-[#6cf8bb]/40 text-[#005236]'
                                  : 'bg-[#ffdad6] text-[#ba1a1a]'
                              }`}
                            >
                              {req.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: Tizim Narx Siyosatini Tahrirlash (Only Admin Authorized) */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#e2dfff] flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </span>
              <div>
                <h2 className="font-title-md text-base text-[#131b2e] font-bold">
                  Tizim Narx Siyosati (Slayd va Generatsiya Narxlarini O'zgartirish)
                </h2>
                <p className="text-xs text-[#464555]">
                  Ushbu narxlar yangi taqdimot yaratishdagi hisob-kitob kalkulyatorida darhol amal qiladi.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold">
              Admin Ruxsati
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">view_carousel</span>
                1 ta slayd narxi:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={slidePrice}
                  onChange={(e) => setSlidePrice(Number(e.target.value))}
                  className="w-16 h-10 bg-white rounded-lg border border-[#c7c4d8] text-center font-code-md text-sm font-bold text-[#131b2e]"
                />
                <span className="text-xs font-semibold text-[#131b2e]">kredit / slayd</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">image</span>
                1 ta AI rasm narxi:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={aiImagePrice}
                  onChange={(e) => setAiImagePrice(Number(e.target.value))}
                  className="w-16 h-10 bg-white rounded-lg border border-[#c7c4d8] text-center font-code-md text-sm font-bold text-[#131b2e]"
                />
                <span className="text-xs font-semibold text-[#131b2e]">kredit / rasm</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2 text-[#006c49] font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">quiz</span>
                1 ta viktorina savoli:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={quizPrice}
                  onChange={(e) => setQuizPrice(Number(e.target.value))}
                  className="w-16 h-10 bg-white rounded-lg border border-[#c7c4d8] text-center font-code-md text-sm font-bold text-[#131b2e]"
                />
                <span className="text-xs font-semibold text-[#131b2e]">kredit / savol</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2 text-[#006c49] font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">card_giftcard</span>
                Boshlang'ich bepul kredit:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={welcomeBonus}
                  onChange={(e) => setWelcomeBonus(Number(e.target.value))}
                  className="w-16 h-10 bg-white rounded-lg border border-[#c7c4d8] text-center font-code-md text-sm font-bold text-[#131b2e]"
                />
                <span className="text-xs font-semibold text-[#131b2e]">kredit / yangi a'zo</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePricing}
              className="h-11 px-6 bg-[#283044] hover:bg-[#131b2e] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Narx Siyosatini Saqlash va Kuchga Kiritish</span>
            </button>
          </div>
        </div>

        {/* SECTION: AI Dvigatellari & Cloudflare / Gemini Integratsiyasi */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eaedff]">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#ffeed9] flex items-center justify-center text-[#f38020] font-bold shadow-xs">
                <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-title-md text-base text-[#131b2e] font-bold">
                    Sun'iy Intellekt va Cloudflare Integratsiyasi
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#f38020]/15 text-[#b94a00] font-code-md text-[11px] font-bold">
                    Cloudflare + Gemini
                  </span>
                </div>
                <p className="text-xs text-[#464555]">
                  Gamma o'rniga Cloudflare Workers AI, Google Gemini va Pollinations dvigatellari bilan uzluksiz ishlash.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#e2fbd7] text-[#006c49] text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                Gemini 3.8 Flash Faol
              </span>
            </div>
          </div>

          {/* Engine status cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gemini */}
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                  </span>
                  <span className="text-xs font-bold text-[#131b2e]">Google Gemini AI</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006c49] text-white">
                  Ulangan
                </span>
              </div>
              <p className="text-[11px] text-[#464555]">
                Dars strukturasi, pedagogik tahlil, DTS talablari va o'zbek tilidagi taqdimot kontentini ishlab chiquvchi asosiy intellektual miya.
              </p>
              <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between text-[11px]">
                <span className="text-[#464555]">Model:</span>
                <span className="font-code-md font-bold text-primary">gemini-3.8-flash</span>
              </div>
            </div>

            {/* Cloudflare Workers AI */}
            <div className="p-4 rounded-xl bg-[#fff8f2] border border-[#ffeed9] flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#f38020] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                  </span>
                  <span className="text-xs font-bold text-[#131b2e]">Cloudflare Workers AI</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfConfigured ? 'bg-[#006c49] text-white' : 'bg-[#e2e7ff] text-[#3525cd]'}`}>
                  {cfConfigured ? 'Ulangan' : 'Sozlangan (Ixtiyoriy)'}
                </span>
              </div>
              <p className="text-[11px] text-[#464555]">
                Har kuni 10,000 ta bepul neyron, Flux-1 Schnell rasm generatsiyasi va O'zbekiston ichida tezkor kesh serverlari (Tashkent Edge).
              </p>
              <div className="pt-2 border-t border-[#ffeed9] flex items-center justify-between text-[11px]">
                <span className="text-[#464555]">Kvota:</span>
                <span className="font-code-md font-bold text-[#f38020]">10,000 req/kun bepul</span>
              </div>
            </div>

            {/* Pollinations AI */}
            <div className="p-4 rounded-xl bg-[#f2fbf7] border border-[#daede2] flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#006c49] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">palette</span>
                  </span>
                  <span className="text-xs font-bold text-[#131b2e]">Pollinations AI (Flux)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006c49] text-white">
                  Avtomatik Faol
                </span>
              </div>
              <p className="text-[11px] text-[#464555]">
                Cheksiz, 100% bepul rasm generatori. Hech qanday hisob yoki kalit talab etilmaydi, har doim ishonchli ishlaydi.
              </p>
              <div className="pt-2 border-t border-[#daede2] flex items-center justify-between text-[11px]">
                <span className="text-[#464555]">Holat:</span>
                <span className="font-code-md font-bold text-[#006c49]">Doimiy bepul</span>
              </div>
            </div>
          </div>

          {/* Cloudflare Account Credentials Config */}
          <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#131b2e]">
                  Cloudflare Hisobini Ulash (Ixtiyoriy kengaytirish)
                </h3>
                <p className="text-[11px] text-[#464555]">
                  Agar Cloudflare dashboardingizdan Account ID va API Tokeningizni kiritsangiz, tizim to'g'ridan-to'g'ri Cloudflare Workers AI orqali rasmlarni generatsiya qiladi.
                </p>
              </div>
              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#3525cd] hover:underline font-bold flex items-center gap-1"
              >
                dash.cloudflare.com
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#131b2e]">
                  Cloudflare Account ID:
                </label>
                <input
                  type="text"
                  value={cfAccountId}
                  onChange={(e) => setCfAccountId(e.target.value)}
                  placeholder="masalan: 98a76b5c4d3e2f1..."
                  className="w-full h-10 px-3 rounded-lg bg-white border border-[#c7c4d8] text-xs font-code-md text-[#131b2e] outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#131b2e]">
                  Cloudflare API Token (Workers AI Read/Write):
                </label>
                <input
                  type="password"
                  value={cfApiToken}
                  onChange={(e) => setCfApiToken(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••••"
                  className="w-full h-10 px-3 rounded-lg bg-white border border-[#c7c4d8] text-xs font-code-md text-[#131b2e] outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#eaedff]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#131b2e]">Afzal ko'rilgan Rasm Dvigateli:</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-[#131b2e] cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      checked={preferredEngine === 'pollinations'}
                      onChange={() => setPreferredEngine('pollinations')}
                      className="accent-primary"
                    />
                    Pollinations AI (Bepul, cheksiz)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#131b2e] cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      checked={preferredEngine === 'cloudflare'}
                      onChange={() => setPreferredEngine('cloudflare')}
                      className="accent-[#f38020]"
                    />
                    Cloudflare Workers AI (Flux-1)
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAiSettings}
                disabled={isCfSaving}
                className="h-9 px-4 bg-[#f38020] hover:bg-[#d96e14] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{isCfSaving ? 'Saqlanmoqda...' : 'Cloudflare Sozlamalarini Saqlash'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Audit Jurnali */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#777587]"></div>
              <h2 className="font-headline-md text-headline-md text-[#131b2e] font-bold">
                Xavfsizlik & Audit jurnali (Oxirgi ma'muriy amallar)
              </h2>
            </div>
            <span className="font-code-md text-xs text-[#464555]">
              Real-vaqt sinkronizatsiyasi: Faol
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#eaedff] flex flex-col gap-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start sm:items-center justify-between p-3.5 rounded-xl bg-[#f2f3ff] gap-4 border border-[#eaedff]"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#006c49] mt-1.5 sm:mt-0"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-code-md text-xs text-primary font-bold">
                      {log.time}
                    </span>
                    <span className="font-body-md text-xs text-[#131b2e]">
                      Admin <strong>{log.adminName}</strong>: {log.actionText}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-white text-[#464555] font-code-md text-[11px] shrink-0 border border-[#eaedff]">
                  {log.ip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#eaedff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">receipt</span>
                <span className="font-headline-sm text-base text-[#131b2e] font-bold">
                  {activeReceipt.id} raqamli to'lov cheki
                </span>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#464555] hover:bg-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 bg-[#f2f3ff] p-4 rounded-xl text-xs border border-[#eaedff]">
              <div className="flex justify-between">
                <span className="text-[#464555]">To'lovchi:</span>
                <span className="font-bold text-[#131b2e]">{activeReceipt.teacherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Summa:</span>
                <span className="font-code-md font-bold text-[#131b2e] text-sm">
                  {activeReceipt.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Tizim:</span>
                <span className="font-bold text-[#006c49]">{activeReceipt.method}</span>
              </div>
            </div>

            <div className="relative w-full h-52 bg-[#f2f3ff] rounded-xl overflow-hidden flex items-center justify-center border border-[#eaedff]">
              <img
                className="w-full h-full object-cover"
                src={activeReceipt.receiptImage}
                alt="Receipt screenshot"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveReceipt(null)}
                className="h-10 px-4 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-label-md text-xs font-bold hover:bg-[#eaedff] transition-colors cursor-pointer"
              >
                Yopish
              </button>
              {activeReceipt.status === 'Kutilmoqda' && (
                <button
                  onClick={() => {
                    onApprovePayment(
                      activeReceipt.id,
                      activeReceipt.teacherId,
                      activeReceipt.requestedCredits
                    );
                    setActiveReceipt(null);
                    showToast(
                      `${activeReceipt.id} to'lovi tasdiqlandi va ${activeReceipt.teacherName} hisobiga kredit qo'shildi!`
                    );
                  }}
                  className="h-10 px-5 rounded-xl bg-[#006c49] text-white font-label-md text-xs font-bold hover:bg-[#005236] transition-colors cursor-pointer"
                >
                  Tasdiqlash va kredit berish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in ${
            toastError ? 'bg-[#ba1a1a]' : 'bg-[#131b2e]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              toastError ? 'text-white' : 'text-[#6cf8bb]'
            }`}
          >
            {toastError ? 'error' : 'check_circle'}
          </span>
          <span className="font-body-md text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
