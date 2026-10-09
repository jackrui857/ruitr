import React, { useEffect, useState } from 'react';
import { TrainDetail } from '../types/railway';
import { 
  X, Train, CheckCircle2, AlertTriangle, Clock, MapPin, 
  Accessibility, Bike, Baby, ShieldAlert, ArrowRight, Share2 
} from 'lucide-react';

interface TrainDetailModalProps {
  trainNo: string | null;
  onClose: () => void;
}

export const TrainDetailModal: React.FC<TrainDetailModalProps> = ({
  trainNo,
  onClose,
}) => {
  const [detail, setDetail] = useState<TrainDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!trainNo) {
      setDetail(null);
      return;
    }

    setIsLoading(true);
    fetch(`/api/tdx/train/${trainNo}`)
      .then((res) => res.json())
      .then((data) => {
        setDetail(data);
      })
      .catch((err) => {
        console.error('Failed to fetch train detail:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [trainNo]);

  if (!trainNo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center font-mono font-black text-xl text-white shadow-md">
              {trainNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {detail?.trainTypeName || '列車詳情'}
                </h3>
                <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded">
                  {trainNo} 次
                </span>
                {detail?.tripLine && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    經由{detail.tripLine}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>{detail?.startingStation || '起點'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span>{detail?.endingStation || '終點'}</span>
                <span>• {detail?.direction === 0 ? '北上 (順行)' : '南下 (逆行)'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 animate-spin text-blue-600" />
              正在擷取車次 {trainNo} 即時各站停靠及準點動態...
            </div>
          ) : detail ? (
            <>
              {/* Overall Delay Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  detail.delayMinutes === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {detail.delayMinutes === 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-sm">
                      列車營運狀態：{detail.delayMinutes === 0 ? '全線正常準點運行' : `目前晚 ${detail.delayMinutes} 分`}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      即時串接 TDX 列車動態流通平台 • 每 30 秒自動校正
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-sm px-3 py-1 rounded-full ${
                      detail.delayMinutes === 0
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {detail.delayMinutes === 0 ? '準點' : `晚 ${detail.delayMinutes} 分`}
                  </span>
                </div>
              </div>

              {/* Service amenities */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">車廂服務設施：</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                  <Accessibility className="w-3.5 h-3.5 text-blue-600" /> 無障礙座位
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                  <Bike className="w-3.5 h-3.5 text-emerald-600" /> 人車同行車廂
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                  <Baby className="w-3.5 h-3.5 text-rose-500" /> 哺集乳室
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                  📶 4G/5G 車載免費 Wi-Fi
                </span>
              </div>

              {/* Stops Timeline (每站準點與誤點即時狀態) */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  沿途停靠站與各站即時準點紀錄
                </h4>

                <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
                  {detail.stops.map((stop, idx) => {
                    const isStopOnTime = stop.delayMinutes === 0;
                    return (
                      <div key={stop.stationCode} className="relative group">
                        {/* Dot on timeline */}
                        <div
                          className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition ${
                            stop.isPassed
                              ? 'border-slate-400 bg-slate-300'
                              : isStopOnTime
                              ? 'border-emerald-600 ring-2 ring-emerald-100'
                              : 'border-amber-600 ring-2 ring-amber-100'
                          }`}
                        ></div>

                        <div className="flex items-center justify-between bg-slate-50 hover:bg-blue-50/40 p-2.5 rounded-xl border border-slate-200/80 transition">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-slate-400 font-semibold w-5">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span>{stop.stationName}</span>
                                {stop.isPassed && (
                                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                                    已發車
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 font-mono mt-0.5">
                                到達 {stop.arrivalTime} • 開車 {stop.departureTime}
                              </div>
                            </div>
                          </div>

                          {/* Per-Stop Punctuality Badge */}
                          <div>
                            {isStopOnTime ? (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                準點
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                晚 {stop.delayMinutes} 分
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              查無此車次資料
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>國營臺灣鐵路股份有限公司 • TDX 免費開放資料</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
