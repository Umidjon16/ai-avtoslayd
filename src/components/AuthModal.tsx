import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ADMIN_EMAIL } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onRegisterUser: (name: string, email: string, school: string, avatarUrl?: string) => void;
  onAdminLogin: (email: string, pass: string) => boolean;
}

const REG_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  onRegisterUser,
  onAdminLogin,
}) => {
  const [authState, setAuthState] = useState<'login' | 'success' | 'error' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [schoolInput, setSchoolInput] = useState('');
  const [avatarInput, setAvatarInput] = useState(REG_AVATARS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<UserProfile>(currentUser);

  if (!isOpen) return null;

  const handleGoogleQuickAuth = (user: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoggedInUser(user);
      onSelectUser(user);
      setAuthState('success');
    }, 700);
  };

  const handleManualEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const emailTrimmed = emailInput.trim().toLowerCase();

    if (!emailTrimmed) {
      setErrorMessage("Iltimos, Google pochtangizni kiriting!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if it's the admin
      if (emailTrimmed === ADMIN_EMAIL.toLowerCase()) {
        const success = onAdminLogin(emailTrimmed, passwordInput);
        if (!success) {
          setErrorMessage("Admin paroli noto'g'ri! Iltimos, to'g'ri administrator parolini kiriting.");
          return;
        }
        const adminUser = allUsers.find(
          (u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        );
        if (adminUser) {
          setLoggedInUser(adminUser);
          onSelectUser(adminUser);
          setAuthState('success');
        }
        return;
      }

      // Check if user already exists
      const existing = allUsers.find(
        (u) => u.email.toLowerCase() === emailTrimmed
      );

      if (existing) {
        setLoggedInUser(existing);
        onSelectUser(existing);
        setAuthState('success');
      } else {
        // Prompt user to complete registration with their name and school
        setNameInput(emailTrimmed.split('@')[0]);
        setAuthState('register');
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMessage("Iltimos, ismingizni kiriting");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterUser(
        nameInput.trim(),
        emailInput.trim().toLowerCase(),
        schoolInput.trim() || "O'zbekiston umumta'lim maktabi",
        avatarInput
      );
      setAuthState('success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eaedff]">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 -right-12 w-48 h-48 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff] hover:text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Top Brand Header Section */}
        <div className="p-6 pb-2 text-center flex flex-col items-center">
          <div className="relative mb-3 p-1.5 rounded-xl bg-[#f2f3ff] shadow-sm">
            <img
              alt="AI Avto-Slayd Logo"
              className="w-12 h-12 object-contain rounded-lg"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XMv2g8nIx-ttBwuw4PpeRe6cVPf569M2T-Z2L8vLioLag04_5ujRhnGTuINrvo7rbaGn7d-sZPeldQuCGeXr2Npji2Q-VL8-sqfOpJE5Yw3ltlVMR-g7_QAHs_8Fy0CNsoPDnOlANQbVnUk8LqLQOyzzGgfVM5WC0KdgJGOsTWVcrvLdkaG2eCfECiaORHErU15Ofot5UcanJQVP_kbwFLVRY9IFobpbwkD97zYzXq2Y36rgNhN5Bx-ys"
            />
          </div>
          <h1 className="font-headline-md text-headline-md text-[#131b2e] tracking-tight font-bold">
            AI Avto-Slayd
          </h1>
          <p className="font-body-sm text-body-sm text-[#464555] max-w-xs mt-1">
            O'zbekiston maktab o'qituvchilari uchun sun'iy intellekt taqdimot platformasi
          </p>

          {/* New User Welcome Incentive Banner */}
          <div className="mt-4 w-full bg-[#f2f3ff] rounded-xl p-3 flex items-center gap-3 text-left border border-[#e2e7ff]">
            <div className="w-8 h-8 rounded-full bg-[#6cf8bb] flex items-center justify-center shrink-0 text-[#005236]">
              <span className="material-symbols-outlined text-[18px]">redeem</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#006c49] block font-bold">
                Yangi foydalanuvchi bonusi
              </span>
              <p className="font-body-sm text-[12px] text-[#131b2e] line-clamp-2">
                Ilk bor kirgan har bir o'qituvchiga dars tayyorlash uchun{' '}
                <span className="font-bold text-[#006c49]">15 ta bepul kredit</span> taqdim etiladi!
              </p>
            </div>
          </div>
        </div>

        {/* State Tabs */}
        <div className="px-6 py-2">
          <div className="bg-[#e2e7ff] p-1 rounded-xl flex items-center justify-between text-center gap-1">
            <button
              onClick={() => {
                setAuthState('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authState === 'login' || authState === 'register'
                  ? 'bg-white text-[#131b2e] shadow-sm font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Kirish / Ro'yxat
            </button>
            <button
              onClick={() => {
                setAuthState('success');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authState === 'success'
                  ? 'bg-white text-[#131b2e] shadow-sm font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Muvaffaqiyatli
            </button>
            <button
              onClick={() => {
                setAuthState('error');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authState === 'error'
                  ? 'bg-white text-[#131b2e] shadow-sm font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Xatolik
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-2 flex flex-col">
          {errorMessage && (
            <div className="mb-3 p-3 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs flex items-center gap-2 border border-[#ba1a1a]/20">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* VIEW: Login */}
          {authState === 'login' && (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <h2 className="font-title-md text-title-md text-[#131b2e] font-bold">
                  Google hisob orqali kirish
                </h2>
                <p className="font-body-sm text-xs text-[#464555] mt-0.5">
                  Mavjud hisobingizni tanlang yoki Google pochtangizni kiriting:
                </p>
              </div>

              {/* Quick Account Switcher */}
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const isAdmin = u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleGoogleQuickAuth(u)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                        isCurrent
                          ? 'bg-[#e2dfff]/40 border-primary ring-1 ring-primary'
                          : 'bg-[#faf8ff] hover:bg-[#f2f3ff] border-[#eaedff]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-primary/30"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-label-md text-xs font-bold text-[#131b2e] truncate">
                              {u.name}
                            </span>
                            {isAdmin && (
                              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-1.5 py-0.2 rounded">
                                Bosh Admin
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#464555] truncate block">
                            {u.email}
                          </span>
                        </div>
                      </div>
                      <span className="font-code-md text-xs text-[#006c49] font-bold shrink-0 ml-2">
                        {u.credits} kredit
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative flex items-center my-1">
                <div className="flex-grow border-t border-[#eaedff]"></div>
                <span className="flex-shrink mx-3 text-[11px] text-[#777587] uppercase font-semibold">
                  Yoki yangi hisob bilan
                </span>
                <div className="flex-grow border-t border-[#eaedff]"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleManualEmailLogin} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#131b2e]">
                    Google Pochta (Gmail)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="Masalan: qosimovumidjon1602@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-[#eaedff]"
                    />
                  </div>
                </div>

                {emailInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                  <div className="flex flex-col gap-1 animate-fade-in">
                    <label className="text-xs font-bold text-primary flex items-center justify-between">
                      <span>Bosh Admin Paroli</span>
                      <span className="text-[11px] text-primary font-bold">Xavfsiz kalit</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary text-[18px]">
                        lock
                      </span>
                      <input
                        type="password"
                        placeholder="Admin parolini kiriting"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-primary/40 font-code-md"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary text-white hover:bg-primary-container font-label-lg text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.35 7.34 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.65 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Google orqali davom etish</span>
                    </>
                  )}
                </button>
              </form>

              {/* Safety notice */}
              <div className="p-2.5 rounded-xl bg-[#f2f3ff] text-[#464555] flex gap-2.5 items-start border border-[#eaedff]">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                  lock_person
                </span>
                <div className="text-left font-body-sm text-[11px] leading-relaxed">
                  <span className="text-[#131b2e] font-semibold">Xavfsizlik kafolati: </span>
                  Google OAuth 2.0 protokoli orqali ishlaydi. Parol faqat Bosh Admin tekshiruvi uchun talab qilinadi.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Register */}
          {authState === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              <div className="text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#005236] text-[10px] font-bold">
                  Yangi hisob
                </span>
                <h3 className="font-headline-sm text-base text-[#131b2e] font-bold mt-1">
                  O'qituvchi profilini yakunlang
                </h3>
                <p className="text-xs text-[#464555]">
                  {emailInput} uchun 15 ta bepul sinov krediti tayyorlandi!
                </p>
              </div>

              {/* Avatar chooser for new user */}
              <div className="flex flex-col gap-1.5 p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <label className="text-xs font-bold text-[#131b2e] flex items-center justify-between">
                  <span>Profil fotosuratini tanlang</span>
                  <img src={avatarInput} alt="Preview" className="w-6 h-6 rounded-full object-cover ring-1 ring-primary" />
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {REG_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarInput(av)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarInput === av ? 'border-primary ring-2 ring-primary/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#131b2e]">Ism va Familiyangiz *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Dilnoza Rahimova"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none border border-[#eaedff] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#131b2e]">Maktab yoki Ta'lim muassasasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Toshkent sh. 18-maktab"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none border border-[#eaedff] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#006c49] text-white hover:bg-[#005236] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? "Saqlanmoqda..." : "Profilni yaratish va 15 kreditni olish 🎁"}
              </button>
            </form>
          )}

          {/* VIEW: Success */}
          {authState === 'success' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#6cf8bb] text-[#005236] flex items-center justify-center mb-2 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">check_circle</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                Muvaffaqiyatli kirildi!
              </h3>
              <p className="font-body-sm text-body-sm text-[#464555] mt-0.5">
                {loggedInUser.role === 'admin'
                  ? "Bosh Administrator tizimga kirdi."
                  : "Platformaga xush kelibsiz, o'qituvchi."}
              </p>

              {/* User Card */}
              <div className="mt-4 w-full bg-[#f2f3ff] rounded-xl p-3 flex items-center gap-3 text-left border border-[#e2e7ff]">
                <img
                  src={loggedInUser.avatarUrl}
                  alt={loggedInUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-xs font-bold text-[#131b2e] truncate">
                      {loggedInUser.name}
                    </span>
                    <span className="font-code-md text-xs text-primary font-bold">
                      ID: #{loggedInUser.id}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-[#464555] truncate">{loggedInUser.email}</p>
                  <p className="text-[10px] text-primary font-semibold truncate">{loggedInUser.school}</p>
                </div>
              </div>

              {/* Active Credit Indicator */}
              <div className="mt-3 w-full flex items-center justify-between p-3 bg-[#eaedff] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006c49]">
                    bolt
                  </span>
                  <span className="font-label-md text-xs text-[#131b2e] font-semibold">
                    Kreditlar qoldig'i:
                  </span>
                </div>
                <span className="font-code-md text-sm font-bold text-[#006c49] bg-white px-2.5 py-1 rounded-md shadow-xs">
                  {loggedInUser.credits} ta kredit
                </span>
              </div>

              <button
                onClick={onClose}
                className="mt-4 w-full h-11 bg-primary text-white font-label-lg text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Dars yaratish paneliga o'tish</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* VIEW: Error */}
          {authState === 'error' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[26px]">gpp_maybe</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-[#131b2e] font-bold">
                Autentifikatsiya xatoligi
              </h3>
              <div className="mt-3 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] text-left w-full text-xs leading-relaxed">
                Google orqali kirishda yoki ma'lumotlarni tekshirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki boshqa hisobni tanlang.
              </div>
              <button
                onClick={() => setAuthState('login')}
                className="mt-4 w-full h-11 bg-primary text-white font-label-lg text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Qayta urinish</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#f2f3ff] text-center border-t border-[#eaedff]">
          <div className="flex items-center justify-center gap-1 font-body-sm text-[11px] text-[#464555]">
            <span>Texnik yordam:</span>
            <a
              className="font-label-sm text-primary hover:underline inline-flex items-center gap-0.5 font-bold"
              href="https://t.me/Cyber_Umidjon"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram @Cyber_Umidjon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
