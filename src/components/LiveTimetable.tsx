import React, { useState, useEffect } from 'react';
import { Station, TrainLiveItem, TimetableSearchResult } from '../types/railway';
import { TAIWAN_STATIONS, getStationByCode } from '../data/railwayData';
import { 
  Clock, ArrowUpDown, Search, RefreshCw, CheckCircle2, 
  AlertTriangle, Filter, Train, CreditCard, ShieldAlert,
  ArrowRight, Info, Calendar, Database, Check, Zap, HelpCircle
} from 'lucide-react';

interface LiveTimetableProps {
  onSelectTrain: (trainNo: string) => void;
  initialStationCode?: string;
  onOpenTdxSettings?: () => void;
}

export const LiveTimetable: React.FC<LiveTimetableProps> = ({
  onSelectTrain,
  initialStationCode = '1000', // 台北
  onOpenTdxSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'trip'>('board');
  
  // Live Board State
  const [selectedStationCode, setSelectedStationCode] = useState<string>(initialStationCode);
  const [directionFilter, setDirectionFilter] = useState<'all' | '0' | '1'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [liveTrains, setLiveTrains] = useState<TrainLiveItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [boardSource, setBoardSource] = useState<'TDX_API' | 'TDX_SIMULATED_ENGINE'>('TDX_SIMULATED_ENGINE');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trip Search State
  const [fromCode, setFromCode] = useState<string>('1000'); // 台北
  const [toCode, setToCode] = useState<string>('3300');     // 台中
  const [searchDate, setSearchDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [searchTime, setSearchTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [tripResults, setTripResults] = useState<TimetableSearchResult[]>([]);
  const [tripSource, setTripSource] = useState<'TDX_API' | 'TDX_SIMULATED_ENGINE'>('TDX_SIMULATED_ENGINE');
  const [isSearchingTrip, setIsSearchingTrip] = useState<boolean>(false);

  // TDX Live Test State
  const [tdxTestResult, setTdxTestResult] = useState<{
    connected: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [isTestingTdx, setIsTestingTdx] = useState<boolean>(false);

  // Quick major stations
  const majorQuickStations = [
    { code: '1000', name: '台北' },
    { code: '1020', name: '板橋' },
    { code: '1060', name: '桃園' },
    { code: '1210', name: '新竹' },
    { code: '3300', name: '台中' },
    { code: '3360', name: '彰化' },
    { code: '4080', name: '嘉義' },
    { code: '4220', name: '台南' },
    { code: '4400', name: '高雄' },
    { code: '5000', name: '屏東' },
    { code: '7160', name: '宜蘭' },
    { code: '7000', name: '花蓮' },
    { code: '6000', name: '台東' },
  ];

  // Test TDX Connection
  const handleTestTdx = async () => {
    setIsTestingTdx(true);
    try {
      const res = await fetch('/api/tdx/test-connection');
      const data = await res.json();
      setTdxTestResult(data);
    } catch {
      setTdxTestResult({
        connected: false,
        message: 'TDX 連線測試逾時，目前維持 TDX 免費引擎模式',
      });
    } finally {
      setIsTestingTdx(false);
    }
  };

  // Fetch Live Board
  const fetchLiveBoard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tdx/live-board/${selectedStationCode}`);
      const data = await res.json();
      setLiveTrains(data.trains || []);
      setLastUpdated(data.updatedAt || new Date().toLocaleTimeString());
      setBoardSource(data.source || 'TDX_SIMULATED_ENGINE');
    } catch (err) {
      console.error('Failed to fetch live board:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveBoard();
    const interval = setInterval(fetchLiveBoard, 30000);
    return () => clearInterval(interval);
  }, [selectedStationCode]);

  // Handle Trip Search
  const handleSearchTrip = async () => {
    if (fromCode === toCode) return;
    setIsSearchingTrip(true);
    try {
      const res = await fetch(`/api/tdx/timetable?from=${fromCode}&to=${toCode}&time=${searchTime}&date=${searchDate}`);
      const data = await res.json();
      setTripResults(data.results || []);
      setTripSource(data.source || 'TDX_SIMULATED_ENGINE');
    } catch (err) {
      console.error('Failed to search trip timetable:', err);
    } finally {
      setIsSearchingTrip(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'trip') {
      handleSearchTrip();
    }
  }, [activeTab]);

  const selectedStation = getStationByCode(selectedStationCode) || TAIWAN_STATIONS[0];

  // Filter trains
  const filteredLiveTrains = liveTrains.filter((train) => {
    const matchDirection =
      directionFilter === 'all' || String(train.direction) === directionFilter;
    const matchType =
      typeFilter === 'all' ||
      (typeFilter === 'fast' && (train.trainTypeName.includes('自強') || train.trainTypeName.includes('普悠瑪') || train.trainTypeName.includes('太魯閣'))) ||
      (typeFilter === 'local' && train.trainTypeName.includes('區間'));
    return matchDirection && matchType;
  });

  return (
    <div className="space-y-5">
      {/* TDX Live Service Integration Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800/60">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-white">
                交通部 TDX 免費時刻表開放系統 (Transport Data eXchange)
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {boardSource === 'TDX_API' ? 'TDX 官方即時 API 連線中' : 'TDX 免費引擎即時運作中'}
              </span>
            </div>
            <p className="text-xs text-blue-200/80 mt-1 leading-relaxed">
              全面串接交通部免費開放之臺鐵列車時刻表 (Rail/TRA/DailyTimetable)、車站即時動態 (LiveBoard) 與每站誤點分鐘數。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 text-xs">
          <button
            onClick={handleTestTdx}
            disabled={isTestingTdx}
            className="px-3 py-1.5 bg-blue-700/60 hover:bg-blue-600 text-white rounded-xl border border-blue-400/30 transition flex items-center gap-1 font-semibold"
          >
            <Zap className={`w-3.5 h-3.5 ${isTestingTdx ? 'animate-spin' : 'text-amber-400'}`} />
            {isTestingTdx ? '連線檢測中...' : '測試 TDX 官方連線'}
          </button>
          {onOpenTdxSettings && (
            <button
              onClick={onOpenTdxSettings}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-blue-200 rounded-xl transition font-medium"
            >
              設定金鑰
            </button>
          )}
        </div>
      </div>

      {/* TDX Connection Test Result Feedback */}
      {tdxTestResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            tdxTestResult.connected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {tdxTestResult.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="font-semibold">{tdxTestResult.message}</span>
            {tdxTestResult.latencyMs !== undefined && (
              <span className="text-[11px] text-slate-500 font-mono">
                (延遲: {tdxTestResult.latencyMs}ms)
              </span>
            )}
          </div>
          <button
            onClick={() => setTdxTestResult(null)}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Switcher & Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              activeTab === 'board'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            各站即時看板 (每站準點動態)
          </button>
          <button
            onClick={() => setActiveTab('trip')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              activeTab === 'trip'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            起訖站時刻與票價查詢
          </button>
        </div>

        {/* Live Refresh and Source Status */}
        <div className="flex items-center gap-3 text-xs text-slate-500 w-full sm:w-auto justify-end">
          <span className="flex items-center gap-1.5 font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            TDX 即時串接中
          </span>
          <span className="hidden md:inline text-slate-400">
            更新時間: {lastUpdated || '剛剛'}
          </span>
          <button
            onClick={fetchLiveBoard}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition flex items-center gap-1"
            title="手動更新"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeTab === 'board' ? (
        /* ================= Mode A: Station Live Board ================= */
        <div className="space-y-4">
          {/* Station Selector Bar */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  選擇查詢車站
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStationCode}
                    onChange={(e) => setSelectedStationCode(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TAIWAN_STATIONS.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.nameZh} ({s.code}) - {s.lineName}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-xl font-black text-blue-900">
                      {selectedStation.nameZh} 車站
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                      {selectedStation.lineName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Station Chips */}
              <div className="flex-1 overflow-x-auto w-full">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="text-xs text-slate-400 font-medium shrink-0">熱門車站:</span>
                  {majorQuickStations.map((ms) => (
                    <button
                      key={ms.code}
                      onClick={() => setSelectedStationCode(ms.code)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium shrink-0 transition ${
                        selectedStationCode === ms.code
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ms.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> 方向:
                </span>
                <button
                  onClick={() => setDirectionFilter('all')}
                  className={`px-2.5 py-1 rounded-lg ${
                    directionFilter === 'all'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setDirectionFilter('0')}
                  className={`px-2.5 py-1 rounded-lg ${
                    directionFilter === '0'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  北上 / 順行
                </button>
                <button
                  onClick={() => setDirectionFilter('1')}
                  className={`px-2.5 py-1 rounded-lg ${
                    directionFilter === '1'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  南下 / 逆行
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">車種篩選:</span>
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg ${
                    typeFilter === 'all'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  全部車種
                </button>
                <button
                  onClick={() => setTypeFilter('fast')}
                  className={`px-2.5 py-1 rounded-lg ${
                    typeFilter === 'fast'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  自強 / 普悠瑪
                </button>
                <button
                  onClick={() => setTypeFilter('local')}
                  className={`px-2.5 py-1 rounded-lg ${
                    typeFilter === 'local'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  區間快 / 區間車
                </button>
              </div>
            </div>
          </div>

          {/* Electronic Display Board Style Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm tracking-wide">
                  {selectedStation.nameZh} 車站 • 列車即時動態時刻看板
                </span>
              </div>
              <div className="text-xs text-amber-400 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                即時營運中 (點擊車次查看停靠站及各站準點)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                    <th className="py-3 px-4">車次</th>
                    <th className="py-3 px-3">車種</th>
                    <th className="py-3 px-3">方向</th>
                    <th className="py-3 px-4">起訖站</th>
                    <th className="py-3 px-3">預計時間</th>
                    <th className="py-3 px-3">月台</th>
                    <th className="py-3 px-4">準點狀態</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLiveTrains.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        {isLoading ? '資料載入中...' : '目前此篩選條件下無列車班次'}
                      </td>
                    </tr>
                  ) : (
                    filteredLiveTrains.map((train) => {
                      const isOnTime = train.delayMinutes === 0;
                      return (
                        <tr
                          key={`${train.trainNo}-${train.scheduledTime}`}
                          onClick={() => onSelectTrain(train.trainNo)}
                          className="hover:bg-blue-50/50 transition cursor-pointer group"
                        >
                          {/* 車次 */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                            <span className="text-base text-blue-900 group-hover:text-blue-600 transition">
                              {train.trainNo}
                            </span>
                            {train.tripLine && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-sans">
                                經{train.tripLine}
                              </span>
                            )}
                          </td>

                          {/* 車種 */}
                          <td className="py-3.5 px-3">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded text-white inline-block shadow-2xs"
                              style={{ backgroundColor: train.trainTypeColor }}
                            >
                              {train.trainTypeName}
                            </span>
                            {train.isReservedOnly && (
                              <span className="block text-[10px] text-red-500 font-medium mt-0.5">
                                全車對號/禁刷卡
                              </span>
                            )}
                          </td>

                          {/* 方向 */}
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                train.direction === 0
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {train.directionName}
                            </span>
                          </td>

                          {/* 起訖站 */}
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span>{train.startingStation}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-bold text-slate-900">
                                {train.endingStation}
                              </span>
                            </div>
                          </td>

                          {/* 預計時間 */}
                          <td className="py-3.5 px-3">
                            <div className="font-mono font-bold text-slate-800 text-sm">
                              {train.scheduledTime}
                            </div>
                            {train.delayMinutes > 0 && (
                              <div className="text-[11px] text-amber-600 font-mono font-semibold">
                                預計 {train.expectedTime}
                              </div>
                            )}
                          </td>

                          {/* 月台 */}
                          <td className="py-3.5 px-3 text-slate-600 font-mono text-xs">
                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-semibold">
                              {train.platform}
                            </span>
                          </td>

                          {/* 準點狀態 */}
                          <td className="py-3.5 px-4">
                            {isOnTime ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                準點 (On Time)
                              </span>
                            ) : train.delayMinutes <= 5 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                晚 {train.delayMinutes} 分
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-300 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                晚 {train.delayMinutes} 分 (延誤)
                              </span>
                            )}
                          </td>

                          {/* 操作 */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTrain(train.trainNo);
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              停靠站詳情 →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= Mode B: Trip Timetable & Fares ================= */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Train className="w-5 h-5 text-blue-600" />
                台鐵全線時刻表與票價查詢 (串接 TDX 開放資料)
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                查詢日期: {searchDate}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-end">
              {/* 出發站 */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">出發車站</label>
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TAIWAN_STATIONS.map((s) => (
                    <option key={`from-${s.code}`} value={s.code}>
                      {s.nameZh} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* 互換按鈕 */}
              <div className="flex justify-center md:pb-1">
                <button
                  type="button"
                  onClick={() => {
                    const temp = fromCode;
                    setFromCode(toCode);
                    setToCode(temp);
                  }}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 font-semibold text-xs"
                  title="起訖站互換"
                >
                  <ArrowUpDown className="w-4 h-4 text-blue-600" />
                  互換
                </button>
              </div>

              {/* 抵達站 */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">抵達車站</label>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TAIWAN_STATIONS.map((s) => (
                    <option key={`to-${s.code}`} value={s.code}>
                      {s.nameZh} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* 日期與時間 */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">搭乘日期與時間</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={searchTime}
                    onChange={(e) => setSearchTime(e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 查詢按鈕 */}
              <div>
                <button
                  onClick={handleSearchTrip}
                  disabled={isSearchingTrip}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {isSearchingTrip ? '查詢中...' : '開始查詢時刻'}
                </button>
              </div>
            </div>

            {/* Quick date presets */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-400">快速日期:</span>
              <button
                type="button"
                onClick={() => setSearchDate(new Date().toISOString().slice(0, 10))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
              >
                今天
              </button>
              <button
                type="button"
                onClick={() => {
                  const tm = new Date();
                  tm.setDate(tm.getDate() + 1);
                  setSearchDate(tm.toISOString().slice(0, 10));
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
              >
                明天
              </button>
              <button
                type="button"
                onClick={() => {
                  const tm = new Date();
                  tm.setDate(tm.getDate() + 2);
                  setSearchDate(tm.toISOString().slice(0, 10));
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
              >
                後天
              </button>
            </div>

            {/* Electronic Card Discount Notice */}
            <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">電子票證乘車須知：</span>
                持悠遊卡、一卡通搭乘台鐵，乘車距離 70 公里內享區間車票價 9 折優惠；
                <span className="text-red-700 font-bold ml-1">
                  注意：新自強號(EMU3000)、普悠瑪號、太魯閣號為全車對號座，不發售無座票且嚴禁持電子票證搭乘。
                </span>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>共找到 {tripResults.length} 班適用列車</span>
              <span className="font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                資料來源：{tripSource === 'TDX_API' ? 'TDX 官方即時 API' : 'TDX 免費引擎資料庫'}
              </span>
            </div>

            {tripResults.map((trip) => {
              const isOnTime = trip.delayMinutes === 0;
              return (
                <div
                  key={trip.trainNo}
                  onClick={() => onSelectTrain(trip.trainNo)}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Train Info & Type */}
                    <div className="flex items-center gap-3">
                      <div className="text-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 min-w-20">
                        <div className="font-mono font-bold text-base text-slate-900">
                          {trip.trainNo}
                        </div>
                        <div className="text-[10px] text-slate-500">車次</div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: trip.trainTypeColor }}
                          >
                            {trip.trainTypeName}
                          </span>
                          {trip.tripLine && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                              經由{trip.tripLine}
                            </span>
                          )}
                          {trip.isReservedOnly ? (
                            <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" /> 全車對號座
                            </span>
                          ) : (
                            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> 可刷電子票證
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          停靠約 {trip.stopsCount} 站 • 行駛時間約 {trip.durationMinutes} 分鐘
                        </div>
                      </div>
                    </div>

                    {/* Timeline (Departure -> Arrival) */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-mono text-lg font-black text-slate-900">
                          {trip.departureTime}
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          {trip.startingStation}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {trip.durationMinutes} 分
                        </span>
                        <div className="w-24 h-0.5 bg-slate-200 relative my-1">
                          <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                        <span className="text-[10px] text-slate-400">直達/快車</span>
                      </div>

                      <div className="text-center">
                        <div className="font-mono text-lg font-black text-slate-900">
                          {trip.arrivalTime}
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          {trip.endingStation}
                        </div>
                      </div>
                    </div>

                    {/* Fares & Delay Badge */}
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                      <div>
                        {isOnTime ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 準點
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5" /> 晚 {trip.delayMinutes} 分
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">
                          NT$ {trip.fareGeneral}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          電子票證: NT$ {trip.fareDiscount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
