import React, { useState } from 'react';
import { PageTab, UserProfile } from '../types';

interface HeaderProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenEditProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onOpenEditProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { tab: PageTab; label: string }[] = [
    { tab: 'bosh-sahifa', label: 'Bosh sahifa' },
    { tab: 'yangi-taqdimot', label: 'Yangi taqdimot' },
    { tab: 'mening-taqdimotlarim', label: 'Mening taqdimotlarim' },
    { tab: 'kreditlarim', label: 'Kreditlarim' },
    { tab: 'tolovlar', label: "To'lovlar" },
    { tab: 'admin-panel', label: 'Admin Panel' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#f2f3ff]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              setCurrentTab('bosh-sahifa');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group"
          >
            <img
              alt="AI Avto-Slayd Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XMv2g8nIx-ttBwuw4PpeRe6cVPf569M2T-Z2L8vLioLag04_5ujRhnGTuINrvo7rbaGn7d-sZPeldQuCGeXr2Npji2Q-VL8-sqfOpJE5Yw3ltlVMR-g7_QAHs_8Fy0CNsoPDnOlANQbVnUk8LqLQOyzzGgfVM5WC0KdgJGOsTWVcrvLdkaG2eCfECiaORHErU15Ofot5UcanJQVP_kbwFLVRY9IFobpbwkD97zYzXq2Y36rgNhN5Bx-ys"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#131b2e] leading-tight font-bold group-hover:text-primary transition-colors">
                AI Avto-Slayd
              </span>
              <span className="font-label-sm text-label-sm text-[#464555] leading-none">
                O'qituvchilar uchun AI platforma
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#f2f3ff] rounded-xl">
            {navItems.map((item) => {
              const isActive =
                currentTab === item.tab ||
                (item.tab === 'yangi-taqdimot' && currentTab === 'generatsiya') ||
                (item.tab === 'mening-taqdimotlarim' && currentTab === 'taqdimot-korish');

              return (
                <button
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#e2e7ff] text-[#3525cd] font-bold shadow-xs'
                      : 'text-[#464555] hover:bg-[#eaedff] hover:text-[#131b2e]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Credits, User Profile & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Credit balance badge */}
          <div className="flex items-center gap-2 bg-[#f2f3ff] px-3 py-1.5 rounded-full shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] animate-pulse"></span>
              <span className="font-label-md text-label-md text-[#131b2e]">
                Kreditlar:{' '}
                <strong className="text-[#006c49] font-code-md">
                  {user.credits} ta
                </strong>
              </span>
            </div>
            <button
              onClick={() => {
                window.open('https://t.me/Cyber_Umidjon', '_blank');
              }}
              className="flex items-center gap-1 bg-[#006c49] text-white px-2.5 py-0.5 rounded-full font-label-sm text-[11px] hover:bg-[#005236] transition-colors shadow-xs cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Sotib olish
            </button>
          </div>

          <div className="h-7 w-px bg-[#e2e7ff] hidden sm:block"></div>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-1 py-1 pr-2 cursor-pointer rounded-xl hover:bg-[#f2f3ff] transition-colors"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#e2dfff]"
                src={user.avatarUrl}
              />
              <div className="hidden md:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-label-lg text-[#131b2e] leading-tight font-semibold">
                    {user.name}
                  </span>
                  {(user.role === 'admin' || user.email === 'qosimovumidjon1602@gmail.com') && (
                    <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>
                <span className="font-code-md text-[11px] text-[#464555] leading-none">
                  ID: {user.id}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#464555] text-[20px]">
                expand_more
              </span>
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-68 bg-white rounded-xl shadow-xl border border-[#eaedff] py-2 z-50 animate-fade-in"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-4 py-3 border-b border-[#eaedff]">
                  <p className="text-sm font-bold text-[#131b2e]">{user.name}</p>
                  <p className="text-xs text-[#464555] truncate">{user.email}</p>
                  <p className="text-xs text-primary font-semibold mt-1">
                    {user.school}
                  </p>
                </div>
                <button
                  onClick={onOpenEditProfile}
                  className="w-full px-4 py-2 text-left text-sm text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2 font-medium"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    edit
                  </span>
                  Profilni tahrirlash (Ism, Maktab, Rasm)
                </button>
                <button
                  onClick={() => setCurrentTab('kreditlarim')}
                  className="w-full px-4 py-2 text-left text-sm text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#006c49]">
                    account_balance_wallet
                  </span>
                  Mening hisobim va balans
                </button>
                <button
                  onClick={() => setCurrentTab('mening-taqdimotlarim')}
                  className="w-full px-4 py-2 text-left text-sm text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    slideshow
                  </span>
                  Mening taqdimotlarim
                </button>
                <button
                  onClick={() => setCurrentTab('admin-panel')}
                  className="w-full px-4 py-2 text-left text-sm text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2 border-t border-[#f2f3ff]"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    admin_panel_settings
                  </span>
                  Admin Panel (Boshqaruv)
                </button>
                <button
                  onClick={onOpenAuth}
                  className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-[#f2f3ff] flex items-center gap-2 border-t border-[#f2f3ff]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    switch_account
                  </span>
                  Google hisobni almashtirish / Kirish
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#464555] hover:bg-[#f2f3ff]"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#eaedff] px-4 py-4 flex flex-col gap-2 shadow-xl animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* Mobile User Card */}
          <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-center justify-between border border-[#eaedff]">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#131b2e] leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#464555]">
                  ID: #{user.id} • {user.credits} kredit
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenEditProfile();
                setMobileMenuOpen(false);
              }}
              className="p-1.5 rounded-lg bg-white text-primary hover:bg-[#eaedff] transition-colors border border-[#eaedff]"
              title="Profilni tahrirlash"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>

          {/* Quick Mobile Action Buttons */}
          <div className="grid grid-cols-2 gap-2 my-1">
            <button
              onClick={() => {
                onOpenEditProfile();
                setMobileMenuOpen(false);
              }}
              className="h-10 px-3 bg-white text-[#131b2e] border border-[#eaedff] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#f2f3ff]"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">manage_accounts</span>
              <span>Profilni sozlash</span>
            </button>
            <button
              onClick={() => {
                window.open('https://t.me/Cyber_Umidjon', '_blank');
                setMobileMenuOpen(false);
              }}
              className="h-10 px-3 bg-[#006c49] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Sotib olish</span>
            </button>
          </div>

          <div className="h-px bg-[#eaedff] my-1"></div>

          {/* Nav Items */}
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setCurrentTab(item.tab);
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2.5 rounded-xl text-sm text-left font-semibold flex items-center justify-between transition-colors ${
                currentTab === item.tab
                  ? 'bg-[#e2e7ff] text-[#3525cd] font-bold shadow-xs'
                  : 'text-[#464555] hover:bg-[#f2f3ff]'
              }`}
            >
              <span>{item.label}</span>
              <span className="material-symbols-outlined text-[16px] opacity-40">chevron_right</span>
            </button>
          ))}

          <button
            onClick={() => {
              onOpenAuth();
              setMobileMenuOpen(false);
            }}
            className="mt-2 px-3 py-2.5 rounded-xl text-sm text-primary bg-[#f2f3ff] text-left font-bold flex items-center gap-2 border border-[#eaedff]"
          >
            <span className="material-symbols-outlined text-[18px]">switch_account</span>
            <span>Google hisobni almashtirish / Kirish</span>
          </button>
        </div>
      )}
    </header>
  );
};
