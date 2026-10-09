import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  X,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  WifiOff,
  BellRing
} from 'lucide-react';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onInstall,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'guide'>('instant');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    playAndroidSound('success');
    triggerHaptic(15);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleInstallClick = async () => {
    playAndroidSound('tap');
    triggerHaptic(20);
    const success = await onInstall();
    if (success) {
      playAndroidSound('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                RINAYA Android App
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-400/30">
                  Ready to Install
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Install as a native Android application on your phone or tablet
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playAndroidSound('tap');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('instant')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'instant'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1-Tap Install (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Android Chrome Steps
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'apk'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Build Standalone .APK
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-700 text-sm">
          {activeTab === 'instant' && (
            <div className="space-y-4">
              {isInstalled ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">App Already Installed!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      RINAYA Guardian AI is active on this device in Standalone Android App mode.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Download className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Direct Android Installation Ready</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Click below to install RINAYA Guardian AI directly into your Android app drawer with icon, offline mode, and full-screen experience.
                    </p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Download className="w-4 h-4" /> Install Android App Now
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    How to install on your Android device:
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 pl-1 leading-relaxed">
                    <li>Open this URL in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.</li>
                    <li>Tap the <strong>⋮ (three dots)</strong> menu icon at the top right.</li>
                    <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
                    <li>The RINAYA icon will appear on your Android launcher and home screen!</li>
                  </ol>
                </div>
              )}

              {/* Android Features Highlights */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900">Standalone Window</h5>
                    <p className="text-[11px] text-slate-500 leading-tight">No browser URL bar or distractions</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900">Device Lock Guard</h5>
                    <p className="text-[11px] text-slate-500 leading-tight">Instant shutdown upon daily limit</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900">Offline Caching</h5>
                    <p className="text-[11px] text-slate-500 leading-tight">Runs smoothly with Service Worker</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <BellRing className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900">Haptics & Audio</h5>
                    <p className="text-[11px] text-slate-500 leading-tight">Native vibrations and guardian chimes</p>
                  </div>
                </div>
              </div>

              {/* URL Sharing */}
              <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div className="truncate text-xs text-slate-600 font-mono">
                  {currentUrl}
                </div>
                <button
                  onClick={() => handleCopy(currentUrl, 'url')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedCode === 'url' ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Step-by-Step Android Installation Guide:
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Open on your Android phone</strong>
                    <span className="text-slate-600">Ensure you open the link inside Google Chrome or Samsung Internet browser.</span>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Tap browser menu (⋮)</strong>
                    <span className="text-slate-600">Located at the top right of the browser toolbar.</span>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Tap &quot;Install App&quot; or &quot;Add to Home Screen&quot;</strong>
                    <span className="text-slate-600">Android creates a WebAPK package with high-definition icons and full permissions.</span>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Enjoy the standalone Android app</strong>
                    <span className="text-slate-600">Tap the RINAYA Guardian icon anytime from your Android home screen or app drawer!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Generate Signed .APK / .AAB for Google Play Store
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Because this app includes a standard Google Play-compliant <strong>Web App Manifest</strong> and <strong>Service Worker</strong>, you can instantly turn it into an Android Studio project or signed APK using <strong>Bubblewrap (Google&apos;s CLI)</strong> or <strong>PWABuilder</strong>:
              </p>

              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs relative">
                <div className="text-slate-400 text-[11px] mb-1.5 flex items-center justify-between">
                  <span>Google Bubblewrap CLI Command:</span>
                  <button
                    onClick={() => handleCopy(`npx @bubblewrap/cli init --manifest="${currentUrl}manifest.webmanifest"`, 'bubblewrap')}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copiedCode === 'bubblewrap' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="text-emerald-400 block break-all">
                  npx @bubblewrap/cli init --manifest=&quot;{currentUrl}manifest.webmanifest&quot;
                </code>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <p className="font-semibold text-slate-900">Alternative: PWABuilder (1-click APK download)</p>
                <p>
                  Visit <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">PWABuilder.com</a>, paste your app URL, and click <strong>&quot;Package for Android&quot;</strong> to get an installable signed APK file!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            RINAYA Android Edition v2.4
          </span>
          <button
            onClick={() => {
              playAndroidSound('tap');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
