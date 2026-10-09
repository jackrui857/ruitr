import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Database, Check, AlertCircle, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';

interface TDXSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TDXSettingsModal: React.FC<TDXSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Check current configured status
      fetch('/api/tdx/status')
        .then((r) => r.json())
        .then((data) => {
          if (data.hasUserKey) {
            setClientId(data.clientIdPreview || '');
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/tdx/test-connection');
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({
        connected: false,
        message: '連線測試逾時，目前使用內建 TDX 免費引擎模式',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/tdx/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setStatusMessage('TDX API 憑證已成功更新並啟用！');
        // Run test connection
        await handleTestConnection();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setIsSuccess(false);
        setStatusMessage(data.error || '憑證格式有誤');
      }
    } catch {
      setIsSuccess(false);
      setStatusMessage('連線設定失敗');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                TDX 交通部運輸資料流通平台設定
              </h3>
              <p className="text-xs text-slate-400">
                串接交通部免費開放 TDX API (Rail/TRA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              目前運作狀態：TDX 免費開放時刻表系統正常運行中
            </div>
            系統預設已搭載全台即時列車時鐘排程、各站發車動態與誤點演算法。若您擁有交通部 TDX (原 PTX) 免費開發者帳號，可在此填入專屬 Client ID 及 Secret，系統將優先直接調用您的官方 TDX API 伺服器通道。
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              TDX Client ID
            </label>
            <input
              type="text"
              placeholder="例如: your_client_id-..."
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              TDX Client Secret
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••••••"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Test connection & link */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <a
              href="https://tdx.transportdata.tw"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              前往 TDX 免費申請專屬金鑰 <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium flex items-center gap-1"
            >
              <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : 'text-blue-600'}`} />
              {isTesting ? '測試中...' : '測試連線'}
            </button>
          </div>

          {/* Test feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.connected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
              {testResult.latencyMs !== undefined && (
                <span className="font-mono text-[11px] text-slate-500">
                  ({testResult.latencyMs}ms)
                </span>
              )}
            </div>
          )}

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                isSuccess
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {isSuccess ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              {statusMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              關閉
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              {isSaving ? '儲存中...' : '儲存並套用'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
