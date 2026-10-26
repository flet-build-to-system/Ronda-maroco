import React, { useState, useEffect } from 'react';
import { DamaGame, DamaPiece, DamaMove } from '../game/damaEngine';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, HelpCircle, Volume2, VolumeX, Radio, Trophy, ArrowRight } from 'lucide-react';

interface DamaViewProps {
  onBack: () => void;
  onRewardCoins: (amount: number) => void;
  onOpenRules: () => void;
}

export const DamaView: React.FC<DamaViewProps> = ({ onBack, onRewardCoins, onOpenRules }) => {
  const [game, setGame] = useState<DamaGame>(() => new DamaGame());
  const [selectedPiece, setSelectedPiece] = useState<DamaPiece | null>(null);
  const [validMovesForPiece, setValidMovesForPiece] = useState<DamaMove[]>([]);
  const [, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  // When piece is clicked
  const handlePieceClick = (p: DamaPiece) => {
    if (game.currentTurn !== 'yellow' || game.gameOver) return;
    if (p.color !== 'yellow') return;

    if (selectedPiece?.id === p.id) {
      setSelectedPiece(null);
      setValidMovesForPiece([]);
      return;
    }

    setSelectedPiece(p);
    const moves = game.validMoves.filter(m => m.fromRow === p.row && m.fromCol === p.col);
    setValidMovesForPiece(moves);
  };

  // When a destination square is clicked
  const handleSquareClick = (r: number, c: number) => {
    if (!selectedPiece) return;
    const move = validMovesForPiece.find(m => m.toRow === r && m.toCol === c);
    if (move) {
      game.makeMove(move);
      setSelectedPiece(null);
      setValidMovesForPiece([]);
      refresh();

      if (game.winner === 'yellow') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onRewardCoins(50);
      }
    }
  };

  const yellowCount = game.pieces.filter(p => p.color === 'yellow').length;
  const redCount = game.pieces.filter(p => p.color === 'red').length;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-3 select-none pointer-events-none z-20">
      {/* Top Section: Haj Brahim & Speech Bubble */}
      <div className="flex flex-col items-center pt-2">
        {/* Haj Speech Bubble */}
        <div className="relative bg-[#fffbeb] text-[#451a03] font-bold text-base px-6 py-2.5 rounded-2xl shadow-xl border-2 border-[#b45309] animate-bounce-short text-center max-w-sm pointer-events-auto">
          {game.hajSpeech}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#fffbeb] border-r-2 border-b-2 border-[#b45309] rotate-45"></div>
        </div>

        {/* Nfakh Alert */}
        {game.nfakhMessage && (
          <div className="mt-3 bg-red-600 text-white font-extrabold px-5 py-2 rounded-xl shadow-2xl border-2 border-yellow-300 animate-pulse text-sm">
            {game.nfakhMessage}
          </div>
        )}
      </div>

      {/* Center Checkers Board (8x8) */}
      <div className="self-center my-auto pointer-events-auto">
        <div className="p-3 bg-[#451a03] rounded-2xl shadow-2xl border-4 border-[#b45309]">
          {/* Coordinates Header */}
          <div className="grid grid-cols-8 text-center text-xs text-[#fde047] font-bold pb-1">
            {['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د'].map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>

          {/* 8x8 Board */}
          <div className="grid grid-cols-8 grid-rows-8 w-[min(84vw,340px)] h-[min(84vw,340px)] rounded-lg overflow-hidden border-2 border-[#78350f]">
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 8 }).map((_, c) => {
                const isDark = (r + c) % 2 === 1;
                const piece = game.board[r][c];
                const isSelected = selectedPiece?.row === r && selectedPiece?.col === c;
                const isValidTarget = validMovesForPiece.some(m => m.toRow === r && m.toCol === c);

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`relative flex items-center justify-center transition-colors cursor-pointer ${
                      isDark ? 'bg-[#15803d]' : 'bg-[#fef3c7]'
                    } ${isValidTarget ? 'bg-[#84cc16] ring-2 ring-yellow-400' : ''}`}
                  >
                    {/* Valid Move Indicator Dot */}
                    {isValidTarget && !piece && (
                      <div className="w-4 h-4 rounded-full bg-yellow-300 shadow-md animate-ping" />
                    )}

                    {/* Checkers Piece */}
                    {piece && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handlePieceClick(piece);
                        }}
                        className={`w-4/5 h-4/5 rounded-full flex items-center justify-center font-extrabold text-xs shadow-md transition-transform ${
                          piece.color === 'yellow'
                            ? 'bg-gradient-to-b from-[#fef08a] to-[#eab308] text-[#713f12] border-2 border-yellow-200'
                            : 'bg-gradient-to-b from-[#ef4444] to-[#b91c1c] text-white border-2 border-red-300'
                        } ${isSelected ? 'scale-115 ring-4 ring-yellow-400' : 'hover:scale-105'}`}
                      >
                        {piece.type === 'king' ? 'ضامة' : ''}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar matching screenshot 6 & 7 */}
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto w-full pointer-events-auto pb-2">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-[#27170e]/90 text-amber-200 flex items-center justify-center border-2 border-[#b45309] hover:bg-[#3d2417] active:scale-95 shadow-lg"
          title="رجوع للروندا"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Score & Turn Banner */}
        <div className="flex-1 flex items-center justify-between px-4 py-2 bg-[#27170e]/95 rounded-full border-2 border-[#b45309] shadow-xl text-sm font-bold text-amber-100">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-200 inline-block shadow-sm"></span>
            <span className="font-mono text-base">{yellowCount}</span>
          </div>

          <div className="bg-[#b45309] text-white px-4 py-1 rounded-full text-xs font-black shadow-inner">
            {game.currentTurn === 'yellow' ? 'نوبتك' : 'نوبة الحاج...'}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-base">{redCount}</span>
            <span className="w-5 h-5 rounded-full bg-red-600 border border-red-300 inline-block shadow-sm"></span>
          </div>
        </div>

        <button
          onClick={onOpenRules}
          className="w-12 h-12 rounded-full bg-[#27170e]/90 text-amber-200 flex items-center justify-center border-2 border-[#b45309] hover:bg-[#3d2417] active:scale-95 shadow-lg"
          title="قوانين الضامة المغربية"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Game Over Victory / Loss Modal */}
      {game.gameOver && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-gradient-to-b from-[#3d2417] to-[#1c1109] border-4 border-[#eab308] rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-2xl font-black text-amber-200 mb-2">
              {game.winner === 'yellow' ? 'مبروك عليك الربحة! 🎉' : 'غلبتك الحاج براهيم! 👴'}
            </h2>
            <p className="text-amber-100 text-sm mb-4">
              {game.winner === 'yellow'
                ? 'ربحتي 50+ فلوس على الحاج براهيم وغلبتيه فالضامة!'
                : 'الحاج براهيم قالك: معليش أ وليدي، العب بتركيز المرة الجاية.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  game.initBoard();
                  setSelectedPiece(null);
                  setValidMovesForPiece([]);
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
