import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [school, setSchool] = useState(currentUser.school);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload (converts to base64 for storage)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Iltimos, faqat rasm faylini yuklang (PNG, JPG, WEBP)!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setAvatarUrl(imageUrlInput.trim());
      setShowUrlInput(false);
      setImageUrlInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Iltimos, ism va familiyangizni kiriting!");
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      name: name.trim(),
      school: school.trim() || "O'zbekiston maktabi",
      phone: phone.trim(),
      avatarUrl,
    };

    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden my-auto animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaedff] flex items-center justify-between bg-gradient-to-r from-[#f2f3ff] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-lg text-[#131b2e] font-extrabold">
                Profil ma'lumotlarini tahrirlash
              </h2>
              <p className="font-body-sm text-xs text-[#464555]">
                Ism, maktab va profilingiz rasmini yangilang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white shadow-md flex items-center justify-center hover:bg-primary-container transition-transform active:scale-90 cursor-pointer"
                title="Rasm yuklash"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </button>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-2 flex-1 text-center sm:text-left">
              <span className="font-label-lg text-sm text-[#131b2e] font-bold">
                Profil fotosurati
              </span>
              <p className="font-body-sm text-xs text-[#464555]">
                Galereyangizdan rasm yuklang yoki tayyor rasmlardan birini tanlang
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  <span>Rasm yuklash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-1.5 rounded-xl bg-[#e2e7ff] text-primary text-xs font-semibold hover:bg-[#c3c0ff] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">link</span>
                  <span>Havola (URL)</span>
                </button>
              </div>
            </div>
          </div>

          {/* URL Input dropdown if toggled */}
          {showUrlInput && (
            <div className="flex items-center gap-2 p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff] animate-fade-in">
              <input
                type="url"
                placeholder="https://example.com/rasm.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-[#eaedff] outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container cursor-pointer"
              >
                Qo'llash
              </button>
            </div>
          )}

          {/* Preset Avatars */}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-xs text-[#464555] font-semibold">
              Yoki tayyor o'qituvchi avatarlaridan birini tanlang:
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset)}
                  className={`relative rounded-full overflow-hidden p-0.5 aspect-square border-2 transition-all cursor-pointer ${
                    avatarUrl === preset
                      ? 'border-primary ring-2 ring-primary/40 scale-105'
                      : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img
                    src={preset}
                    alt={`Avatar ${idx + 1}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {avatarUrl === preset && (
                    <span className="absolute inset-0 bg-primary/25 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* User ID & Role non-editable info */}
          <div className="flex items-center justify-between p-3 bg-[#f2f3ff] rounded-xl text-xs">
            <span className="text-[#464555]">
              Shaxsiy hisob raqami (ID): <strong className="font-code-md text-primary font-bold">#{currentUser.id}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white text-[#131b2e] font-semibold text-[11px] shadow-xs">
              {currentUser.role === 'admin' ? "Bosh Administrator" : "O'qituvchi"}
            </span>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-xs text-[#131b2e] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                <span>Ism va familiyangiz *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Nodira Karimova"
                className="w-full h-11 px-4 rounded-xl border border-[#eaedff] bg-white text-sm text-[#131b2e] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-xs text-[#131b2e] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                <span>Qaysi maktab / Ta'lim muassasasi *</span>
              </label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Masalan: Toshkent shahar 142-maktab"
                className="w-full h-11 px-4 rounded-xl border border-[#eaedff] bg-white text-sm text-[#131b2e] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-xs text-[#131b2e] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#464555]">call</span>
                <span>Telefon raqamingiz (ixtiyoriy)</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full h-11 px-4 rounded-xl border border-[#eaedff] bg-white text-sm text-[#131b2e] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#f2f3ff] text-[#464555] font-semibold text-xs hover:bg-[#eaedff] transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Saqlash va yangilash</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-[#6cf8bb]/30 border border-[#006c49]/30 rounded-xl flex items-center gap-2 text-[#005236] text-xs font-bold animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Profil ma'lumotlaringiz muvaffaqiyatli yangilandi!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
