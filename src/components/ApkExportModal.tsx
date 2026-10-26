import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, ExternalLink, Copy, Check, GitBranch, Terminal, X, Sparkles } from 'lucide-react';

interface ApkExportModalProps {
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [activeTab, setActiveTab] = useState<'github' | 'direct'>('github');

  const appUrl = window.location.href;
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText('.github/workflows/build-apk.yml');
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-3 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#2a170e] to-[#140b07] border-4 border-[#b45309] rounded-[32px] p-5 max-w-md w-full shadow-2xl max-h-[92vh] flex flex-col my-auto text-amber-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#78350f]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 border border-yellow-300 flex items-center justify-center text-stone-900 shadow">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#fef08a]">تحويل اللعبة إلى APK</h2>
              <div className="text-[11px] text-amber-300">بناء تطبيق أندرويد عبر GitHub Actions</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1f1008] text-amber-400 hover:text-white flex items-center justify-center border border-[#78350f]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#160b06] p-1.5 rounded-2xl border border-[#78350f] mt-3">
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'github'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-900 shadow'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('direct')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'direct'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-900 shadow'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>تثبيت فوري مباشر</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-3.5 py-3 flex-1 text-xs text-amber-200 pr-1 pl-1">
          {activeTab === 'github' ? (
            <div className="space-y-3">
              {/* Ready Workflow Badge */}
              <div className="bg-[#1f1008] border-2 border-emerald-500/80 rounded-2xl p-3.5 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-extrabold text-emerald-300 text-sm">
                    ملف الـ Workflow جاهز في المشروع!
                  </span>
                </div>
                <div className="bg-[#120803] p-2.5 rounded-xl border border-stone-800 font-mono text-[11px] text-yellow-300 flex items-center justify-between">
                  <span>.github/workflows/build-apk.yml</span>
                  <button
                    onClick={handleCopyPath}
                    className="text-amber-400 hover:text-white p-1"
                    title="نسخ المسار"
                  >
                    {copiedPath ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Steps Guide */}
              <div className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-3.5 space-y-2.5 shadow">
                <div className="font-bold text-yellow-300 text-xs mb-1">
                  خطوات استخراج ملف الـ APK عبر GitHub:
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-stone-900 font-black text-center leading-5 shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-amber-100">رفع المشروع (Push):</strong> ارفع الكود إلى مستودعك على GitHub (أو قم بعمل Commit).
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-stone-900 font-black text-center leading-5 shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-amber-100">افتح تبويب Actions:</strong> ادخل على مستودعك في GitHub ثم اضغط على <strong>Actions</strong> في الشريط العلوي.
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-stone-900 font-black text-center leading-5 shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-amber-100">تشغيل البناء:</strong> ستجد workflow باسم <strong>Build Android APK</strong> يعمل تلقائياً، أو يمكنك الضغط على <strong>Run workflow</strong>.
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-stone-900 font-black text-center leading-5 shrink-0 text-xs">
                    4
                  </span>
                  <div>
                    <strong className="text-emerald-300">تحميل ملف APK:</strong> عند انتهاء البناء الأخضر (خلال دقيقة)، اضغط على التشغيل وستجد ملف <strong>Ronda-3D-Moroccan-Game-APK.zip</strong> في قسم <strong>Artifacts</strong> جاهزاً للتحميل والتثبيت المباشر على أي هاتف أندرويد!
                  </div>
                </div>
              </div>

              {/* How it works summary */}
              <div className="bg-[#170c06] p-3 rounded-xl border border-amber-800 text-[11px] text-amber-300/90 leading-relaxed">
                💡 <strong>ماذا يفعل الـ Workflow؟</strong><br />
                يقوم بتشغيل سيرفر Ubuntu، وتثبيت Node 20 و Java JDK 17 و Android SDK، ثم عمل Build للعبة وتوليد كود أندرويد الأصلي عبر Capacitor، ثم استدعاء Gradle لبناء ملف <code className="text-yellow-300">app-debug.apk</code> بدون الحاجة لتثبيت Android Studio على حاسوبك!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Method 1: Instant Direct Installation (WebAPK) */}
              <div className="bg-[#1f1008] border-2 border-yellow-500/80 rounded-2xl p-3.5 shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-emerald-500 text-stone-900 text-xs font-black px-2 py-0.5 rounded-full">
                    تثبيت فوري
                  </span>
                  <span className="font-extrabold text-amber-100 text-sm">تثبيت فوري على الهاتف (WebAPK)</span>
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed mb-3">
                  يقوم متصفح Chrome على هاتفك بإنشاء ملف <strong>WebAPK</strong> رسمي وتثبيته مباشرة كأيقونة تطبيق كامل بدون شريط المتصفح.
                </p>

                {isInstalled ? (
                  <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs font-bold p-3 rounded-xl text-center">
                    ✅ التطبيق مثبت ومثالي على جهازك كـ تطبيق أصلي!
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={install}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xs rounded-xl shadow-lg border border-emerald-300 hover:brightness-110 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>اضغط هنا لتثبيت التطبيق الآن</span>
                  </button>
                ) : (
                  <div className="bg-[#2a170e] border border-amber-700/60 p-3 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-yellow-300">للتثبيت من هاتفك مباشرة:</div>
                    <div>1. افتح رابط اللعبة في متصفح Chrome على هاتفك.</div>
                    <div>2. اضغط على خيارات المتصفح (الثلاث نقاط ⋮).</div>
                    <div>3. اختر <strong>«تثبيت التطبيق» (Install app)</strong>.</div>
                  </div>
                )}
              </div>

              {/* PWABuilder Option */}
              <div className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-3.5 shadow">
                <div className="font-bold text-amber-100 mb-1">إنشاء APK عبر PWABuilder:</div>
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-900 font-black text-xs rounded-xl shadow-md border border-yellow-200 hover:brightness-110 active:scale-98 flex items-center justify-center gap-2 no-underline text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح PWABuilder وتحميل ملف APK</span>
                </a>
              </div>
            </div>
          )}

          {/* Copy Link */}
          <div className="bg-[#160b06] border border-[#78350f] rounded-2xl p-2.5 flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <div className="text-[10px] text-amber-400 font-bold">رابط اللعبة المباشر:</div>
              <div className="text-xs text-amber-200 font-mono truncate max-w-[200px]">
                {appUrl}
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="py-1.5 px-3 bg-[#451a03] border border-amber-600 text-amber-200 text-xs font-bold rounded-lg hover:border-yellow-400 flex items-center gap-1 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-1 bg-gradient-to-r from-[#92400e] to-[#78350f] text-yellow-200 font-black text-base rounded-2xl border-2 border-amber-600 hover:brightness-110 active:scale-98 shadow-xl"
        >
          فهمت، رجوع للعبة
        </button>
      </div>
    </div>
  );
};
