import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Station, TrainLiveItem } from '../types/railway';
import { TAIWAN_STATIONS, TAIWAN_RAILWAY_TRACKS, RAILWAY_LINES } from '../data/railwayData';
import { Train, Clock, Navigation, MapPin, RefreshCw, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface RailwayMapProps {
  onSelectStation: (station: Station) => void;
  selectedStation: Station | null;
  onSelectTrain: (trainNo: string) => void;
}

export const RailwayMap: React.FC<RailwayMapProps> = ({
  onSelectStation,
  selectedStation,
  onSelectTrain,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [code: string]: L.Marker }>({});
  
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stationLiveTrains, setStationLiveTrains] = useState<TrainLiveItem[]>([]);
  const [isLoadingBoard, setIsLoadingBoard] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Taiwan
    const map = L.map(mapContainerRef.current, {
      center: [23.8, 120.95],
      zoom: 8,
      zoomControl: true,
      minZoom: 7,
      maxZoom: 15,
    });

    mapInstanceRef.current = map;

    // Clean TileLayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TDX 交通部',
      maxZoom: 18,
    }).addTo(map);

    // Draw Railway Lines Tracks
    TAIWAN_RAILWAY_TRACKS.forEach((trackCoords, idx) => {
      // Main casing line (dark border)
      L.polyline(trackCoords, {
        color: '#1e293b',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Inner railroad styled dashed/solid line
      const colors = ['#2563eb', '#0891b2', '#e11d48', '#0d9488'];
      L.polyline(trackCoords, {
        color: colors[idx % colors.length] || '#2563eb',
        weight: 3.5,
        opacity: 0.95,
      }).addTo(map);
    });

    // Add station markers
    TAIWAN_STATIONS.forEach((station) => {
      const isMajor = station.isMajor;
      
      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-4 h-4 rounded-full border-2 ${
              isMajor 
                ? 'bg-blue-600 border-white ring-2 ring-blue-500 shadow-md scale-110' 
                : 'bg-white border-slate-600'
            } transition-transform hover:scale-150"></div>
            ${isMajor ? `
              <span class="absolute left-1/2 -translate-x-1/2 -bottom-5 text-[11px] font-bold bg-slate-900/80 text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                ${station.nameZh}
              </span>
            ` : ''}
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onSelectStation(station);
        });

      marker.bindTooltip(`
        <div class="p-1 text-xs font-semibold text-slate-800">
          <div class="font-bold text-sm text-blue-700">${station.nameZh} (${station.nameEn})</div>
          <div class="text-[11px] text-slate-500">${station.lineName} • 站碼 ${station.code}</div>
          ${station.transfers ? `<div class="mt-1 text-emerald-600 text-[10px]">轉乘: ${station.transfers.join(', ')}</div>` : ''}
        </div>
      `, { direction: 'top', offset: [0, -10] });

      markersRef.current[station.code] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync selection with map center and drawer
  useEffect(() => {
    if (!selectedStation) {
      setShowDrawer(false);
      return;
    }

    setShowDrawer(true);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedStation.lat, selectedStation.lng], 11, {
        animate: true,
      });
    }

    // Fetch live board for this station
    setIsLoadingBoard(true);
    fetch(`/api/tdx/live-board/${selectedStation.code}`)
      .then((res) => res.json())
      .then((data) => {
        setStationLiveTrains(data.trains || []);
      })
      .catch((err) => {
        console.error('Failed to load station live board:', err);
      })
      .finally(() => {
        setIsLoadingBoard(false);
      });
  }, [selectedStation]);

  // Filter stations for search or region
  const filteredStations = TAIWAN_STATIONS.filter((s) => {
    const matchesRegion = activeRegion === 'all' || s.region === activeRegion;
    const matchesSearch =
      searchQuery === '' ||
      s.nameZh.includes(searchQuery) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.includes(searchQuery);
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
      {/* Left Station Explorer Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-50 border-r border-slate-200 flex flex-col z-10 shrink-0">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              全台鐵路各站查詢
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              {filteredStations.length} 站
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="搜尋站名 (如: 台北, 台中, 花蓮...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Region Tabs */}
          <div className="grid grid-cols-6 gap-1 text-xs">
            {[
              { id: 'all', label: '全部' },
              { id: 'north', label: '北部' },
              { id: 'central', label: '中部' },
              { id: 'south', label: '南部' },
              { id: 'east', label: '東部' },
              { id: 'branch', label: '支線' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id)}
                className={`py-1.5 rounded text-center font-medium transition ${
                  activeRegion === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200/80 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filteredStations.map((station) => {
            const isSelected = selectedStation?.code === station.code;
            return (
              <button
                key={station.code}
                onClick={() => onSelectStation(station)}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group ${
                  isSelected
                    ? 'bg-blue-50 border border-blue-300 shadow-sm'
                    : 'hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      station.isMajor
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {station.nameZh.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {station.nameZh}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {station.code}
                      </span>
                      {station.isMajor && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1 rounded">
                          特等/一等
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{station.lineName}</span>
                      {station.transfers && (
                        <span className="text-emerald-600 font-medium text-[11px]">
                          可轉乘 {station.transfers.join('/')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition ${
                    isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Interactive Map Container */}
      <div className="flex-1 relative h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-xs hidden sm:block pointer-events-auto">
          <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-blue-600" />
            台鐵主要路網圖示
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-blue-600 rounded"></span>
              <span className="text-slate-600">西部幹線 (縱貫線北/南段)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-600 rounded"></span>
              <span className="text-slate-600">海岸線 (海線)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-teal-600 rounded"></span>
              <span className="text-slate-600">東部幹線 (宜蘭/北迴/臺東)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-rose-600 rounded"></span>
              <span className="text-slate-600">南迴線 (枋寮-臺東)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              <span className="text-slate-700 font-medium">主要停靠站 (特等/一等)</span>
            </div>
          </div>
        </div>

        {/* Bottom Station Detail Drawer (When station selected) */}
        {showDrawer && selectedStation && (
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedStation.nameZh}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedStation.nameZh} 車站
                    </h3>
                    <span className="text-sm text-slate-500 font-mono">
                      {selectedStation.nameEn} ({selectedStation.code})
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      {selectedStation.lineName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                    <span>GPS: {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}</span>
                    {selectedStation.transfers && (
                      <span className="text-emerald-600 font-semibold">
                        轉乘樞紐: {selectedStation.transfers.join(' / ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsLoadingBoard(true);
                    fetch(`/api/tdx/live-board/${selectedStation.code}`)
                      .then((r) => r.json())
                      .then((d) => setStationLiveTrains(d.trains || []))
                      .finally(() => setIsLoadingBoard(false));
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                  title="重新整理即時看板"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingBoard ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg transition"
                >
                  關閉
                </button>
              </div>
            </div>

            {/* Live Board inside drawer */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  即時發車看板 (每站是否準點動態)
                </div>
                <div className="text-[11px] text-slate-500">
                  即時串接 TDX 運輸資料
                </div>
              </div>

              {isLoadingBoard ? (
                <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  載入最新班次與誤點資訊中...
                </div>
              ) : stationLiveTrains.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  目前此時段尚無即時列車資料
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {stationLiveTrains.slice(0, 6).map((train) => {
                    const isOnTime = train.delayMinutes === 0;
                    return (
                      <div
                        key={`${train.trainNo}-${train.scheduledTime}`}
                        onClick={() => onSelectTrain(train.trainNo)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 font-mono">
                              {train.trainNo} 次
                            </span>
                            <span
                              className="text-[11px] font-bold px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: train.trainTypeColor }}
                            >
                              {train.trainTypeName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              往 {train.endingStation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="font-mono font-semibold text-slate-700">
                              {train.scheduledTime}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {train.platform}
                            </span>
                          </div>
                        </div>

                        {/* Delay / Punctuality Indicator */}
                        <div className="text-right">
                          {isOnTime ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              準點
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              晚 {train.delayMinutes} 分
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
