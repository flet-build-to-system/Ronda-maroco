import React, { useState } from 'react';
import { HezJoujGame } from '../game/hezJoujEngine';
import { Card, Suit } from '../types/cards';
import { drawCardFaceCanvas } from '../utils/cardDeck';
import { X, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HezJoujViewProps {
  onBack: () => void;
  onRewardCoins: (amount: number) => void;
  onOpenRules: () => void;
}

export const HezJoujView: React.FC<HezJoujViewProps> = ({ onBack, onRewardCoins, onOpenRules }) => {
  const [game, setGame] = useState<HezJoujGame>(() => new HezJoujGame());
  const [suitPickerOpen, setSuitPickerOpen] = useState(false);
  const [pendingCardIdFor7, setPendingCardIdFor7] = useState<string | null>(null);
  const [, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  const humanPlayer = game.players[0];
  const robio = game.players[1];
  const abrou9a = game.players[2];

  const handleCardClick = (card: Card) => {
    if (game.currentTurnIndex !== 0 || game.gameOver) return;
    if (!game.canPlayCard(card)) return;

    if (card.rank === 7) {
      setPendingCardIdFor7(card.id);
      setSuitPickerOpen(true);
      return;
    }

    game.playCard(0, card.id);
    refresh();

    if (game.winner?.id === 'p0') {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      onRewardCoins(50);
    }
  };

  const handleSuitPick = (suit: Suit) => {
    if (pendingCardIdFor7) {
      game.playCard(0, pendingCardIdFor7, suit);
      setSuitPickerOpen(false);
      setPendingCardIdFor7(null);
      refresh();
      if (game.winner?.id === 'p0') {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        onRewardCoins(50);
      }
    }
  };

  const handleDrawCard = () => {
    if (game.currentTurnIndex !== 0 || game.gameOver) return;
    game.drawCard(0);
    refresh();
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-3 select-none pointer-events-none z-20">
      {/* Top Player: Robio */}
      <div className="flex flex-col items-center pt-2">
        {/* Robio Speech Bubble */}
        {robio?.speech && (
          <div className="relative bg-[#fffbeb] text-[#451a03] font-bold text-sm px-5 py-2 rounded-2xl shadow-xl border-2 border-[#b45309] text-center max-w-xs pointer-events-auto mb-2 animate-bounce-short">
            <span className="text-xs text-red-600 block font-black">ROBIO</span>
            {robio.speech}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#fffbeb] border-r-2 border-b-2 border-[#b45309] rotate-45"></div>
          </div>
        )}

        {/* Robio Avatar Badge */}
        <div className="flex items-center gap-2 bg-[#27170e]/95 px-4 py-1.5 rounded-full border border-amber-600 shadow-md">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-extrabold text-amber-200 text-sm">Robio</span>
          <span className="bg-amber-800 text-yellow-300 text-xs px-2 py-0.5 rounded-full font-mono">
            🂠 {robio.hand.length}
          </span>
        </div>
      </div>

      {/* Middle Playing Field */}
      <div className="relative my-auto flex flex-col items-center justify-center">
        {/* Big Stacking Penalty Badge (e.g. هزة ×6) */}
        {game.announcement && (
          <div className="absolute -top-12 z-30 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-[#451a03] font-black text-2xl md:text-3xl px-8 py-2.5 rounded-2xl shadow-2xl border-4 border-yellow-200 animate-bounce">
            {game.announcement}
          </div>
        )}

        {/* Left Player: 3abrou9a */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          {abrou9a?.speech && (
            <div className="bg-[#fffbeb] text-[#451a03] text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-600 shadow max-w-[120px]">
              {abrou9a.speech}
            </div>
          )}
          <div className="bg-[#27170e]/90 px-3 py-1 rounded-full border border-amber-600 text-amber-200 text-xs font-bold">
            3abrou9a 🂠 {abrou9a.hand.length}
          </div>
        </div>

        {/* Table Center: Discard Pile & Draw Deck */}
        <div className="flex items-center gap-4 p-4 bg-[#451a03]/80 rounded-3xl border-2 border-[#b45309] shadow-2xl pointer-events-auto">
          {/* Top Played Card */}
          {game.topCard && (
            <div className="relative group">
              <img
                src={drawCardFaceCanvas(game.topCard, 140, 210).toDataURL()}
                alt={game.topCard.nameAr}
                className="w-24 h-36 rounded-xl shadow-2xl border-2 border-yellow-300 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-900 border border-yellow-400 text-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                حاكم بـ {game.activeSuit === 'gold' ? 'الذهب' : game.activeSuit === 'cups' ? 'الكاس' : game.activeSuit === 'swords' ? 'السيف' : 'الزرواطة'}
              </div>
            </div>
          )}

          {/* Draw Deck */}
          <button
            onClick={handleDrawCard}
            className="w-24 h-36 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-amber-400 flex flex-col items-center justify-center text-amber-200 font-black shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="text-xl">🂠</span>
            <span className="text-xs mt-1">هز ورقة</span>
            {game.pendingDrawCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-mono mt-1 animate-pulse">
                +{game.pendingDrawCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Human Player Hand (Bottom) */}
      <div className="flex flex-col items-center pb-2 pointer-events-auto">
        <div className="bg-[#27170e]/90 text-amber-200 text-xs font-bold px-4 py-1 rounded-full border border-amber-600 mb-2 shadow">
          {game.currentTurnIndex === 0 ? 'نوبتك، لوح ورقة بحال النوع ولا الرقم!' : 'نوبة الخصم...'}
        </div>

        {/* Hand Cards */}
        <div className="flex items-center justify-center -space-x-4 max-w-full overflow-x-auto py-2 px-4">
          {humanPlayer.hand.map((card, idx) => {
            const canPlay = game.currentTurnIndex === 0 && game.canPlayCard(card);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={!canPlay}
                style={{ zIndex: idx }}
                className={`transition-all duration-200 transform ${
                  canPlay
                    ? 'hover:-translate-y-4 hover:scale-110 ring-2 ring-yellow-400 cursor-pointer'
                    : 'opacity-65 grayscale-[30%] cursor-not-allowed'
                }`}
              >
                <img
                  src={drawCardFaceCanvas(card, 130, 195).toDataURL()}
                  alt={card.nameAr}
                  className="w-20 h-30 rounded-lg shadow-xl border border-slate-700 object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between w-full max-w-md mt-2">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-[#27170e]/90 text-amber-200 flex items-center justify-center border-2 border-[#b45309] hover:bg-[#3d2417] active:scale-95 shadow-lg"
            title="رجوع للروندا"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenRules}
            className="w-11 h-11 rounded-full bg-[#27170e]/90 text-amber-200 flex items-center justify-center border-2 border-[#b45309] hover:bg-[#3d2417] active:scale-95 shadow-lg"
            title="قوانين جبن كرع"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suit Picker Modal when playing 7 */}
      {suitPickerOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-[#27170e] border-3 border-yellow-400 rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl">
            <h3 className="text-xl font-black text-amber-200 mb-4">بآش بغيتي تحكم؟ 👑</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { suit: 'gold' as Suit, name: 'الذهب (دينار)', color: 'bg-amber-600' },
                { suit: 'cups' as Suit, name: 'الكاس', color: 'bg-red-600' },
                { suit: 'swords' as Suit, name: 'السيف', color: 'bg-blue-600' },
                { suit: 'clubs' as Suit, name: 'الزرواطة', color: 'bg-emerald-600' },
              ].map(s => (
                <button
                  key={s.suit}
                  onClick={() => handleSuitPick(s.suit)}
                  className={`py-3 px-2 rounded-xl text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform ${s.color}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Victory / Defeat Modal */}
      {game.gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-gradient-to-b from-[#3d2417] to-[#1c1109] border-4 border-[#eab308] rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-2xl font-black text-amber-200 mb-2">
              {game.winner?.id === 'p0' ? 'ربحتي جبن كرع! 🎉' : `${game.winner?.name} هو اللي ربح!`}
            </h2>
            <p className="text-amber-100 text-sm mb-4">
              {game.winner?.id === 'p0'
                ? 'ساليتي وراقك كاملين وربحتي 50+ فلوس على روبيو وعبروقة!'
                : 'روبيو قالك: شفتي؟ حتى لمرة أخرى ونتفاهمو مزيان!'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  game.startNewGame();
                  refresh();
                }}
                className="flex-1 py-3 bg-[#eab308] text-[#451a03] font-black rounded-xl hover:bg-yellow-400 active:scale-95 shadow-lg"
              >
                نعاودو بارتية
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-[#78350f] text-amber-100 font-black rounded-xl hover:bg-[#92400e] active:scale-95 border border-amber-600"
              >
                رجوع للروندا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
