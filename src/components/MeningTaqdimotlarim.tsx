import React, { useState } from 'react';
import { Presentation, PageTab } from '../types';

interface MeningTaqdimotlarimProps {
  presentations: Presentation[];
  onSelectPresentation: (p: Presentation) => void;
  onNavigate: (tab: PageTab) => void;
  onDownloadPptx: (p: Presentation) => void;
  onDeletePresentation: (id: string) => void;
}

export const MeningTaqdimotlarim: React.FC<MeningTaqdimotlarimProps> = ({
  presentations,
  onSelectPresentation,
  onNavigate,
  onDownloadPptx,
  onDeletePresentation,
}) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'generating' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = presentations.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'ready') return p.status === 'Tayyor';
    if (filter === 'generating') return p.status === 'Jarayonda';
    if (filter === 'draft') return p.status === 'Qoralama';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg text-[#131b2e] tracking-tight font-extrabold">
              Mening taqdimotlarim
            </h1>
            <p className="font-body-md text-sm text-[#464555]">
              Siz yaratgan barcha interaktiv dars taqdimotlari to'plami va qoralamalar
            </p>
          </div>
          <button
            onClick={() => onNavigate('yangi-taqdimot')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-label-lg text-sm font-bold shadow-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Yangi taqdimot yaratish</span>
          </button>
        </div>

        {/* Filter bar and Search */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f2f3ff] rounded-xl self-start sm:self-auto overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Barchasi ({presentations.length})
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === 'ready'
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Tayyor ({presentations.filter((p) => p.status === 'Tayyor').length})
            </button>
            <button
              onClick={() => setFilter('generating')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === 'generating'
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Jarayonda ({presentations.filter((p) => p.status === 'Jarayonda').length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === 'draft'
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              Qoralamalar ({presentations.filter((p) => p.status === 'Qoralama').length})
            </button>
          </div>

          {/* Search & View Switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#464555] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Taqdimot nomi bo'yicha..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-primary shadow-xs' : 'text-[#464555]'
                }`}
                title="Kataklar ko'rinishi"
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-primary shadow-xs' : 'text-[#464555]'
                }`}
                title="Jadval ko'rinishi"
              >
                <span className="material-symbols-outlined text-[20px]">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#f2f3ff] text-[#777587] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">folder_off</span>
            </div>
            <h3 className="font-headline-sm text-lg text-[#131b2e] font-bold">
              Hech qanday taqdimot topilmadi
            </h3>
            <p className="font-body-sm text-xs text-[#464555] max-w-sm">
              Qidiruv so'rovingizga mos slayd to'plami mavjud emas yoki bu toifada hali taqdimot yaratilmagan.
            </p>
            <button
              onClick={() => onNavigate('yangi-taqdimot')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-container transition-colors"
            >
              Yangi taqdimot yaratish
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-xs border border-[#eaedff] hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#e2dfff] text-primary font-code-md text-xs font-bold">
                      {item.id}
                    </span>
                    {item.status === 'Tayyor' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#005236] text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                        Tayyor (.pptx)
                      </span>
                    ) : item.status === 'Jarayonda' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-primary text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                        Jarayonda
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#464555] text-xs font-semibold">
                        Qoralama
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectPresentation(item)}
                    className="font-title-md text-base text-[#131b2e] font-bold text-left hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.title}
                  </button>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#464555]">
                    <span className="bg-[#f2f3ff] px-2 py-0.5 rounded font-semibold">
                      {item.grade}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{item.subject}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#f2f3ff] rounded-xl text-xs text-[#131b2e] mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">slideshow</span>
                      <span>{item.slideCount} ta slayd</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#006c49]">sports_esports</span>
                      <span>{item.quizQuestionsCount} ta viktorina</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f2f3ff]/60 border-t border-[#eaedff] flex items-center justify-between">
                  <span className="text-[11px] text-[#464555]">{item.date}</span>
                  <div className="flex items-center gap-1">
                    {item.status === 'Tayyor' && (
                      <button
                        onClick={() => onDownloadPptx(item)}
                        className="px-3 py-1.5 bg-primary text-white hover:bg-primary-container rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        title="Yuklab olish"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>.pptx</span>
                      </button>
                    )}
                    <button
                      onClick={() => onSelectPresentation(item)}
                      className="p-1.5 text-[#464555] hover:bg-white rounded-lg transition-colors"
                      title="Ko'rish"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button
                      onClick={() => onDeletePresentation(item.id)}
                      className="p-1.5 text-[#ba1a1a] hover:bg-white rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f3ff] text-[#464555] font-label-sm text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Taqdimot Nomi</th>
                    <th className="py-3 px-4">Sinf va Fan</th>
                    <th className="py-3 px-4">Slaydlar</th>
                    <th className="py-3 px-4">Viktorina</th>
                    <th className="py-3 px-4">Sana</th>
                    <th className="py-3 px-4">Holati</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f3ff]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                      <td className="py-4 px-4 font-title-md text-sm text-[#131b2e] font-bold">
                        <button
                          onClick={() => onSelectPresentation(item)}
                          className="hover:text-primary transition-colors text-left"
                        >
                          {item.title}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#464555]">
                        {item.grade} • {item.subject}
                      </td>
                      <td className="py-4 px-4 font-code-md text-xs text-[#131b2e] font-bold">
                        {item.slideCount} ta
                      </td>
                      <td className="py-4 px-4 text-xs">
                        {item.quizQuestionsCount > 0 ? `${item.quizQuestionsCount} ta savol` : "Yo'q"}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#464555]">{item.date}</td>
                      <td className="py-4 px-4 text-xs">
                        {item.status === 'Tayyor' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#005236] font-bold">
                            Tayyor
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-primary font-bold">
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.status === 'Tayyor' && (
                            <button
                              onClick={() => onDownloadPptx(item)}
                              className="px-2.5 py-1 bg-primary text-white rounded-lg text-xs font-bold"
                            >
                              .pptx
                            </button>
                          )}
                          <button
                            onClick={() => onSelectPresentation(item)}
                            className="p-1 text-[#464555] hover:bg-[#eaedff] rounded-lg"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            onClick={() => onDeletePresentation(item.id)}
                            className="p-1 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
