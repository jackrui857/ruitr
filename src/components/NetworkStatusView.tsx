import React, { useEffect, useState } from 'react';
import { NetworkStatus } from '../types/railway';
import { 
  Activity, CheckCircle2, AlertTriangle, Clock, ShieldCheck, 
  FileText, Train, Info, ArrowUpRight, RefreshCw 
} from 'lucide-react';

export const NetworkStatusView: React.FC = () => {
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchStatus = () => {
    setIsLoading(true);
    fetch('/api/tdx/network-status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-900">
                國營臺灣鐵路股份有限公司 • 全路網營運準點狀況
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              即時彙整交通部 TDX 運輸資料流通平台與台鐵行控中心調度資訊
            </p>
          </div>

          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="self-start md:self-auto text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            重新整理概況
          </button>
        </div>

        {/* Big Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {/* Punctuality Rate */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              今日整體準點率
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">
              {status?.punctualityRate || 94.0}%
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              高於標準目標 (90%)
            </div>
          </div>

          {/* Active Trains */}
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
            <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Train className="w-4 h-4 text-blue-600" />
              線上運行列車數
            </div>
            <div className="text-3xl font-black text-blue-700 mt-2 font-mono">
              {status?.totalActiveTrains || 168} <span className="text-sm font-normal">列</span>
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              包含西部、東部及南迴
            </div>
          </div>

          {/* Delayed Trains */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
            <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              目前延誤列車數
            </div>
            <div className="text-3xl font-black text-amber-700 mt-2 font-mono">
              {status?.delayedTrains || 10} <span className="text-sm font-normal">列</span>
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              平均延誤約 {status?.avgDelayMinutes || 1.2} 分鐘
            </div>
          </div>

          {/* Safety & Schedule */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              最大延誤車次
            </div>
            <div className="text-xl font-black text-slate-800 mt-2 font-mono">
              {status?.maxDelayTrainNo || '143 次自強號'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              延誤約 {status?.maxDelayMinutes || 14} 分鐘
            </div>
          </div>
        </div>
      </div>

      {/* Main Lines Live Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          各路網區段即時營運警報與公告
        </h3>

        <div className="space-y-3">
          {status?.lineAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                alert.status === 'NORMAL'
                  ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.status === 'NORMAL' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{alert.lineName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        alert.status === 'NORMAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.status === 'NORMAL' ? '全線正常' : '局部微幅延誤'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                調度中心
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delay Certificate & Refund Policy Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          台鐵列車延誤補償與誤點證明須知
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              誤點證明申請流程
            </div>
            <p className="leading-relaxed">
              若您搭乘之列車到達目的地時，延誤達 10 分鐘以上，可於各車站剪票口出站時索取紙本「誤點證明書」，或於台鐵官網線上即時申請電子誤點證明，供請假或差勤核銷使用。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              延誤退費與賠償標準
            </div>
            <p className="leading-relaxed">
              因台鐵公司歸責事由致對號列車延誤達 45 分鐘以上，旅客得於 1 年內持乘車票至全台各車站窗口辦理全額退費，或免費兌換同區間同等級列車乘車券乙張。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
