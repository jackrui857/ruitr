import { Station, TrainTypeInfo } from '../types/railway';

export const TRAIN_TYPES: Record<string, TrainTypeInfo> = {
  'EMU3000': {
    code: '1',
    name: '新自強號(EMU3000)',
    nameEn: 'Tze-Chiang (EMU3000)',
    color: '#0284c7', // Sky-600
    badgeBg: 'bg-sky-600 text-white',
    isReservedOnly: true,
    canUseEasyCard: false,
    speedLevel: 'fast',
  },
  'PUYUMA': {
    code: '2',
    name: '普悠瑪號',
    nameEn: 'Puyuma Express',
    color: '#dc2626', // Red-600
    badgeBg: 'bg-red-600 text-white',
    isReservedOnly: true,
    canUseEasyCard: false,
    speedLevel: 'fast',
  },
  'TAROKO': {
    code: '3',
    name: '太魯閣號',
    nameEn: 'Taroko Express',
    color: '#ea580c', // Orange-600
    badgeBg: 'bg-orange-600 text-white',
    isReservedOnly: true,
    canUseEasyCard: false,
    speedLevel: 'fast',
  },
  'TC': {
    code: '4',
    name: '自強號',
    nameEn: 'Tze-Chiang Ltd. Exp.',
    color: '#b45309', // Amber-700
    badgeBg: 'bg-amber-600 text-white',
    isReservedOnly: false,
    canUseEasyCard: true,
    speedLevel: 'fast',
  },
  'CK': {
    code: '5',
    name: '莒光號',
    nameEn: 'Chu-Kuang Express',
    color: '#d97706', // Amber-500
    badgeBg: 'bg-amber-500 text-white',
    isReservedOnly: false,
    canUseEasyCard: true,
    speedLevel: 'medium',
  },
  'LOCAL_FAST': {
    code: '6',
    name: '區間快',
    nameEn: 'Fast Local Train',
    color: '#059669', // Emerald-600
    badgeBg: 'bg-emerald-600 text-white',
    isReservedOnly: false,
    canUseEasyCard: true,
    speedLevel: 'medium',
  },
  'LOCAL': {
    code: '7',
    name: '區間車',
    nameEn: 'Local Train',
    color: '#2563eb', // Blue-600
    badgeBg: 'bg-blue-600 text-white',
    isReservedOnly: false,
    canUseEasyCard: true,
    speedLevel: 'local',
  },
};

export const RAILWAY_LINES = [
  { id: 'west-north', name: '縱貫線北段 (基隆-竹南)', color: '#2563eb' },
  { id: 'west-mountain', name: '臺中線(山線) (竹南-彰化)', color: '#d97706' },
  { id: 'west-coast', name: '海岸線(海線) (竹南-彰化)', color: '#0891b2' },
  { id: 'west-south', name: '縱貫線南段 (彰化-高雄)', color: '#059669' },
  { id: 'pingtung', name: '屏東線 (高雄-枋寮)', color: '#7c3aed' },
  { id: 'south-link', name: '南迴線 (枋寮-臺東)', color: '#e11d48' },
  { id: 'yilan', name: '宜蘭線 (八堵-蘇澳)', color: '#0d9488' },
  { id: 'north-link', name: '北迴線 (蘇澳新-花蓮)', color: '#4f46e5' },
  { id: 'taitung', name: '臺東線 (花蓮-臺東)', color: '#ca8a04' },
  { id: 'pingxi', name: '平溪/深澳線', color: '#16a34a' },
  { id: 'neiwan', name: '內灣/六家線', color: '#9333ea' },
  { id: 'jiji', name: '集集線', color: '#ea580c' },
  { id: 'shalun', name: '沙崙線', color: '#0284c7' },
];

// Comprehensive Taiwan Railway stations with genuine GPS coordinates
export const TAIWAN_STATIONS: Station[] = [
  // 北段 (Keelung - Zhunan)
  { id: '0900', code: '0900', nameZh: '基隆', nameEn: 'Keelung', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.1325, lng: 121.7397, isMajor: true },
  { id: '0920', code: '0920', nameZh: '八堵', nameEn: 'Badu', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.1086, lng: 121.7289, isMajor: false },
  { id: '0930', code: '0930', nameZh: '七堵', nameEn: 'Qidu', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0931, lng: 121.7142, isMajor: true },
  { id: '0960', code: '0960', nameZh: '汐止', nameEn: 'Xizhi', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0682, lng: 121.6628, isMajor: true },
  { id: '0970', code: '0970', nameZh: '汐科', nameEn: 'Xike', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0617, lng: 121.6469, isMajor: false },
  { id: '0980', code: '0980', nameZh: '南港', nameEn: 'Nangang', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0531, lng: 121.6067, isMajor: true, transfers: ['HSR', 'MRT'] },
  { id: '0990', code: '0990', nameZh: '松山', nameEn: 'Songshan', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0494, lng: 121.5781, isMajor: true, transfers: ['MRT'] },
  { id: '1000', code: '1000', nameZh: '台北', nameEn: 'Taipei', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0478, lng: 121.5170, isMajor: true, transfers: ['HSR', 'MRT', 'Airport'] },
  { id: '1010', code: '1010', nameZh: '萬華', nameEn: 'Wanhua', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0333, lng: 121.4998, isMajor: true, transfers: ['MRT'] },
  { id: '1020', code: '1020', nameZh: '板橋', nameEn: 'Banqiao', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 25.0136, lng: 121.4637, isMajor: true, transfers: ['HSR', 'MRT'] },
  { id: '1030', code: '1030', nameZh: '樹林', nameEn: 'Shulin', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9912, lng: 121.4243, isMajor: true },
  { id: '1040', code: '1040', nameZh: '山佳', nameEn: 'Shanjia', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9723, lng: 121.3934, isMajor: false },
  { id: '1050', code: '1050', nameZh: '鶯歌', nameEn: 'Yingge', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9547, lng: 121.3556, isMajor: true },
  { id: '1060', code: '1060', nameZh: '桃園', nameEn: 'Taoyuan', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9892, lng: 121.3135, isMajor: true },
  { id: '1070', code: '1070', nameZh: '內壢', nameEn: 'Neili', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9724, lng: 121.2582, isMajor: false },
  { id: '1080', code: '1080', nameZh: '中壢', nameEn: 'Zhongli', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9538, lng: 121.2259, isMajor: true, transfers: ['MRT'] },
  { id: '1090', code: '1090', nameZh: '埔心', nameEn: 'Puxin', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9197, lng: 121.1828, isMajor: false },
  { id: '1100', code: '1100', nameZh: '楊梅', nameEn: 'Yangmei', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9142, lng: 121.1461, isMajor: true },
  { id: '1110', code: '1110', nameZh: '富岡', nameEn: 'Fugang', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.9333, lng: 121.0827, isMajor: false },
  { id: '1120', code: '1120', nameZh: '新豐', nameEn: 'Xinfeng', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.8987, lng: 120.9856, isMajor: false },
  { id: '1130', code: '1130', nameZh: '竹北', nameEn: 'Zhubei', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.8398, lng: 121.0097, isMajor: true },
  { id: '1210', code: '1210', nameZh: '新竹', nameEn: 'Hsinchu', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.8018, lng: 120.9716, isMajor: true },
  { id: '1220', code: '1220', nameZh: '三姓橋', nameEn: 'Sanxingqiao', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.7772, lng: 120.9328, isMajor: false },
  { id: '1230', code: '1230', nameZh: '香山', nameEn: 'Xiangshan', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.7634, lng: 120.9148, isMajor: false },
  { id: '1250', code: '1250', nameZh: '竹南', nameEn: 'Zhunan', lineId: 'west-north', lineName: '縱貫線北段', region: 'north', lat: 24.6865, lng: 120.8752, isMajor: true },

  // 山線 (Zhunan - Changhua)
  { id: '3160', code: '3160', nameZh: '苗栗', nameEn: 'Miaoli', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.5701, lng: 120.8239, isMajor: true },
  { id: '3170', code: '3170', nameZh: '南勢', nameEn: 'Nanshi', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.5228, lng: 120.7938, isMajor: false },
  { id: '3180', code: '3180', nameZh: '銅鑼', nameEn: 'Tongluo', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.4878, lng: 120.7876, isMajor: false },
  { id: '3190', code: '3190', nameZh: '三義', nameEn: 'Sanyi', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.4131, lng: 120.7709, isMajor: false },
  { id: '3210', code: '3210', nameZh: '泰安', nameEn: 'Tai\'an', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.3297, lng: 120.7497, isMajor: false },
  { id: '3220', code: '3220', nameZh: '后里', nameEn: 'Houli', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.3075, lng: 120.7138, isMajor: true },
  { id: '3230', code: '3230', nameZh: '豐原', nameEn: 'Fengyuan', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.2536, lng: 120.7235, isMajor: true },
  { id: '3250', code: '3250', nameZh: '潭子', nameEn: 'Tanzi', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.2081, lng: 120.7061, isMajor: false },
  { id: '3280', code: '3280', nameZh: '太原', nameEn: 'Taiyuan', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.1643, lng: 120.6998, isMajor: false },
  { id: '3300', code: '3300', nameZh: '台中', nameEn: 'Taichung', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.1368, lng: 120.6850, isMajor: true, transfers: ['MRT'] },
  { id: '3320', code: '3320', nameZh: '大慶', nameEn: 'Daqing', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.1158, lng: 120.6543, isMajor: false, transfers: ['MRT'] },
  { id: '3330', code: '3330', nameZh: '烏日', nameEn: 'Wuri', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.1082, lng: 120.6231, isMajor: false },
  { id: '3340', code: '3340', nameZh: '新烏日', nameEn: 'Xinwuri', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.1118, lng: 120.6151, isMajor: true, transfers: ['HSR', 'MRT'] },
  { id: '3350', code: '3350', nameZh: '成功', nameEn: 'Chenggong', lineId: 'west-mountain', lineName: '臺中線(山線)', region: 'central', lat: 24.1147, lng: 120.5901, isMajor: false },

  // 海線 (Zhunan - Changhua)
  { id: '2110', code: '2110', nameZh: '後龍', nameEn: 'Houlong', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.6152, lng: 120.7877, isMajor: false },
  { id: '2130', code: '2130', nameZh: '通霄', nameEn: 'Tongxiao', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.4927, lng: 120.6806, isMajor: true },
  { id: '2140', code: '2140', nameZh: '苑裡', nameEn: 'Yuanli', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.4428, lng: 120.6558, isMajor: true },
  { id: '2160', code: '2160', nameZh: '大甲', nameEn: 'Dajia', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.3444, lng: 120.6251, isMajor: true },
  { id: '2180', code: '2180', nameZh: '清水', nameEn: 'Qingshui', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.2638, lng: 120.5739, isMajor: true },
  { id: '2190', code: '2190', nameZh: '沙鹿', nameEn: 'Shalu', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.2366, lng: 120.5583, isMajor: true },
  { id: '2210', code: '2210', nameZh: '大肚', nameEn: 'Dadu', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.1561, lng: 120.5408, isMajor: false },
  { id: '2220', code: '2220', nameZh: '追分', nameEn: 'Zhuifen', lineId: 'west-coast', lineName: '海岸線(海線)', region: 'central', lat: 24.1206, lng: 120.5700, isMajor: false },

  // 南段 (Changhua - Kaohsiung)
  { id: '3360', code: '3360', nameZh: '彰化', nameEn: 'Changhua', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 24.0817, lng: 120.5386, isMajor: true },
  { id: '3390', code: '3390', nameZh: '員林', nameEn: 'Yuanlin', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 23.9592, lng: 120.5706, isMajor: true },
  { id: '3410', code: '3410', nameZh: '社頭', nameEn: 'Shetou', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 23.8967, lng: 120.5878, isMajor: false },
  { id: '3420', code: '3420', nameZh: '田中', nameEn: 'Tianzhong', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 23.8601, lng: 120.5898, isMajor: true },
  { id: '3430', code: '3430', nameZh: '二水', nameEn: 'Ershui', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 23.8068, lng: 120.6178, isMajor: true },
  { id: '3470', code: '3470', nameZh: '斗六', nameEn: 'Douliu', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 23.7118, lng: 120.5441, isMajor: true },
  { id: '3480', code: '3480', nameZh: '斗南', nameEn: 'Dounan', lineId: 'west-south', lineName: '縱貫線南段', region: 'central', lat: 23.6766, lng: 120.4815, isMajor: true },
  { id: '4050', code: '4050', nameZh: '大林', nameEn: 'Dalin', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.6027, lng: 120.4735, isMajor: false },
  { id: '4060', code: '4060', nameZh: '民雄', nameEn: 'Minxiong', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.5539, lng: 120.4326, isMajor: true },
  { id: '4080', code: '4080', nameZh: '嘉義', nameEn: 'Chiayi', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.4792, lng: 120.4414, isMajor: true },
  { id: '4090', code: '4090', nameZh: '水上', nameEn: 'Shuishang', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.4294, lng: 120.3986, isMajor: false },
  { id: '4110', code: '4110', nameZh: '後壁', nameEn: 'Houbi', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.3664, lng: 120.3601, isMajor: false },
  { id: '4120', code: '4120', nameZh: '新營', nameEn: 'Xinying', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.3075, lng: 120.3228, isMajor: true },
  { id: '4140', code: '4140', nameZh: '林鳳營', nameEn: 'Linfengying', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.2389, lng: 120.3156, isMajor: false },
  { id: '4160', code: '4160', nameZh: '隆田', nameEn: 'Longtian', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.1912, lng: 120.3168, isMajor: false },
  { id: '4180', code: '4180', nameZh: '善化', nameEn: 'Shanhua', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.1342, lng: 120.3013, isMajor: true },
  { id: '4190', code: '4190', nameZh: '南科', nameEn: 'Nanke', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.1118, lng: 120.2925, isMajor: false },
  { id: '4210', code: '4210', nameZh: '永康', nameEn: 'Yongkang', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 23.0336, lng: 120.2575, isMajor: true },
  { id: '4220', code: '4220', nameZh: '台南', nameEn: 'Tainan', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.9972, lng: 120.2128, isMajor: true },
  { id: '4240', code: '4240', nameZh: '保安', nameEn: 'Bao\'an', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.9327, lng: 120.2312, isMajor: false },
  { id: '4250', code: '4250', nameZh: '中洲', nameEn: 'Zhongzhou', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.9068, lng: 120.2472, isMajor: false },
  { id: '4270', code: '4270', nameZh: '大湖', nameEn: 'Dahu', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.8758, lng: 120.2458, isMajor: false },
  { id: '4290', code: '4290', nameZh: '路竹', nameEn: 'Luzhu', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.8556, lng: 120.2618, isMajor: false },
  { id: '4310', code: '4310', nameZh: '岡山', nameEn: 'Gangshan', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.7938, lng: 120.2974, isMajor: true, transfers: ['MRT'] },
  { id: '4320', code: '4320', nameZh: '橋頭', nameEn: 'Qiaotou', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.7567, lng: 120.3094, isMajor: false, transfers: ['MRT'] },
  { id: '4330', code: '4330', nameZh: '楠梓', nameEn: 'Nanzi', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.7288, lng: 120.3278, isMajor: true },
  { id: '4340', code: '4340', nameZh: '新左營', nameEn: 'Xinzuoying', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.6872, lng: 120.3075, isMajor: true, transfers: ['HSR', 'MRT'] },
  { id: '4350', code: '4350', nameZh: '左營', nameEn: 'Zuoying', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.6712, lng: 120.2936, isMajor: false },
  { id: '4400', code: '4400', nameZh: '高雄', nameEn: 'Kaohsiung', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.6397, lng: 120.3021, isMajor: true, transfers: ['MRT'] },
  { id: '4420', code: '4420', nameZh: '鳳山', nameEn: 'Fengshan', lineId: 'west-south', lineName: '縱貫線南段', region: 'south', lat: 22.6288, lng: 120.3582, isMajor: true, transfers: ['MRT'] },

  // 屏東線 & 南迴線 (Kaohsiung - Pingtung - Taitung)
  { id: '5000', code: '5000', nameZh: '屏東', nameEn: 'Pingtung', lineId: 'pingtung', lineName: '屏東線', region: 'south', lat: 22.6692, lng: 120.4856, isMajor: true },
  { id: '5020', code: '5020', nameZh: '西勢', nameEn: 'Xishi', lineId: 'pingtung', lineName: '屏東線', region: 'south', lat: 22.6231, lng: 120.5289, isMajor: false },
  { id: '5050', code: '5050', nameZh: '潮州', nameEn: 'Chaozhou', lineId: 'pingtung', lineName: '屏東線', region: 'south', lat: 22.5498, lng: 120.5369, isMajor: true },
  { id: '5080', code: '5080', nameZh: '南州', nameEn: 'Nanzhou', lineId: 'pingtung', lineName: '屏東線', region: 'south', lat: 22.4912, lng: 120.5098, isMajor: false },
  { id: '5100', code: '5100', nameZh: '林邊', nameEn: 'Linbian', lineId: 'pingtung', lineName: '屏東線', region: 'south', lat: 22.4342, lng: 120.5147, isMajor: false },
  { id: '5120', code: '5120', nameZh: '枋寮', nameEn: 'Fangliao', lineId: 'south-link', lineName: '南迴線', region: 'south', lat: 22.3683, lng: 120.5962, isMajor: true },
  { id: '5140', code: '5140', nameZh: '枋山', nameEn: 'Fangshan', lineId: 'south-link', lineName: '南迴線', region: 'south', lat: 22.2589, lng: 120.6651, isMajor: false },
  { id: '5180', code: '5180', nameZh: '大武', nameEn: 'Dawu', lineId: 'south-link', lineName: '南迴線', region: 'east', lat: 22.3486, lng: 120.8992, isMajor: true },
  { id: '5200', code: '5200', nameZh: '金崙', nameEn: 'Jinlun', lineId: 'south-link', lineName: '南迴線', region: 'east', lat: 22.5312, lng: 120.9634, isMajor: false },
  { id: '5210', code: '5210', nameZh: '太麻里', nameEn: 'Taimali', lineId: 'south-link', lineName: '南迴線', region: 'east', lat: 22.6152, lng: 121.0062, isMajor: true },
  { id: '5230', code: '5230', nameZh: '知本', nameEn: 'Zhiben', lineId: 'south-link', lineName: '南迴線', region: 'east', lat: 22.7092, lng: 121.0664, isMajor: true },
  { id: '6000', code: '6000', nameZh: '台東', nameEn: 'Taitung', lineId: 'south-link', lineName: '南迴/臺東線', region: 'east', lat: 22.7938, lng: 121.1232, isMajor: true },

  // 東部幹線 (Yilan - Hualien - Taitung)
  { id: '7360', code: '7360', nameZh: '瑞芳', nameEn: 'Ruifang', lineId: 'yilan', lineName: '宜蘭線', region: 'north', lat: 25.1089, lng: 121.8061, isMajor: true },
  { id: '7350', code: '7350', nameZh: '猴硐', nameEn: 'Houtong', lineId: 'yilan', lineName: '宜蘭線', region: 'north', lat: 25.0872, lng: 121.8282, isMajor: false },
  { id: '7330', code: '7330', nameZh: '雙溪', nameEn: 'Shuangxi', lineId: 'yilan', lineName: '宜蘭線', region: 'north', lat: 25.0345, lng: 121.8656, isMajor: false },
  { id: '7310', code: '7310', nameZh: '福隆', nameEn: 'Fulong', lineId: 'yilan', lineName: '宜蘭線', region: 'north', lat: 25.0163, lng: 121.9442, isMajor: true },
  { id: '7250', code: '7250', nameZh: '頭城', nameEn: 'Toucheng', lineId: 'yilan', lineName: '宜蘭線', region: 'east', lat: 24.8586, lng: 121.8239, isMajor: true },
  { id: '7190', code: '7190', nameZh: '礁溪', nameEn: 'Jiaoxi', lineId: 'yilan', lineName: '宜蘭線', region: 'east', lat: 24.8292, lng: 121.7745, isMajor: true },
  { id: '7160', code: '7160', nameZh: '宜蘭', nameEn: 'Yilan', lineId: 'yilan', lineName: '宜蘭線', region: 'east', lat: 24.7547, lng: 121.7582, isMajor: true },
  { id: '7130', code: '7130', nameZh: '羅東', nameEn: 'Luodong', lineId: 'yilan', lineName: '宜蘭線', region: 'east', lat: 24.6775, lng: 121.7725, isMajor: true },
  { id: '7120', code: '7120', nameZh: '冬山', nameEn: 'Dongshan', lineId: 'yilan', lineName: '宜蘭線', region: 'east', lat: 24.6361, lng: 121.7928, isMajor: false },
  { id: '7110', code: '7110', nameZh: '蘇澳', nameEn: 'Su\'ao', lineId: 'yilan', lineName: '宜蘭線', region: 'east', lat: 24.5962, lng: 121.8507, isMajor: true },
  { id: '7100', code: '7100', nameZh: '蘇澳新', nameEn: 'Su\'aoxin', lineId: 'north-link', lineName: '北迴線', region: 'east', lat: 24.6042, lng: 121.8265, isMajor: true },
  { id: '7080', code: '7080', nameZh: '東澳', nameEn: 'Dong\'ao', lineId: 'north-link', lineName: '北迴線', region: 'east', lat: 24.5186, lng: 121.8328, isMajor: false },
  { id: '7070', code: '7070', nameZh: '南澳', nameEn: 'Nan\'ao', lineId: 'north-link', lineName: '北迴線', region: 'east', lat: 24.4628, lng: 121.8025, isMajor: true },
  { id: '7050', code: '7050', nameZh: '和平', nameEn: 'Heping', lineId: 'north-link', lineName: '北迴線', region: 'east', lat: 24.3094, lng: 121.7511, isMajor: false },
  { id: '7030', code: '7030', nameZh: '新城', nameEn: 'Xincheng (Taroko)', lineId: 'north-link', lineName: '北迴線', region: 'east', lat: 24.1278, lng: 121.6492, isMajor: true },
  { id: '7010', code: '7010', nameZh: '北埔', nameEn: 'Beipu', lineId: 'north-link', lineName: '北迴線', region: 'east', lat: 24.0325, lng: 121.6114, isMajor: false },
  { id: '7000', code: '7000', nameZh: '花蓮', nameEn: 'Hualien', lineId: 'north-link', lineName: '北迴/臺東線', region: 'east', lat: 23.9931, lng: 121.6012, isMajor: true },
  { id: '6250', code: '6250', nameZh: '吉安', nameEn: 'Ji\'an', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.9612, lng: 121.5831, isMajor: true },
  { id: '6240', code: '6240', nameZh: '志學', nameEn: 'Zhixue', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.9018, lng: 121.5348, isMajor: false },
  { id: '6220', code: '6220', nameZh: '壽豐', nameEn: 'Shoufeng', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.8711, lng: 121.5097, isMajor: true },
  { id: '6190', code: '6190', nameZh: '鳳林', nameEn: 'Fenglin', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.7431, lng: 121.4502, isMajor: true },
  { id: '6180', code: '6180', nameZh: '光復', nameEn: 'Guangfu', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.6667, lng: 121.4239, isMajor: true },
  { id: '6170', code: '6170', nameZh: '瑞穗', nameEn: 'Ruisui', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.4975, lng: 121.3764, isMajor: true },
  { id: '6150', code: '6150', nameZh: '玉里', nameEn: 'Yuli', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.3347, lng: 121.3142, isMajor: true },
  { id: '6130', code: '6130', nameZh: '富里', nameEn: 'Fuli', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.1812, lng: 121.2503, isMajor: false },
  { id: '6110', code: '6110', nameZh: '池上', nameEn: 'Chishang', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.1256, lng: 121.2167, isMajor: true },
  { id: '6090', code: '6090', nameZh: '關山', nameEn: 'Guanshan', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 23.0458, lng: 121.1631, isMajor: true },
  { id: '6070', code: '6070', nameZh: '鹿野', nameEn: 'Luye', lineId: 'taitung', lineName: '臺東線', region: 'east', lat: 22.9128, lng: 121.1352, isMajor: false },

  // 觀光支線 (Branches)
  { id: '7332', code: '7332', nameZh: '十分', nameEn: 'Shifen', lineId: 'pingxi', lineName: '平溪線', region: 'branch', lat: 25.0422, lng: 121.7778, isMajor: false },
  { id: '7333', code: '7333', nameZh: '平溪', nameEn: 'Pingxi', lineId: 'pingxi', lineName: '平溪線', region: 'branch', lat: 25.0264, lng: 121.7397, isMajor: false },
  { id: '7334', code: '7334', nameZh: '菁桐', nameEn: 'Jingtong', lineId: 'pingxi', lineName: '平溪線', region: 'branch', lat: 25.0231, lng: 121.7239, isMajor: false },
  { id: '1194', code: '1194', nameZh: '六家', nameEn: 'Liujia', lineId: 'neiwan', lineName: '六家線', region: 'branch', lat: 24.8086, lng: 121.0403, isMajor: true, transfers: ['HSR'] },
  { id: '1208', code: '1208', nameZh: '內灣', nameEn: 'Neiwan', lineId: 'neiwan', lineName: '內灣線', region: 'branch', lat: 24.7061, lng: 121.1822, isMajor: false },
  { id: '3436', code: '3436', nameZh: '集集', nameEn: 'Jiji', lineId: 'jiji', lineName: '集集線', region: 'branch', lat: 23.8294, lng: 120.7850, isMajor: false },
  { id: '3438', code: '3438', nameZh: '車埕', nameEn: 'Checheng', lineId: 'jiji', lineName: '集集線', region: 'branch', lat: 23.8322, lng: 120.8656, isMajor: false },
  { id: '4272', code: '4272', nameZh: '沙崙', nameEn: 'Shalun', lineId: 'shalun', lineName: '沙崙線', region: 'branch', lat: 22.9239, lng: 120.2858, isMajor: true, transfers: ['HSR'] },
];

// Helper to look up station
export function getStationByCode(code: string): Station | undefined {
  return TAIWAN_STATIONS.find(s => s.code === code || s.id === code);
}

export function getStationByName(name: string): Station | undefined {
  const cleanName = name.replace(/車站|站/g, '').trim();
  return TAIWAN_STATIONS.find(s => 
    s.nameZh === cleanName || 
    s.nameZh.includes(cleanName) || 
    cleanName.includes(s.nameZh) ||
    s.nameEn.toLowerCase() === cleanName.toLowerCase()
  );
}

// Major railway network track segments for map rendering
export const TAIWAN_RAILWAY_TRACKS: [number, number][][] = [
  // West Coast Main Trunk Line (Keelung -> Taipei -> Taichung -> Kaohsiung)
  [
    [25.1325, 121.7397], // 基隆
    [25.1086, 121.7289], // 八堵
    [25.0931, 121.7142], // 七堵
    [25.0682, 121.6628], // 汐止
    [25.0531, 121.6067], // 南港
    [25.0494, 121.5781], // 松山
    [25.0478, 121.5170], // 台北
    [25.0333, 121.4998], // 萬華
    [25.0136, 121.4637], // 板橋
    [24.9912, 121.4243], // 樹林
    [24.9547, 121.3556], // 鶯歌
    [24.9892, 121.3135], // 桃園
    [24.9538, 121.2259], // 中壢
    [24.9142, 121.1461], // 楊梅
    [24.8398, 121.0097], // 竹北
    [24.8018, 120.9716], // 新竹
    [24.6865, 120.8752], // 竹南
    // 山線
    [24.5701, 120.8239], // 苗栗
    [24.4131, 120.7709], // 三義
    [24.3075, 120.7138], // 后里
    [24.2536, 120.7235], // 豐原
    [24.1368, 120.6850], // 台中
    [24.1118, 120.6151], // 新烏日
    [24.0817, 120.5386], // 彰化
    [23.9592, 120.5706], // 員林
    [23.8601, 120.5898], // 田中
    [23.8068, 120.6178], // 二水
    [23.7118, 120.5441], // 斗六
    [23.6766, 120.4815], // 斗南
    [23.4792, 120.4414], // 嘉義
    [23.3075, 120.3228], // 新營
    [23.1342, 120.3013], // 善化
    [22.9972, 120.2128], // 台南
    [22.7938, 120.2974], // 岡山
    [22.6872, 120.3075], // 新左營
    [22.6397, 120.3021], // 高雄
  ],
  // 海線 Coast branch (竹南 - 彰化)
  [
    [24.6865, 120.8752], // 竹南
    [24.6152, 120.7877], // 後龍
    [24.4927, 120.6806], // 通霄
    [24.4428, 120.6558], // 苑裡
    [24.3444, 120.6251], // 大甲
    [24.2638, 120.5739], // 清水
    [24.2366, 120.5583], // 沙鹿
    [24.1206, 120.5700], // 追分
    [24.0817, 120.5386], // 彰化
  ],
  // 屏東線 & 南迴線 (高雄 - 屏東 - 枋寮 - 臺東)
  [
    [22.6397, 120.3021], // 高雄
    [22.6288, 120.3582], // 鳳山
    [22.6692, 120.4856], // 屏東
    [22.5498, 120.5369], // 潮州
    [22.4342, 120.5147], // 林邊
    [22.3683, 120.5962], // 枋寮
    [22.2589, 120.6651], // 枋山
    [22.3486, 120.8992], // 大武
    [22.5312, 120.9634], // 金崙
    [22.6152, 121.0062], // 太麻里
    [22.7092, 121.0664], // 知本
    [22.7938, 121.1232], // 台東
  ],
  // 東部幹線 (八堵 - 宜蘭 - 花蓮 - 臺東)
  [
    [25.1086, 121.7289], // 八堵
    [25.1089, 121.8061], // 瑞芳
    [25.0872, 121.8282], // 猴硐
    [25.0163, 121.9442], // 福隆
    [24.8586, 121.8239], // 頭城
    [24.8292, 121.7745], // 礁溪
    [24.7547, 121.7582], // 宜蘭
    [24.6775, 121.7725], // 羅東
    [24.6042, 121.8265], // 蘇澳新
    [24.5186, 121.8328], // 東澳
    [24.4628, 121.8025], // 南澳
    [24.3094, 121.7511], // 和平
    [24.1278, 121.6492], // 新城
    [23.9931, 121.6012], // 花蓮
    [23.9612, 121.5831], // 吉安
    [23.8711, 121.5097], // 壽豐
    [23.7431, 121.4502], // 鳳林
    [23.6667, 121.4239], // 光復
    [23.4975, 121.3764], // 瑞穗
    [23.3347, 121.3142], // 玉里
    [23.1256, 121.2167], // 池上
    [23.0458, 121.1631], // 關山
    [22.9128, 121.1352], // 鹿野
    [22.7938, 121.1232], // 台東
  ],
];
