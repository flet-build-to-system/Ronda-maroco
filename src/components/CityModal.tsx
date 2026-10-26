import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';

interface CityModalProps {
  currentCity: string;
  playerName: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
}

const MOROCCAN_CITIES = [
  { ar: 'زاكورة', en: 'Zagora' },
  { ar: 'الدار البيضاء', en: 'Casablanca' },
  { ar: 'الرباط', en: 'Rabat' },
  { ar: 'مراكش', en: 'Marrakech' },
  { ar: 'فاس', en: 'Fès' },
  { ar: 'طنجة', en: 'Tanger' },
  { ar: 'أكادير', en: 'Agadir' },
  { ar: 'مكناس', en: 'Meknès' },
  { ar: 'وجدة', en: 'Oujda' },
  { ar: 'القنيطرة', en: 'Kénitra' },
  { ar: 'تطوان', en: 'Tétouan' },
  { ar: 'سلا', en: 'Salé' },
  { ar: 'الناظور', en: 'Nador' },
  { ar: 'ورزازات', en: 'Ouarzazate' },
  { ar: 'العيون', en: 'Laâyoune' },
  { ar: 'الداخلة', en: 'Dakhla' },
  { ar: 'الصويرة', en: 'Essaouira' },
  { ar: 'الجديدة', en: 'El Jadida' },
  { ar: 'بني ملال', en: 'Béni Mellal' },
  { ar: 'شفشاون', en: 'Chefchaouen' },
];

export const CityModal: React.FC<CityModalProps> = ({
  currentCity,
  playerName,
  onSelectCity,
  onClose,
}) => {
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [searchQuery, setSearchQuery] = useState('');

  const quickCities = ['فاس', 'مراكش', 'الرباط', 'الدار البيضاء', 'وجدة', 'مكناس', 'أكادير', 'طنجة', 'الناظور', 'سلا', 'تطوان', 'القنيطرة'];

  const filteredCities = MOROCCAN_CITIES.filter(
    c => c.ar.includes(searchQuery) || c.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header matching screenshot 10 */}
        <div className="text-center pb-2">
          <h2 className="text-2xl font-black text-[#fef08a] mb-0.5">المدينة ديالي 📍</h2>
          <div className="text-xs text-amber-400">كتبان حدا سميتك، الفوق فالشاشة، فاللعب.</div>
        </div>

        {/* Preview Card */}
        <div className="my-3 p-3 bg-[#160b06] border border-[#78350f] rounded-2xl text-center">
          <span className="text-[11px] text-amber-400 font-bold block mb-1">كيفاش غادي تبان</span>
          <div className="inline-block bg-[#27170e] border-2 border-yellow-500/70 rounded-xl px-5 py-2 shadow-inner">
            <div className="text-xs font-mono font-bold text-amber-300">{playerName.toUpperCase()}</div>
            <div className="text-2xl font-black text-amber-100 font-mono my-0.5">0<span className="text-sm font-normal text-amber-400">/21</span></div>
            <div className="inline-flex items-center gap-1 bg-[#451a03] px-3 py-0.5 rounded-full border border-yellow-600 text-xs font-bold text-yellow-300">
              <span>🇲🇦</span>
              <span>{selectedCity}</span>
            </div>
          </div>
        </div>

        {/* Country Selector */}
        <div className="mb-3">
          <span className="text-xs font-bold text-amber-300 block mb-1">البلاد</span>
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1f1008] border border-[#78350f] rounded-xl text-sm font-bold text-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇲🇦</span>
              <span>المغرب</span>
            </div>
            <span className="text-xs text-amber-500">›</span>
          </div>
        </div>

        {/* City Search */}
        <div className="mb-2">
          <span className="text-xs font-bold text-amber-300 block mb-1">المدينة</span>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="...قلّب على مدينة"
              className="w-full bg-[#1f1008] border border-[#78350f] rounded-xl px-4 py-2 text-sm text-amber-100 placeholder-amber-600 focus:outline-none focus:border-yellow-400 pr-9 text-right"
            />
            <Search className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Quick City Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3 max-h-20 overflow-y-auto">
          {quickCities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                selectedCity === city
                  ? 'bg-yellow-500 text-[#451a03] font-black border-yellow-300 shadow'
                  : 'bg-[#1f1008] text-amber-300 border-[#78350f] hover:border-amber-500'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* City List */}
        <div className="overflow-y-auto space-y-1 flex-1 pr-1 pl-1 max-h-40 border-t border-[#78350f]/60 pt-2">
          {filteredCities.map(c => {
            const isSelected = selectedCity === c.ar;
            return (
              <div
                key={c.ar}
                onClick={() => setSelectedCity(c.ar)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#59320e] text-yellow-300 font-black' : 'hover:bg-[#1f1008] text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected && <Check className="w-4 h-4 text-yellow-400" />}
                  <span className="text-sm">{c.ar}</span>
                </div>
                <span className="text-xs font-mono text-amber-400/80">{c.en}</span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#451a03] text-amber-200 font-black text-base rounded-2xl border border-amber-600 hover:bg-[#59320e] active:scale-98 shadow-md"
          >
            رجع
          </button>
          <button
            onClick={() => {
              onSelectCity(selectedCity);
              onClose();
            }}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] font-black text-base rounded-2xl border-2 border-yellow-300 hover:brightness-110 active:scale-98 shadow-md"
          >
            سجّل
          </button>
        </div>

        <button
          onClick={() => {
            onSelectCity('');
            onClose();
          }}
          className="text-center text-[11px] text-amber-500 hover:text-amber-300 underline mt-2 block"
        >
          ما تبيّنش المدينة ديالي
        </button>
      </div>
    </div>
  );
};
