import React, { useState } from 'react';
import { GameOptions, GameLocation } from '../types/cards';
import { soundManager } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Settings,
  ChevronDown,
  ChevronUp,
  Trophy,
  Coffee,
  Users,
  BookOpen,
  Play,
  Globe,
  Radio,
} from 'lucide-react';

interface MainGameMenuProps {
  playerName: string;
  playerCity: string;
  is4Players: boolean;
  setIs4Players: (val: boolean) => void;
  targetScore: number;
  setTargetScore: (val: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (val: 'easy' | 'medium' | 'hard') => void;
  location: GameLocation;
  options: GameOptions;
  setOptions: React.Dispatch<React.SetStateAction<GameOptions>>;
  onStartGame: () => void;
  onStartDama: () => void;
  onStartHezJouj: () => void;
  onOpenLocations: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenCityModal: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  radioEnabled: boolean;
  onToggleRadio: () => void;
}

export const MainGameMenu: React.FC<MainGameMenuProps> = ({
  playerName,
  playerCity,
  is4Players,
  setIs4Players,
  targetScore,
  setTargetScore,
  difficulty,
  setDifficulty,
  location,
  options,
  setOptions,
  onStartGame,
  onStartDama,
  onStartHezJouj,
  onOpenLocations,
  onOpenShop,
  onOpenLeaderboard,
  onOpenCityModal,
  onOpenSettings,
  onOpenRules,
  soundEnabled,
  onToggleSound,
  radioEnabled,
  onToggleRadio,
}) => {
  const [optionsOpen, setOptionsOpen] = useState(false);

  const locationNames: Record<GameLocation, string> = {
    cafe: 'القهوة',
    terrace: 'التيراس',
    salon: 'الصالون',
    riad: 'الرياض',
    blue_city: 'المدينة الزرقاء',
    mogador: 'مرسى موكادور',
    tent: 'الخيمة',
    bouregreg: 'ضفة بورقراق',
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 select-none overflow-y-auto max-w-md mx-auto">
      {/* Top Header Bar matching screenshot 4 */}
      <div className="flex items-center justify-between gap-2 pt-1 pb-2">
        {/* Player Profile & City */}
        <button
          onClick={onOpenCityModal}
          className="flex items-center gap-2 bg-[#27170e]/95 px-3 py-1.5 rounded-full border border-amber-600/80 shadow hover:border-yellow-400 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 border border-yellow-200 flex items-center justify-center font-bold text-xs text-[#27170e]">
            👤
          </div>
          <div className="text-right">
            <div className="font-extrabold text-xs text-amber-100 font-mono leading-none">{playerName}</div>
            <div className="text-[10px] text-yellow-400 mt-0.5">
              {playerCity ? `🇲🇦 ${playerCity}` : 'الشخصية ديالي'}
            </div>
          </div>
        </button>

        {/* Moroccan Flag & Language */}
        <div className="flex items-center gap-1.5 bg-[#27170e]/95 px-3 py-1.5 rounded-full border border-amber-600/80 shadow">
          <span className="text-base">🇲🇦</span>
          <span className="font-bold text-xs text-amber-200">الدارجة</span>
        </div>

        {/* Controls: Audio, Radio & Settings */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleRadio}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow transition-all ${
              radioEnabled
                ? 'bg-amber-500 text-stone-900 border-yellow-200 animate-pulse'
                : 'bg-[#27170e]/95 text-amber-300 border-amber-600/80 hover:bg-[#3d2417]'
            }`}
            title="راديو القهوة المغربية"
          >
            <Radio className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-full bg-[#27170e]/95 text-amber-300 flex items-center justify-center border border-amber-600/80 hover:bg-[#3d2417] shadow"
            title="الصوت"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-[#27170e]/95 text-amber-300 flex items-center justify-center border border-amber-600/80 hover:bg-[#3d2417] shadow"
            title="الإعدادات"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arch Frame Menu matching screenshot 4 & 9 */}
      <div className="bg-gradient-to-b from-[#2a170e]/95 via-[#1c0f08]/95 to-[#120a05]/95 border-3 border-[#b45309] rounded-[36px] p-4 shadow-2xl flex flex-col gap-3 backdrop-blur-sm">
        {/* Title Lockup */}
        <div className="text-center pt-1">
          <h1 className="text-5xl font-black text-[#fef08a] tracking-wide drop-shadow-md font-['Changa',sans-serif]">
            روندا
          </h1>
          <div className="text-xs font-bold text-amber-300 tracking-wider -mt-1">
            قهوة مغربية
          </div>
        </div>

        {/* 2x2 Grid Selectors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Rules */}
          <div className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-400 font-bold">القانون</div>
              <div className="font-black text-sm text-amber-100">عادي</div>
            </div>
            <ChevronDown className="w-4 h-4 text-amber-500" />
          </div>

          {/* Players */}
          <div
            onClick={() => {
              setIs4Players(!is4Players);
              soundManager.playCardSnap();
            }}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-yellow-500 transition-colors"
          >
            <div>
              <div className="text-[10px] text-amber-400 font-bold">اللاعبين</div>
              <div className="font-black text-sm text-amber-100">
                {is4Players ? '4 لاعبين ، 2ض2' : '2 لاعبين (1ض1)'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-amber-500" />
          </div>

          {/* Target Score */}
          <div
            onClick={() => {
              setTargetScore(targetScore === 21 ? 41 : 21);
              soundManager.playCardSnap();
            }}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-yellow-500 transition-colors"
          >
            <div>
              <div className="text-[10px] text-amber-400 font-bold">الهدف</div>
              <div className="font-black text-sm text-amber-100">{targetScore} نقطة</div>
            </div>
            <ChevronDown className="w-4 h-4 text-amber-500" />
          </div>

          {/* Difficulty */}
          <div
            onClick={() => {
              const next = difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy';
              setDifficulty(next);
              soundManager.playCardSnap();
            }}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-yellow-500 transition-colors"
          >
            <div>
              <div className="text-[10px] text-amber-400 font-bold">المستوى</div>
              <div className="font-black text-sm text-amber-100">
                {difficulty === 'easy' ? 'ساهل' : difficulty === 'medium' ? 'متوسط' : 'واعر'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        {/* Location Selector (البلاصة) */}
        <div
          onClick={onOpenLocations}
          className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-yellow-500 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-7 rounded-lg bg-amber-800 border border-yellow-400 flex items-center justify-center text-sm shadow">
              🏛️
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold">البلاصة</div>
              <div className="font-black text-sm text-amber-100">{locationNames[location]}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-amber-500" />
        </div>

        {/* Game Options Drawer Toggle ("خيارات اللعب") matching screenshot 9 */}
        <div className="border border-[#78350f] rounded-2xl overflow-hidden bg-[#180d07]">
          <button
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-black text-amber-200 hover:text-yellow-300 transition-colors"
          >
            <span>خيارات اللعب</span>
            <div className="flex items-center gap-1 text-[11px] text-amber-400">
              <span>ضربة ورجعة</span>
              {optionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {optionsOpen && (
            <div className="p-3 border-t border-[#78350f]/80 space-y-3 text-xs text-amber-200 bg-[#140b06]">
              {/* Darb w Rja3 Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-100">ضربة ورجعة</div>
                  <div className="text-[10px] text-amber-400/80">هاك هادي 1+، زيد هادي 5+، عشرة 10+</div>
                </div>
                <input
                  type="checkbox"
                  checked={options.darbWRja3}
                  onChange={e => setOptions(o => ({ ...o, darbWRja3: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* 4 Cards Version */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-100">نسخة 4 كارطات</div>
                  <div className="text-[10px] text-amber-400/80">بـ 4 لاعبين: 4 كارطات لكل واحد</div>
                </div>
                <input
                  type="checkbox"
                  checked={options.fourCardsVersion}
                  onChange={e => setOptions(o => ({ ...o, fourCardsVersion: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Table Talk */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-100">الهدرة فالطبلة</div>
                  <div className="text-[10px] text-amber-400/80">شي أمثال وشي كلام مغربي فاللعب</div>
                </div>
                <input
                  type="checkbox"
                  checked={options.tableTalk}
                  onChange={e => setOptions(o => ({ ...o, tableTalk: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Speed Buttons */}
              <div>
                <div className="font-bold text-amber-100 mb-1">سرعة الحركات</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['slow', 'normal', 'fast'] as const).map(spd => (
                    <button
                      key={spd}
                      onClick={() => setOptions(o => ({ ...o, speed: spd }))}
                      className={`py-1 rounded-xl text-xs font-black transition-all ${
                        options.speed === spd
                          ? 'bg-yellow-500 text-stone-900 shadow'
                          : 'bg-[#1f1008] text-amber-300 border border-[#78350f]'
                      }`}
                    >
                      {spd === 'slow' ? 'بشوية' : spd === 'normal' ? 'عادية' : 'سريعة'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Play Button (لعب) */}
        <button
          onClick={onStartGame}
          className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-[#451a03] font-black text-xl rounded-2xl shadow-xl border-2 border-yellow-200 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>لعب</span>
          <Play className="w-5 h-5 fill-current" />
        </button>

        {/* Play Online Button */}
        <button
          onClick={onStartGame}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-black text-sm rounded-2xl shadow-md border border-sky-400 hover:brightness-110 active:scale-98 transition-all flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <div className="text-right">
              <div className="leading-tight">لعب أونلاين <span className="text-[10px] bg-emerald-400 text-stone-900 px-1.5 py-0.2 rounded-full font-bold">مباشر</span></div>
              <div className="text-[10px] text-sky-200 font-normal">تلاقى مع لاعبين بحالك</div>
            </div>
          </div>
          <span className="text-sm">›</span>
        </button>

        {/* 4 Bottom Navigation Buttons matching screenshot 4 */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={onOpenLeaderboard}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2 flex flex-col items-center justify-center text-amber-200 hover:border-yellow-400 active:scale-95 transition-all shadow"
          >
            <Trophy className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-[11px] font-bold">الترتيب</span>
          </button>

          <button
            onClick={onOpenShop}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2 flex flex-col items-center justify-center text-amber-200 hover:border-yellow-400 active:scale-95 transition-all shadow"
          >
            <Coffee className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[11px] font-bold">الحانوت</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2 flex flex-col items-center justify-center text-amber-200 hover:border-yellow-400 active:scale-95 transition-all shadow"
          >
            <Users className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-[11px] font-bold">الجماعة</span>
          </button>

          <button
            onClick={onOpenRules}
            className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-2 flex flex-col items-center justify-center text-amber-200 hover:border-yellow-400 active:scale-95 transition-all shadow"
          >
            <BookOpen className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[11px] font-bold">القوانين</span>
          </button>
        </div>

        {/* 2 Feature Cards for Minigames (Hez Jouj & Dama) matching screenshot 4 */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Hez Jouj Minigame Card */}
          <div
            onClick={onStartHezJouj}
            className="relative bg-gradient-to-br from-[#3d1808] to-[#1f0c04] border-2 border-amber-600/80 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer hover:border-yellow-400 active:scale-98 transition-all shadow-lg overflow-hidden group"
          >
            <div className="absolute top-1 right-1 bg-yellow-400 text-stone-900 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow">
              جديد
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-200 mt-2">
              <span>🂠</span>
              <span>HEZ JOUJ</span>
            </div>
            <div className="text-[10px] text-amber-400 font-bold mt-1">كارتة القهاوي فابور</div>
          </div>

          {/* Dama Minigame Card */}
          <div
            onClick={onStartDama}
            className="relative bg-gradient-to-br from-[#3d1808] to-[#1f0c04] border-2 border-amber-600/80 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer hover:border-yellow-400 active:scale-98 transition-all shadow-lg overflow-hidden group"
          >
            <div className="absolute top-1 left-1 bg-[#451a03] border border-yellow-500 text-yellow-300 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow">
              🪙 +50
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-200 mt-2">
              <span>♟️</span>
              <span>الضامة</span>
            </div>
            <div className="text-[10px] text-amber-400 font-bold mt-1">مع الحاج براهيم</div>
          </div>
        </div>

        {/* Footer info matching screenshot 4 */}
        <div className="text-center text-[10px] text-amber-500/70 pt-1">
          روندا 1.46.3 • Yamano
        </div>
      </div>
    </div>
  );
};
