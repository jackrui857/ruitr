export type LineRegion = 'north' | 'central' | 'south' | 'east' | 'branch';

export interface Station {
  id: string;
  code: string; // 4-digit station code e.g. "1000"
  nameZh: string;
  nameEn: string;
  lineId: string;
  lineName: string;
  region: LineRegion;
  lat: number;
  lng: number;
  isMajor: boolean;
  transfers?: ('HSR' | 'MRT' | 'Airport' | 'LRT')[];
  address?: string;
}

export interface TrainTypeInfo {
  code: string;
  name: string;
  nameEn: string;
  color: string;
  badgeBg: string;
  isReservedOnly: boolean; // e.g. EMU3000 / Puyuma
  canUseEasyCard: boolean; // 悠遊卡/一卡通電子票證
  speedLevel: 'fast' | 'medium' | 'local';
}

export interface TrainLiveItem {
  trainNo: string;
  trainTypeCode: string;
  trainTypeName: string;
  trainTypeColor: string;
  direction: 0 | 1; // 0: 順行(北上/逆時鐘), 1: 逆行(南下/順時鐘)
  directionName: '北上' | '南下' | '順行' | '逆行';
  startingStation: string;
  endingStation: string;
  scheduledTime: string; // HH:mm
  expectedTime: string;  // HH:mm
  delayMinutes: number;  // 0 is on-time, >0 is late
  platform: string;      // e.g. "第 2 月台 B 側"
  tripLine?: '山線' | '海線' | '成追線' | '一般';
  wheelChair?: boolean;
  bike?: boolean;
  breastFeed?: boolean;
  isReservedOnly?: boolean;
}

export interface TrainStop {
  seq: number;
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  delayMinutes: number;
  isPassed: boolean;
  isCurrent?: boolean;
}

export interface TrainDetail {
  trainNo: string;
  trainTypeCode: string;
  trainTypeName: string;
  startingStation: string;
  endingStation: string;
  direction: 0 | 1;
  tripLine?: string;
  note?: string;
  wheelChair?: boolean;
  bike?: boolean;
  delayMinutes: number;
  stops: TrainStop[];
  currentStation?: string;
}

export interface StationLiveBoardResponse {
  station: Station;
  updatedAt: string;
  source: 'TDX_API' | 'TDX_SIMULATED_ENGINE';
  trains: TrainLiveItem[];
}

export interface TimetableSearchResult {
  trainNo: string;
  trainTypeCode: string;
  trainTypeName: string;
  trainTypeColor: string;
  startingStation: string;
  endingStation: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  delayMinutes: number;
  fareGeneral: number;
  fareDiscount: number; // e.g. 電子票證優惠
  tripLine?: string;
  isReservedOnly: boolean;
  stopsCount: number;
}

export interface NetworkStatus {
  totalActiveTrains: number;
  onTimeTrains: number;
  delayedTrains: number;
  punctualityRate: number; // percentage e.g. 96.4
  avgDelayMinutes: number;
  maxDelayMinutes: number;
  maxDelayTrainNo: string;
  lineAlerts: {
    lineName: string;
    status: 'NORMAL' | 'MINOR_DELAY' | 'MAINTENANCE';
    message: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  attachedData?: {
    type: 'live-board' | 'train-detail' | 'timetable';
    title: string;
    items?: any[];
    trainNo?: string;
    stationName?: string;
  };
}
