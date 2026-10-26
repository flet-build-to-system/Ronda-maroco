import React from 'react';
import { GameLocation } from '../types/cards';
import { Check, Lock } from 'lucide-react';

interface LocationsModalProps {
  currentLocation: GameLocation;
  onSelectLocation: (loc: GameLocation) => void;
  onClose: () => void;
}

export const LocationsModal: React.FC<LocationsModalProps> = ({
  currentLocation,
  onSelectLocation,
  onClose,
}) => {
  const locations: { id: GameLocation; name: string; desc: string; unlocked: boolean; req: string; bg: string }[] = [
    {
      id: 'cafe',
      name: 'القهوة',
      desc: 'البلاصة ديال ديما، الزليج وكيسان أتاي',
      unlocked: true,
      req: '',
      bg: 'from-amber-900 to-amber-950',
    },
    {
      id: 'terrace',
      name: 'التيراس',
      desc: 'البحيرة، من النهار حتى لليل والنسيم',
      unlocked: true,
      req: '',
      bg: 'from-blue-900 to-cyan-950',
    },
    {
      id: 'salon',
      name: 'الصالون',
      desc: 'السداري، الزليج والزربية المغربية',
      unlocked: true,
      req: '',
      bg: 'from-emerald-950 to-amber-950',
    },
    {
      id: 'riad',
      name: 'الرياض',
      desc: 'الخصة، شجر الليمون والزليج الفاسي',
      unlocked: true,
      req: '20 ربحة أونلاين',
      bg: 'from-amber-950 to-teal-950',
    },
    {
      id: 'blue_city',
      name: 'المدينة الزرقاء',
      desc: 'السطوحا الزرقين، ومش ناعس فوق الحيط (شفشاون)',
      unlocked: true,
      req: '20 ربحة أونلاين',
      bg: 'from-blue-900 to-indigo-950',
    },
    {
      id: 'mogador',
      name: 'مرسى موكادور',
      desc: 'السور التاريخي، المدافع والبحر الصويرة',
      unlocked: false,
      req: '40 ربحة أونلاين',
      bg: 'from-stone-800 to-cyan-950',
    },
    {
      id: 'tent',
      name: 'الخيمة',
      desc: 'خيمة وسط الرملة، والعافية شاعلة فالصحراء',
      unlocked: false,
      req: '40 ربحة أونلاين',
      bg: 'from-yellow-950 to-orange-950',
    },
    {
      id: 'bouregreg',
      name: 'ضفة بورقراق',
      desc: 'نزاهة حدا الواد وصومعة حسان',
      unlocked: false,
      req: '57 ربحة أونلاين',
      bg: 'from-sky-950 to-teal-950',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header */}
        <div className="text-center pb-2 border-b border-[#78350f]">
          <h2 className="text-3xl font-black text-[#fef08a] mb-1">البلاصة</h2>
          <div className="text-xs text-amber-300">بدّل الصالون والأجواء المغربية اللي كتلعب فيها</div>
        </div>

        {/* Locations List */}
        <div className="overflow-y-auto space-y-2.5 py-4 flex-1 pr-1 pl-1">
          {locations.map(loc => {
            const isSelected = currentLocation === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => {
                  if (loc.unlocked) {
                    onSelectLocation(loc.id);
                  }
                }}
                className={`relative p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 shadow-lg scale-101 ring-2 ring-yellow-400/50'
                    : loc.unlocked
                    ? 'border-[#78350f] bg-[#1a0e07] hover:border-amber-500 cursor-pointer'
                    : 'border-[#59320e] bg-[#140b06] opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${loc.bg} border border-amber-600 flex items-center justify-center text-lg shadow`}>
                    🏛️
                  </div>
                  <div>
                    <div className="font-extrabold text-base text-amber-200">{loc.name}</div>
                    <div className="text-xs text-amber-400/80 leading-snug">{loc.desc}</div>
                    {!loc.unlocked && (
                      <div className="text-[10px] text-yellow-400 font-bold mt-0.5">{loc.req}</div>
                    )}
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <span className="w-8 h-8 rounded-full bg-yellow-400 text-stone-900 flex items-center justify-center shadow">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </span>
                  ) : !loc.unlocked ? (
                    <span className="w-8 h-8 rounded-full bg-stone-800 text-amber-500 flex items-center justify-center border border-stone-700">
                      <Lock className="w-4 h-4" />
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Return Button */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-2 bg-gradient-to-r from-[#92400e] to-[#78350f] text-yellow-200 font-black text-lg rounded-2xl border-2 border-amber-600 hover:brightness-110 active:scale-98 shadow-xl"
        >
          رجع
        </button>
      </div>
    </div>
  );
};
