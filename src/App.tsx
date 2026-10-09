/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Station } from './types/railway';
import { TAIWAN_STATIONS } from './data/railwayData';
import { LiveTimetable } from './components/LiveTimetable';
import { RailwayMap } from './components/RailwayMap';
import { AIChatBot } from './components/AIChatBot';
import { NetworkStatusView } from './components/NetworkStatusView';
import { TrainDetailModal } from './components/TrainDetailModal';
import { TDXSettingsModal } from './components/TDXSettingsModal';
import { 
  Train, MapPin, MessageSquare, Activity, Settings, 
  Clock, ShieldCheck, ExternalLink, Sparkles, AlertCircle 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'timetable' | 'map' | 'chat' | 'status'>('timetable');
  const [selectedStation, setSelectedStation] = useState<Station | null>(() => TAIWAN_STATIONS[7]); // Default Taipei
  const [activeTrainModal, setActiveTrainModal] = useState<string | null>(null);
  const [isTdxModalOpen, setIsTdxModalOpen] = useState<boolean>(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleString('zh-TW', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Top Notice Bar */}
      <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">
            交通部 TDX 免費即時資料串接已啟用
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            全台 240+ 站即時看板、車次準點/誤點追蹤、互動式鐵路圖
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-amber-400 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {currentTimeStr || '2026/10/08'}
          </span>
          <a
            href="https://www.trc.com.tw/tra-tip-web/tip"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 text-slate-400 hover:text-white transition"
          >
            台鐵官網 tip <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-linear-to-r from-[#002b54] to-[#0a3b6f] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-inner">
              <Train className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wide text-white">
                  台鐵即時動態與地圖查詢
                </h1>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                  TRC TIP
                </span>
              </div>
              <p className="text-xs text-blue-200 font-medium">
                國營臺灣鐵路股份有限公司 • 串接免費 TDX 運輸開放平台
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'timetable', label: '即時看板與時刻', icon: Clock },
              { id: 'map', label: '全台鐵路地圖', icon: MapPin },
              { id: 'chat', label: 'AI 鐵路小幫手', icon: MessageSquare, badge: 'AI' },
              { id: 'status', label: '全線營運概況', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-white text-blue-950 shadow-md scale-102'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded-sm">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* TDX Settings Trigger */}
            <button
              onClick={() => setIsTdxModalOpen(true)}
              className="p-2 ml-1 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition"
              title="TDX API 設定"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {activeTab === 'timetable' && (
          <LiveTimetable
            onSelectTrain={(trainNo) => setActiveTrainModal(trainNo)}
            initialStationCode={selectedStation?.code || '1000'}
            onOpenTdxSettings={() => setIsTdxModalOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <RailwayMap
            onSelectStation={(station) => {
              setSelectedStation(station);
            }}
            selectedStation={selectedStation}
            onSelectTrain={(trainNo) => setActiveTrainModal(trainNo)}
          />
        )}

        {activeTab === 'chat' && (
          <AIChatBot
            onSelectTrain={(trainNo) => setActiveTrainModal(trainNo)}
            onSelectStationByName={(stName) => {
              const found = TAIWAN_STATIONS.find((s) => s.nameZh.includes(stName));
              if (found) {
                setSelectedStation(found);
                setActiveTab('map');
              }
            }}
          />
        )}

        {activeTab === 'status' && <NetworkStatusView />}
      </main>

      {/* Train Detail Modal */}
      <TrainDetailModal
        trainNo={activeTrainModal}
        onClose={() => setActiveTrainModal(null)}
      />

      {/* TDX API Settings Modal */}
      <TDXSettingsModal
        isOpen={isTdxModalOpen}
        onClose={() => setIsTdxModalOpen(false)}
      />

      {/* Floating Chat Quick-Access Bubble (When not on chat tab) */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-6 right-6 z-40 bg-linear-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white/40"
          title="開啟 AI 鐵路聊天室小幫手"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline">
            台鐵智能小幫手
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Train className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-bold text-slate-200">
                台鐵即時動態與地圖查詢系統 (TRC TIP Companion)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                依據國營臺灣鐵路股份有限公司網站標準與交通部 TDX 運輸資料流通平台開放資料打造
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>© 2026 Taiwan Railway Corporation • Open Data</span>
            <button
              onClick={() => setIsTdxModalOpen(true)}
              className="hover:text-blue-400 transition underline"
            >
              TDX 串接設定
            </button>
            <a
              href="https://www.trc.com.tw/tra-tip-web/tip"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition underline flex items-center gap-1"
            >
              台鐵官網 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
