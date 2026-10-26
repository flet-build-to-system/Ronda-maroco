import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, ExternalLink, Copy, Check, Info, X } from 'lucide-react';

interface ApkExportModalProps {
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  const appUrl = window.location.href;
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
              <div className="text-[11px] text-amber-300">تثبيت روندا 3D كتطبيق أندرويد حقيقي</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1f1008] text-amber-400 hover:text-white flex items-center justify-center border border-[#78350f]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-4 py-4 flex-1 text-sm text-amber-200 pr-1 pl-1">
          {/* Method 1: Instant Direct Installation (WebAPK) */}
          <div className="bg-[#1f1008] border-2 border-yellow-500/80 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500 text-stone-900 text-xs font-black px-2 py-0.5 rounded-full">
                الطريقة 1 (الأسهل والأسرع)
              </span>
              <span className="font-extrabold text-amber-100 text-sm">تثبيت فوري على الهاتف</span>
            </div>
            <p className="text-xs text-amber-300/90 leading-relaxed mb-3">
              محرك المتصفح على الأندرويد يقوم بإنشاء ملف <strong>WebAPK</strong> رسمي وتثبيته مباشرة على شاشة هاتفك مع أيقونة اللعبة وشاشة البداية، وبدون شريط المتصفح!
            </p>

            {isInstalled ? (
              <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs font-bold p-3 rounded-xl text-center">
                ✅ التطبيق مثبت ومثالي على جهازك كـ تطبيق أصلي!
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-sm rounded-xl shadow-lg border border-emerald-300 hover:brightness-110 active:scale-98 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>اضغط هنا لتثبيت التطبيق الآن</span>
              </button>
            ) : (
              <div className="bg-[#2a170e] border border-amber-700/60 p-3 rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-yellow-300">للتثبيت من هاتفك مباشرة:</div>
                <div className="text-amber-200/90">
                  1. افتح رابط اللعبة في متصفح <strong>Google Chrome</strong> على هاتف الأندرويد.
                </div>
                <div className="text-amber-200/90">
                  2. اضغط على قائمة الثلاث نقاط (⋮) في أعلى المتصفح.
                </div>
                <div className="text-amber-200/90">
                  3. اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                </div>
              </div>
            )}
          </div>

          {/* Method 2: Generate Signed APK via PWABuilder (TWA) */}
          <div className="bg-[#1f1008] border border-[#78350f] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                الطريقة 2
              </span>
              <span className="font-extrabold text-amber-100 text-sm">تحميل ملف .APK مستقل</span>
            </div>
            <p className="text-xs text-amber-300/90 leading-relaxed mb-3">
              قمنا بتجهيز ملف <strong>manifest.json</strong> والأيقونات بدقة 512x512 والـ Service Worker ليتوافق 100% مع أداة <strong>PWABuilder</strong> الرسمية من مايكروسوفت وجوجل لإنشاء ملف APK / AAB قابل للنشر في متجر Google Play أو التثبيت اليدوي.
            </p>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-900 font-black text-xs rounded-xl shadow-md border border-yellow-200 hover:brightness-110 active:scale-98 flex items-center justify-center gap-2 no-underline text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>فتح PWABuilder وتحميل ملف الـ APK</span>
            </a>

            <div className="mt-2 text-[11px] text-amber-400/80">
              * في صفحة PWABuilder، اضغط على <strong>«Package for Stores»</strong> ثم اختر <strong>Android</strong> لتحميل حزمة الـ APK فوراً.
            </div>
          </div>

          {/* Share / Copy Link Box */}
          <div className="bg-[#160b06] border border-[#78350f] rounded-2xl p-3 flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <div className="text-[10px] text-amber-400 font-bold mb-0.5">رابط اللعبة المباشر:</div>
              <div className="text-xs text-amber-200 font-mono truncate max-w-[220px]">
                {appUrl}
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="py-1.5 px-3 bg-[#451a03] border border-amber-600 text-amber-200 text-xs font-bold rounded-lg hover:border-yellow-400 flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>

        {/* Footer Return Button */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-2 bg-gradient-to-r from-[#92400e] to-[#78350f] text-yellow-200 font-black text-base rounded-2xl border-2 border-amber-600 hover:brightness-110 active:scale-98 shadow-xl"
        >
          فهمت، رجوع للعبة
        </button>
      </div>
    </div>
  );
};
