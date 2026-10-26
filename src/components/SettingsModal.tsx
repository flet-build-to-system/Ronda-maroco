import React from 'react';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  graphics: 'light' | 'medium' | 'nice' | 'auto';
  onChangeGraphics: (g: 'light' | 'medium' | 'nice' | 'auto') => void;
  athanPause: boolean;
  onToggleAthan: () => void;
  notifications: boolean;
  onToggleNotifications: () => void;
  playerName: string;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  onToggleSound,
  graphics,
  onChangeGraphics,
  athanPause,
  onToggleAthan,
  notifications,
  onToggleNotifications,
  playerName,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header */}
        <div className="text-center pb-2 border-b border-[#78350f]">
          <h2 className="text-3xl font-black text-[#fef08a]">الإعدادات</h2>
        </div>

        {/* Settings rows */}
        <div className="overflow-y-auto space-y-4 py-4 flex-1 pr-1 pl-1 text-sm">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between py-1 border-b border-[#78350f]/50">
            <span className="font-bold text-base text-amber-200">الصوت</span>
            <button
              onClick={onToggleSound}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                soundEnabled ? 'bg-emerald-600' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  soundEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-1 border-b border-[#78350f]/50">
            <span className="font-bold text-base text-amber-200">اللغة</span>
            <span className="font-bold text-yellow-400">الدارجة المغربية</span>
          </div>

          {/* Graphics Quality */}
          <div className="py-2 border-b border-[#78350f]/50">
            <div className="font-bold text-base text-amber-200 mb-1">الجرافيك</div>
            <div className="text-[11px] text-amber-400/80 mb-2">
              خفيف: للتيليفونات والتابليط الضعاف، أوتو يختار هنا: خفيف.
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'light' as const, label: 'خفيف' },
                { id: 'medium' as const, label: 'متوسط' },
                { id: 'nice' as const, label: 'زوين' },
                { id: 'auto' as const, label: 'أوتو' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onChangeGraphics(item.id)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border ${
                    graphics === item.id
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] border-yellow-300 shadow'
                      : 'bg-[#1f1008] text-amber-300 border-[#78350f] hover:border-amber-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Athan Pause */}
          <div className="flex items-center justify-between py-2 border-b border-[#78350f]/50">
            <div>
              <div className="font-bold text-base text-amber-200">الأذان وسط اللعب</div>
              <div className="text-[11px] text-amber-400/80">
                فـ وقت الصلاة ديال مدينتك، الطبلة كتسكت حتى يسالي الأذان.
              </div>
            </div>
            <button
              onClick={onToggleAthan}
              className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 mr-3 ${
                athanPause ? 'bg-emerald-600' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  athanPause ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between py-2 border-b border-[#78350f]/50">
            <div>
              <div className="font-bold text-base text-amber-200">الإشعارات</div>
              <div className="text-[11px] text-amber-400/80">ملي تتحل شي طبلة ولا شي واحد كيتسناك.</div>
            </div>
            <button
              onClick={onToggleNotifications}
              className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 mr-3 ${
                notifications ? 'bg-emerald-600' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  notifications ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Account Profile Save */}
          <div className="py-2 border-b border-[#78350f]/50">
            <div className="font-bold text-base text-amber-200 mb-1">حفظ التقدم ديالي</div>
            <div className="text-[11px] text-amber-400/80 mb-3">
              دخل بحسابك: سميتك، الربحات، الفلوس، الحانوت والشخصية ديالك كيتبعوك لأي تيليفون آخر.
            </div>
            <div className="w-full py-2.5 px-4 bg-white text-stone-800 font-bold rounded-xl flex items-center justify-center gap-2 shadow hover:bg-stone-100 cursor-pointer">
              <span className="text-blue-600 font-black">G</span>
              <span>كمّل بـ Google</span>
            </div>
            <div className="text-[10px] text-amber-500/80 text-center mt-1.5">
              غير الإيميل، السمية والتصويرة اللي كيتخدمو باش يتحفظ البروفيل ديالك.
            </div>
          </div>

          {/* Account details */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-amber-400">حسابي: {playerName}</span>
            <span className="text-xs text-red-400 hover:underline cursor-pointer">مسح الحساب ديالي</span>
          </div>
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
