import React, { useState } from 'react';

interface RulesModalProps {
  initialTab?: 'ronda' | 'dama' | 'hez_jouj';
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ initialTab = 'ronda', onClose }) => {
  const [tab, setTab] = useState<'ronda' | 'dama' | 'hez_jouj'>(initialTab);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header matching screenshot 15 */}
        <div className="text-center pb-2">
          <h2 className="text-3xl font-black text-[#fef08a] mb-2">القوانين</h2>

          {/* 3 Game Rules Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#160b06] p-1 rounded-2xl border border-[#78350f]">
            <button
              onClick={() => setTab('ronda')}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                tab === 'ronda'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] shadow'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              روندا المغربية
            </button>
            <button
              onClick={() => setTab('dama')}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                tab === 'dama'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] shadow'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              الضامة (الحاج)
            </button>
            <button
              onClick={() => setTab('hez_jouj')}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                tab === 'hez_jouj'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] shadow'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              جبن كرع (هز جوج)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-3 space-y-3.5 flex-1 text-xs leading-relaxed pr-1 pl-1 text-amber-200">
          {tab === 'ronda' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">1.</span>
                <p>
                  <strong className="text-amber-100">40 كارتة:</strong> من 1 حتى 7، و10 (الولد)، و11 (العود)، و12 (المالك) — من بعد 7 كتجي 10 مباشرة.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">2.</span>
                <p>
                  كل واحد كياخد 3 كارطات، و4 كارطات كيتحطو فالطبلة. كنلعبو عكس عقارب الساعة.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">3.</span>
                <p>
                  الكارطة اللي عندها نفس القيمة د شي كارتة فالطبلة كتشدها، وكتشد معاها اللي جايين مورا مورا (4، 5، 6...).
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">4.</span>
                <p>
                  <strong className="text-yellow-300">روندا:</strong> زوج كارطات كيفكيف فيدك فالتوزيعة (1+).<br />
                  <strong className="text-yellow-300">ترينكة:</strong> تلاتة كيفكيف (5+). أقوى إعلان هو اللي كياخد كلشي.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">5.</span>
                <p>
                  <strong className="text-emerald-400">ميسة:</strong> تخوي الطبلة كاملة (1+).<br />
                  <strong className="text-yellow-300">ضربة ورجعة:</strong> شد الكارطة اللي عاد حطها الخصم (هاك هادي! 1+)؛ ورجعة (زيد هادي! 5+)، وعشرة هادي! (10+) فالكارطة التالتة والرابعة د نفس القيمة.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">6.</span>
                <p>
                  فالآخير، كل كارطة فوق 20 كتسوا نقطة. الكارطة اللي بقات كتمشي لآخر واحد شد. أول واحد يوصل للهدف (21 أو 41 نقطة) هو اللي ربح.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-yellow-400 font-mono text-sm shrink-0">7.</span>
                <p>
                  <strong className="text-amber-100">قانون حبال وبانت:</strong> كل نقطة هي بانت، و 5 بانت كيديرو حبل.
                </p>
              </div>
            </div>
          )}

          {tab === 'dama' && (
            <div className="space-y-3">
              <div className="bg-[#451a03] p-3 rounded-2xl border border-yellow-600/50 text-center font-bold text-yellow-300 text-sm">
                الضامة المغربية مع الحاج براهيم (50+ فلوس إلا غلبتيه)
              </div>
              <ul className="list-disc list-inside space-y-2 text-amber-200">
                <li>البيدق كيمشي خطوة وحدة فالوراب، لقدّام.</li>
                <li>كياكل لقدّام: كينقز على الحجرة اللي قدّامو، ويزيد ياكل ما دام يقدر.</li>
                <li><strong>الماكلة واجبة:</strong> والماكلة الكبيرة هي اللي واجبة (أكبر عدد د الحبات).</li>
                <li>
                  <strong className="text-red-400">النفخ:</strong> إلا ما كليتيش (ولا كليتي قل)، الحاج كينفخ الكابسولة اللي كان خاصها تاكل، ومن بعد كيلعب!
                </li>
                <li>البيدق اللي وصل للآخر كيولي ضامة: كنقلبو الكابسولة ومكتوب عليها «ضامة».</li>
                <li><strong className="text-yellow-300">الضامة كتطير:</strong> كتمشي فالوراب كامل وكتاكل من بعيد فكل جهة.</li>
                <li>اللي كلا كلشي ولا سدّ على الآخر هو اللي ربح.</li>
              </ul>
            </div>
          )}

          {tab === 'hez_jouj' && (
            <div className="space-y-3">
              <div className="bg-[#451a03] p-3 rounded-2xl border border-yellow-600/50 text-center font-bold text-yellow-300 text-sm">
                جبن كرع (هز جوج) - كارتة القهاوي الشعبية
              </div>
              <ul className="list-disc list-inside space-y-2 text-amber-200">
                <li>خمسة د الوراق لكل واحد، ووحدة مقلوبة فالوسط. اللي سالا الوراق ديالو اللول هو اللي ربح.</li>
                <li>لوّح ورقة من نفس النوع (دينار، كاس، سيف، زرواطة) ولا نفس الرقم.</li>
                <li><strong>الجوج (هز جوج):</strong> اللي من بعدك كيهز جوج وراق وكيتحبس، إلا إلى عندو جوج كيزيدها وتولي ربعة، ستة...</li>
                <li><strong>اللاص (ما تلعبش):</strong> اللي من بعدك ما كيلعبش.</li>
                <li><strong>السبعة (الحاكم):</strong> نتا اللي كتقول النوع اللي جاي (أنا حاكم بكذا..).</li>
                <li>ما عندك والو؟ ورك على الطابلة كتهز ورقة، والنوبة كدوز.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Dismiss Button matching screenshot */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-[#451a03] font-black text-lg rounded-2xl border-2 border-yellow-300 hover:brightness-110 active:scale-98 shadow-xl"
        >
          فهمت
        </button>
      </div>
    </div>
  );
};
