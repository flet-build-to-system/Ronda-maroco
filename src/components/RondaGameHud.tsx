import React from 'react';
import { RondaGame, TurnActionFeedback } from '../game/rondaEngine';
import { Card, CardBackStyle } from '../types/cards';
import { drawCardFaceCanvas } from '../utils/cardDeck';
import {
  Menu,
  Camera,
  Eye,
  Wand2,
  Lightbulb,
  Radio,
  Volume2,
  VolumeX,
  Trophy,
} from 'lucide-react';

interface RondaGameHudProps {
  game: RondaGame;
  humanPlayerCards: Card[];
  onPlayCard: (cardId: string) => void;
  onOpenMenu: () => void;
  onToggleCamera: () => void;
  onToggleRadio: () => void;
  radioEnabled: boolean;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onStartDama: () => void;
  onStartHezJouj: () => void;
  onGetPartnerHint: () => void;
  partnerHintText: string | null;
  lastFeedback: TurnActionFeedback | null;
  onRestart: () => void;
  onExit: () => void;
}

export const RondaGameHud: React.FC<RondaGameHudProps> = ({
  game,
  humanPlayerCards,
  onPlayCard,
  onOpenMenu,
  onToggleCamera,
  onToggleRadio,
  radioEnabled,
  onToggleSound,
  soundEnabled,
  onStartDama,
  onStartHezJouj,
  onGetPartnerHint,
  partnerHintText,
  lastFeedback,
  onRestart,
  onExit,
}) => {
  const isHumanTurn = game.currentTurnIndex === 0 && !game.isDealing && !game.gameOver;
  const is4Players = game.players.length === 4;

  const team0Score = game.getTeamScore(0);
  const team1Score = game.getTeamScore(1);

  const team0CardsCount = game.getTeamCardsCount(0);
  const team1CardsCount = game.getTeamCardsCount(1);

  const p0 = game.players[0];
  const p1 = game.players[1];
  const p2 = is4Players ? game.players[2] : null;
  const p3 = is4Players ? game.players[3] : null;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-3 select-none pointer-events-none z-10 overflow-hidden">
      {/* Top Bar: Team Scores & Minigame shortcuts */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        {/* Left Team Box (You & Partner) */}
        <div className="flex flex-col gap-1.5">
          <div className="bg-[#27170e]/95 border-2 border-yellow-500/80 rounded-2xl p-2.5 shadow-xl text-amber-100 min-w-[155px]">
            <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
              <span className="truncate max-w-[90px]">{p0?.name}</span>
              <span className="bg-[#451a03] px-1.5 py-0.2 rounded text-[10px] text-yellow-300 border border-yellow-700">
                🇲🇦 {p0?.city}
              </span>
            </div>
            {p2 && (
              <div className="text-[10px] text-amber-300/80 truncate mb-1">
                صاحبك: {p2.name}
              </div>
            )}
            <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-[#78350f]">
              <div className="text-2xl font-black font-mono text-yellow-300">
                {team0Score}
                <span className="text-xs text-amber-400 font-normal">/{game.targetScore}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold bg-[#140b06] px-2 py-0.5 rounded-full border border-amber-800">
                <span>🂠</span>
                <span>{team0CardsCount}</span>
              </div>
            </div>
          </div>

          {/* Shortcut: Play Dama */}
          <button
            onClick={onStartDama}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-800 to-rose-900 text-rose-100 px-3 py-1.5 rounded-full border border-rose-500 shadow-lg hover:scale-103 active:scale-95 text-xs font-bold transition-transform text-right"
          >
            <span className="w-4 h-4 rounded-full bg-pink-400 shadow-sm inline-block"></span>
            <div className="leading-tight">
              <div>نلعبو شي ضامة؟ ↗</div>
              <div className="text-[9px] text-pink-300">50+ فلوس إلا غلبتيه</div>
            </div>
          </button>

          {/* Shortcut: Play Hez Jouj */}
          <button
            onClick={onStartHezJouj}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-emerald-100 px-3 py-1.5 rounded-full border border-emerald-500 shadow-lg hover:scale-103 active:scale-95 text-xs font-bold transition-transform text-right"
          >
            <span className="text-sm">🂠</span>
            <div className="leading-tight">
              <div>نلعبو جبن كرع؟</div>
              <div className="text-[9px] text-emerald-300">50+ فلوس إلا غلبتيهم</div>
            </div>
          </button>
        </div>

        {/* Right Team Box (Opponents) */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="bg-[#27170e]/95 border-2 border-yellow-500/80 rounded-2xl p-2.5 shadow-xl text-amber-100 min-w-[155px] text-right">
            <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
              <span className="bg-[#451a03] px-1.5 py-0.2 rounded text-[10px] text-yellow-300 border border-yellow-700">
                🇲🇦 {p1?.city}
              </span>
              <span className="truncate max-w-[90px]">{p1?.name}</span>
            </div>
            {p3 && (
              <div className="text-[10px] text-amber-300/80 truncate mb-1">
                صاحبو: {p3.name}
              </div>
            )}
            <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-[#78350f]">
              <div className="flex items-center gap-1 text-xs font-mono font-bold bg-[#140b06] px-2 py-0.5 rounded-full border border-amber-800">
                <span>🂠</span>
                <span>{team1CardsCount}</span>
              </div>
              <div className="text-2xl font-black font-mono text-yellow-300">
                {team1Score}
                <span className="text-xs text-amber-400 font-normal">/{game.targetScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Action Column (Right edge) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 rounded-full bg-[#27170e]/95 text-amber-200 flex items-center justify-center border border-amber-600 hover:border-yellow-400 shadow-lg active:scale-90 transition-transform"
          title="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleCamera}
          className="w-10 h-10 rounded-full bg-[#27170e]/95 text-amber-200 flex items-center justify-center border border-amber-600 hover:border-yellow-400 shadow-lg active:scale-90 transition-transform"
          title="تبديل الكاميرا"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          onClick={onGetPartnerHint}
          className="w-10 h-10 rounded-full bg-[#27170e]/95 text-yellow-300 flex items-center justify-center border border-amber-600 hover:border-yellow-400 shadow-lg active:scale-90 transition-transform"
          title="وصية الصاحب"
        >
          <Lightbulb className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleRadio}
          className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-lg active:scale-90 transition-all ${
            radioEnabled
              ? 'bg-amber-500 text-stone-900 border-yellow-200 animate-pulse'
              : 'bg-[#27170e]/95 text-amber-300 border-amber-600'
          }`}
          title="راديو القهوة"
        >
          <Radio className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleSound}
          className="w-10 h-10 rounded-full bg-[#27170e]/95 text-amber-200 flex items-center justify-center border border-amber-600 hover:border-yellow-400 shadow-lg active:scale-90 transition-transform"
          title="الصوت"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Center Character Speech Bubbles */}
      <div className="relative w-full flex items-center justify-center my-auto pointer-events-none">
        {/* Partner Hint Popup */}
        {partnerHintText && (
          <div className="absolute -top-16 bg-[#fffbeb] text-[#451a03] font-bold text-sm px-6 py-2 rounded-2xl shadow-2xl border-2 border-[#b45309] animate-bounce-short text-center pointer-events-auto">
            {partnerHintText}
          </div>
        )}

        {/* Turn Action / Score Popups */}
        {lastFeedback && (
          <div className="absolute top-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-extrabold text-sm md:text-base px-6 py-2 rounded-2xl shadow-2xl border-2 border-yellow-200 animate-bounce text-center">
            {lastFeedback.message}
          </div>
        )}

        {/* Character Taunts */}
        {game.players.map((p, idx) => {
          if (!p.speech) return null;
          return (
            <div
              key={p.id}
              className={`absolute bg-[#fffbeb] text-[#451a03] font-extrabold text-xs px-4 py-1.5 rounded-2xl shadow-xl border-2 border-[#b45309] animate-fade-in ${
                idx === 2
                  ? '-top-28'
                  : idx === 1
                  ? 'left-8 -top-8'
                  : idx === 3
                  ? 'right-8 -top-8'
                  : 'bottom-28'
              }`}
            >
              {p.speech}
            </div>
          );
        })}
      </div>

      {/* Bottom Area: Turn Banner & Hand Cards */}
      <div className="flex flex-col items-center pb-2 pointer-events-auto">
        {/* Turn Status Banner matching screenshot 10 & 14 */}
        <div className="bg-[#451a03]/95 border-2 border-yellow-500 text-yellow-300 font-extrabold text-xs md:text-sm px-6 py-1.5 rounded-full shadow-2xl mb-2 flex items-center gap-2">
          {game.isDealing ? (
            <span>كيفرق الكارطة... الدورة {game.roundNumber}</span>
          ) : isHumanTurn ? (
            <span>نوبتك، لعب! الدورة {game.roundNumber} • التوزيعة {game.dealNumber}</span>
          ) : (
            <span>
              نوبة {game.players[game.currentTurnIndex]?.name} • الدورة {game.roundNumber}
            </span>
          )}
        </div>

        {/* 3 Hand Cards facing the player */}
        <div className="flex items-center justify-center gap-3">
          {humanPlayerCards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => {
                if (isHumanTurn) {
                  onPlayCard(card.id);
                }
              }}
              disabled={!isHumanTurn}
              className={`transition-all duration-300 transform group ${
                isHumanTurn
                  ? 'hover:-translate-y-6 hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-yellow-400/80 rounded-2xl shadow-2xl'
                  : 'opacity-80 cursor-not-allowed'
              }`}
            >
              <img
                src={drawCardFaceCanvas(card, 160, 240).toDataURL()}
                alt={card.nameAr}
                className="w-24 h-36 md:w-28 md:h-42 rounded-xl border border-slate-700 object-cover shadow-2xl"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Game Over Victory Modal */}
      {game.gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-gradient-to-b from-[#3d2417] to-[#1c1109] border-4 border-[#eab308] rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-3xl font-black text-amber-200 mb-1">
              {game.winnerTeam === 0 ? 'مبروك عليكم الربحة! 🏆' : 'ربحو الفريق الآخر! 👏'}
            </h2>
            <div className="text-lg font-mono font-bold text-yellow-300 my-2">
              {team0Score} - {team1Score}
            </div>
            <p className="text-amber-100 text-sm mb-4">
              {game.winnerTeam === 0
                ? 'لعب ناضي! غلبتو فالروندا وربحتو النقط كاملين.'
                : 'خيرها فغيرها، عاود بارتية ووريهم اللعب المغربي الصحيح!'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onRestart}
                className="flex-1 py-3 bg-[#eab308] text-[#451a03] font-black rounded-xl hover:bg-yellow-400 active:scale-95 shadow-lg"
              >
                نعاودو بارتية
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 bg-[#78350f] text-amber-100 font-black rounded-xl hover:bg-[#92400e] active:scale-95 border border-amber-600"
              >
                المينو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
