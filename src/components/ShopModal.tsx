import React from 'react';
import { CardBackStyle, CafeCupStyle, GameLocation } from '../types/cards';
import { soundManager } from '../utils/audio';
import { Lock, Check } from 'lucide-react';

interface ShopModalProps {
  coins: number;
  unlockedBacks: CardBackStyle[];
  activeBack: CardBackStyle;
  onSelectBack: (back: CardBackStyle) => void;
  onBuyBack: (back: CardBackStyle, cost: number) => void;
  activeCup: CafeCupStyle;
  onSelectCup: (cup: CafeCupStyle) => void;
  onBuyCup: (cup: CafeCupStyle, cost: number) => void;
  unlockedCups: CafeCupStyle[];
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  unlockedBacks,
  activeBack,
  onSelectBack,
  onBuyBack,
  activeCup,
  onSelectCup,
  onBuyCup,
  unlockedCups,
  onClose,
}) => {
  const cardBacks: { id: CardBackStyle; name: string; desc: string; cost: number; color: string }[] = [
    { id: 'classic', name: 'كلاسيك', desc: 'الضهر الأصلي التقليدي', cost: 0, color: 'bg-slate-400' },
    { id: 'zellij', name: 'الزليج', desc: 'نجمة بتمن رؤوس مغربية', cost: 30, color: 'bg-amber-800' },
    { id: 'leather', name: 'الجلد المنقوش', desc: 'جلد الصناع التقليديين', cost: 48, color: 'bg-amber-950' },
    { id: 'mint', name: 'النعناع', desc: 'خضرة أتاي المغربي', cost: 118, color: 'bg-emerald-800' },
    { id: 'night', name: 'الليل', desc: 'سما عامرة بالنجوم', cost: 70, color: 'bg-slate-900' },
  ];

  const cafeCups: { id: CafeCupStyle; name: string; desc: string; cost: number; emoji: string }[] = [
    { id: 'chamali', name: 'أتاي شمالي', desc: 'الكاس المذهب كيرخوا مع اللعب', cost: 15, emoji: '🍵' },
    { id: 'dentelle', name: 'كاس الدنتيل', desc: 'أتاي فكاس منقوش بالفضة', cost: 30, emoji: '☕' },
    { id: 'zellij_cup', name: 'كاس الزليج', desc: 'أتاي فكاس مزوق بالزليج', cost: 8, emoji: '🫖' },
    { id: 'noss_noss', name: 'نص نص', desc: 'نص قهوة ونص حليب', cost: 20, emoji: '🥛' },
    { id: 'talyan', name: 'قهوة طاليان', desc: 'قهوة الصباح المعصرة', cost: 25, emoji: '☕' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header */}
        <div className="text-center pb-3 border-b border-[#78350f]">
          <h2 className="text-3xl font-black text-[#fef08a] mb-1">الحانوت</h2>
          <div className="inline-flex items-center gap-2 bg-[#451a03] px-4 py-1 rounded-full border border-yellow-500 shadow-inner">
            <span className="text-yellow-400 font-bold text-sm">3 ربحات أونلاين</span>
            <span className="text-yellow-200 font-extrabold text-base font-mono">{coins} فلوس 🪙</span>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto space-y-6 py-4 flex-1 pr-1 pl-1">
          {/* Card Backs Section */}
          <div>
            <h3 className="text-lg font-black text-amber-300 text-center mb-3">ضهر الكارطة</h3>
            <div className="grid grid-cols-2 gap-3">
              {cardBacks.map(back => {
                const isUnlocked = unlockedBacks.includes(back.id);
                const isSelected = activeBack === back.id;
                const canAfford = coins >= back.cost;

                return (
                  <div
                    key={back.id}
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectBack(back.id);
                        soundManager.playCardSnap();
                      } else if (canAfford) {
                        onBuyBack(back.id, back.cost);
                      }
                    }}
                    className={`relative p-3 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-yellow-400 bg-[#451a03] shadow-lg scale-102 ring-2 ring-yellow-400/40'
                        : isUnlocked
                        ? 'border-[#78350f] bg-[#1f1008] hover:border-amber-600'
                        : 'border-[#59320e] bg-[#160b06] opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-12 rounded-lg ${back.color} border border-amber-300 flex items-center justify-center shadow`}>
                        {isSelected && <Check className="w-4 h-4 text-yellow-300" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-amber-200">{back.name}</div>
                        <div className="text-[10px] text-amber-400/80 leading-tight">{back.desc}</div>
                      </div>
                    </div>

                    <div className="text-center pt-2 border-t border-[#78350f]/60">
                      {isSelected ? (
                        <span className="text-xs font-black text-emerald-400">محطوط</span>
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold text-yellow-300">اختيار</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
                          <Lock className="w-3 h-3" />
                          <span>{back.cost} فلوس</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Drinks Section */}
          <div>
            <h3 className="text-lg font-black text-amber-300 text-center mb-1">اللي كيتتحط فالطبلة</h3>
            <p className="text-[11px] text-center text-amber-400/80 mb-3">
              كيسان أتاي كيتشراو بالفلوس، كيزوقو الطبلة وكيخلقو أجواء القهوة المغربية
            </p>
            <div className="grid grid-cols-2 gap-3">
              {cafeCups.map(cup => {
                const isUnlocked = unlockedCups.includes(cup.id);
                const isSelected = activeCup === cup.id;
                const canAfford = coins >= cup.cost;

                return (
                  <div
                    key={cup.id}
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectCup(cup.id);
                        soundManager.playCoin();
                      } else if (canAfford) {
                        onBuyCup(cup.id, cup.cost);
                      }
                    }}
                    className={`relative p-3 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-yellow-400 bg-[#451a03] shadow-lg scale-102 ring-2 ring-yellow-400/40'
                        : isUnlocked
                        ? 'border-[#78350f] bg-[#1f1008] hover:border-amber-600'
                        : 'border-[#59320e] bg-[#160b06] opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{cup.emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-amber-200">{cup.name}</div>
                        <div className="text-[10px] text-amber-400/80 leading-tight">{cup.desc}</div>
                      </div>
                    </div>

                    <div className="text-center pt-2 border-t border-[#78350f]/60">
                      {isSelected ? (
                        <span className="text-xs font-black text-emerald-400">فوق الطبلة</span>
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold text-yellow-300">حط فوق الطبلة</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
                          <Lock className="w-3 h-3" />
                          <span>{cup.cost} فلوس</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-3 bg-gradient-to-r from-[#92400e] to-[#78350f] text-yellow-200 font-black text-lg rounded-2xl border-2 border-amber-600 hover:brightness-110 active:scale-98 shadow-xl"
        >
          رجع
        </button>
      </div>
    </div>
  );
};
