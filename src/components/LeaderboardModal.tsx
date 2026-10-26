import React, { useState } from 'react';
import { Trophy, Shield, User } from 'lucide-react';

interface LeaderboardModalProps {
  onClose: () => void;
  playerName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, playerName }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'device' | 'dama'>('online');

  const onlineRankings = [
    { rank: 1, name: 'Badr_Lhayel46', score: 1002 },
    { rank: 2, name: 'Casano', score: 211 },
    { rank: 3, name: 'Rachid_Msbahi', score: 175 },
    { rank: 4, name: 'Kamal_Lbahri', score: 161 },
    { rank: 5, name: 'Chamali', score: 158 },
    { rank: 6, name: 'Ouba', score: 149 },
    { rank: 7, name: 'Soufiane_Lbatal59', score: 147 },
    { rank: 8, name: 'Ma3ti_Lma3lem', score: 141 },
    { rank: 9, name: 'Chouaib_Lkhfif', score: 127 },
  ];

  const deviceRankings = [
    { rank: 1, name: playerName, score: 24 },
    { rank: 2, name: 'LOTFI_LGHZAL', score: 18 },
    { rank: 3, name: 'RAFIK_CHEMS', score: 15 },
    { rank: 4, name: 'GHALI_RIFI', score: 11 },
  ];

  const damaRankings = [
    { rank: 1, name: 'الحاج براهيم (Lhaj Brahim)', score: 340 },
    { rank: 2, name: playerName, score: 12 },
    { rank: 3, name: 'سي موحند', score: 8 },
  ];

  const currentList =
    activeTab === 'online'
      ? onlineRankings
      : activeTab === 'device'
      ? deviceRankings
      : damaRankings;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header matching screenshot 2 */}
        <div className="text-center pb-2">
          <h2 className="text-3xl font-black text-[#fef08a] mb-0.5">الترتيب</h2>
          <div className="text-xs text-amber-300 font-bold">أحسن 20 لاعب</div>
        </div>

        {/* 2 Top Stats Boxes */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-3 text-center">
            <div className="text-3xl font-black text-amber-300 font-mono">1</div>
            <div className="text-xs font-bold text-amber-200 mt-1">ربحات ضد الجهاز</div>
            <div className="text-[10px] text-amber-400/80">1 لعبة</div>
          </div>
          <div className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-3 text-center">
            <div className="text-3xl font-black text-amber-300 font-mono">3</div>
            <div className="text-xs font-bold text-amber-200 mt-1">ربحات أونلاين</div>
            <div className="text-[10px] text-amber-400/80">5 لعبة</div>
          </div>
        </div>

        <div className="text-center text-xs font-bold text-yellow-300 mb-3 bg-[#451a03] py-1.5 rounded-full border border-yellow-600/60">
          حصيلتك أونلاين: 1+ • النجمة ✨ من 10+
        </div>

        {/* 3 Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-[#160b06] p-1.5 rounded-2xl border border-[#78350f] mb-3">
          <button
            onClick={() => setActiveTab('online')}
            className={`py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'online'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] shadow'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            أونلاين
          </button>
          <button
            onClick={() => setActiveTab('device')}
            className={`py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'device'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] shadow'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            ضد الجهاز
          </button>
          <button
            onClick={() => setActiveTab('dama')}
            className={`py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'dama'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] shadow'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            الضامة
          </button>
        </div>

        {/* Ranked List */}
        <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 pl-1 max-h-56">
          {currentList.map(item => (
            <div
              key={item.rank}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border ${
                item.name === playerName
                  ? 'bg-[#59320e] border-yellow-400 text-yellow-200 font-black'
                  : 'bg-[#1a0e07] border-[#451a03] text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono font-bold text-amber-400">{item.rank}</span>
                <span className="text-sm font-bold truncate max-w-[170px]">{item.name}</span>
              </div>
              <span className="font-mono font-black text-amber-300 text-sm">{item.score}</span>
            </div>
          ))}
        </div>

        {/* User identifier footer */}
        <div className="text-center text-[11px] text-amber-400/80 my-3">
          المعرّف ديالك: <span className="font-mono font-bold text-yellow-300">{playerName}_••••••••• بيّن</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#451a03] text-amber-200 font-black text-base rounded-2xl border border-amber-600 hover:bg-[#59320e] active:scale-98 shadow-md"
          >
            حسابي
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-[#92400e] to-[#78350f] text-yellow-200 font-black text-base rounded-2xl border-2 border-amber-500 hover:brightness-110 active:scale-98 shadow-md"
          >
            رجع
          </button>
        </div>
      </div>
    </div>
  );
};
