import type {
  AccountGroup,
  AlertItem,
  BarDatum,
  BillDay,
  BubbleDevice,
  ChatMessage,
  ChatThread,
  DashboardHeroData,
  DashboardRange,
  DeviceDetailData,
  DeviceUsage,
  EnergySummary,
  ExperimentLogItem,
  RangeData,
  Suggestion,
  TierInfo,
  TimelineEvent,
  TOUInfo,
  UsagePoint,
} from './types';

export const mockSummary: EnergySummary = {
  currentPowerW: 1840,
  todayKwh: 12.4,
  todayCost: 38200,
  projectedMonthlyCost: 1284000,
  status: 'good',
  statusMessage: 'Mọi thứ đang ổn. Điều hòa chạy ở mức hợp lý.',
};

export const mockDeviceBreakdown: DeviceUsage[] = [
  { id: 'ac', name: 'Điều hòa', category: 'HVAC', kwh: 6.2, cost: 18600, share: 0.5 },
  { id: 'fridge', name: 'Tủ lạnh', category: 'Khác', kwh: 2.1, cost: 6300, share: 0.17 },
  { id: 'water-heater', name: 'Bình nóng lạnh', category: 'Nước', kwh: 2.4, cost: 7200, share: 0.19 },
  { id: 'induction', name: 'Bếp từ', category: 'Nấu ăn', kwh: 1.1, cost: 3300, share: 0.09 },
  { id: 'others', name: 'Thiết bị khác', category: 'Khác', kwh: 0.6, cost: 1800, share: 0.05 },
];

export const mockUsageSeries: UsagePoint[] = [
  { timestamp: '2026-09-05T12:00:00Z', kwh: 11.2, tariffPeriod: 'normal' },
  { timestamp: '2026-09-06T12:00:00Z', kwh: 13.8, tariffPeriod: 'peak' },
  { timestamp: '2026-09-07T12:00:00Z', kwh: 9.4, tariffPeriod: 'off_peak' },
  { timestamp: '2026-09-08T12:00:00Z', kwh: 12.1, tariffPeriod: 'normal' },
  { timestamp: '2026-09-09T12:00:00Z', kwh: 14.6, tariffPeriod: 'peak' },
  { timestamp: '2026-09-10T12:00:00Z', kwh: 10.3, tariffPeriod: 'normal' },
  { timestamp: '2026-09-11T12:00:00Z', kwh: 12.4, tariffPeriod: 'normal' },
];

export const DASHBOARD_RATE = 2845; // VND per kWh

export const DASHBOARD_RANGES: Record<DashboardRange, DashboardHeroData> = {
  day: {
    kwh: 12.4,
    deltaPct: -12,
    period: 'từ đầu ngày đến giờ',
    comparison: 'các ngày thứ Ba gần đây',
    shares: [52, 24, 9, 8, 7],
  },
  week: {
    kwh: 81.6,
    deltaPct: -4,
    period: 'từ đầu tuần đến giờ',
    comparison: 'cùng kỳ tuần trước',
    shares: [48, 22, 12, 10, 8],
  },
  month: {
    kwh: 284.0,
    deltaPct: 8,
    period: 'từ đầu tháng đến giờ',
    comparison: 'cùng kỳ tháng trước',
    shares: [45, 23, 13, 11, 8],
  },
};

export const DEVICE_NAMES = ['Điều hòa', 'Bình nóng lạnh', 'Bếp từ', 'Tủ lạnh', 'Chạy ngầm'];

export const BUBBLE_SLOTS = [
  { x: 50, y: 46 },
  { x: 18, y: 21 },
  { x: 82, y: 25 },
  { x: 84, y: 74 },
  { x: 20, y: 77 },
];

export function getDevicesForRange(range: DashboardRange): BubbleDevice[] {
  const r = DASHBOARD_RANGES[range];
  return r.shares.map((pct, i) => {
    const kwh = Math.round((r.kwh * pct) / 100 * 10) / 10;
    const cost = Math.round(kwh * DASHBOARD_RATE);
    return {
      id: `dev-${i}`,
      name: DEVICE_NAMES[i],
      pct,
      kwh,
      cost,
    };
  });
}

export const mockAlerts: AlertItem[] = [
  {
    id: 'a1',
    time: '05:12',
    text: 'Tải chạy ngầm giảm xuống 35 W sau khi bạn ngắt cụm ổ cắm TV.',
  },
  {
    id: 'a2',
    time: '18:40',
    text: 'Điều hòa đã bật ở 24°C. Còn 48 kWh nữa sẽ chuyển sang Bậc 4 EVN.',
  },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: 't1',
    time: '18:40',
    rampIndex: 0,
    text: 'Điều hòa đã bật, cài đặt 24°C.',
    detail: [],
  },
  {
    id: 't2',
    time: '17:05',
    rampIndex: 1,
    text: 'Bình nóng lạnh đã bật trong 22 phút.',
    detail: [],
  },
  {
    id: 't3',
    time: '12:18',
    rampIndex: 2,
    text: 'Bếp từ đã bật 3 lần, hiện đã tắt.',
    detail: [
      'bật lúc 12:18 trong 14p, hiện đã tắt',
      'bật lúc 07:40 trong 6p, hiện đã tắt',
      'bật lúc 06:12 trong 3p, hiện đã tắt',
    ],
  },
  {
    id: 't4',
    time: '05:12',
    rampIndex: 4,
    text: 'Tải chạy ngầm giảm từ 110 W xuống 35 W.',
    detail: [],
  },
];

// --- EVN 6-tier household tariff and 3-window TOU ---
export const TIERS: TierInfo[] = [
  { name: 'Bậc 1', sub: '0 đến 50 kWh, 1.893 đ', price: 1893, cap: 50, color: '#164437' },
  { name: 'Bậc 2', sub: '51 đến 100 kWh, 1.956 đ', price: 1956, cap: 100, color: '#2C5F45' },
  { name: 'Bậc 3', sub: '101 đến 200 kWh, 2.271 đ', price: 2271, cap: 200, color: '#2F7A0C' },
  { name: 'Bậc 4', sub: '201 đến 300 kWh, 2.860 đ', price: 2860, cap: 300, color: '#5AAE14' },
  { name: 'Bậc 5', sub: '301 đến 400 kWh, 3.197 đ', price: 3197, cap: 400, color: '#8CD41C' },
  { name: 'Bậc 6', sub: 'trên 400 kWh, 3.302 đ', price: 3302, cap: Infinity, color: '#B5E930' },
];

export const TOU: TOUInfo[] = [
  { name: 'Thấp điểm', sub: '22:00 đến 04:00, hàng ngày', price: 1738, share: 0.30, color: '#164437' },
  { name: 'Bình thường', sub: '04:00 - 09:30 & 11:30 - 17:00', price: 2870, share: 0.45, color: '#5AAE14' },
  { name: 'Cao điểm', sub: '09:30 - 11:30 & 17:00 - 20:00', price: 4924, share: 0.25, color: '#B5E930' },
];

export const DAILY = [19, 21, 18, 22, 20, 17, 23, 19, 21, 20, 18, 22, 19, 25];
export const LAST_DAILY = [18, 20, 17, 21, 19, 16, 22, 18, 20, 19, 17, 21, 18, 15];

export function tierSplit(daily: number[]): BillDay[] {
  let cum = 0;
  return daily.map((kwh, d) => {
    const segs: { ti: number; kwh: number }[] = [];
    let left = kwh;
    while (left > 0.01) {
      const ti = TIERS.findIndex((t) => cum < t.cap);
      const room = TIERS[ti].cap === Infinity ? left : TIERS[ti].cap - cum;
      const take = Math.min(left, room);
      segs.push({ ti, kwh: take });
      cum += take;
      left -= take;
    }
    return { day: d + 1, kwh, segs };
  });
}

export const BILL_DAYS = tierSplit(DAILY);
export const TIER_USED = TIERS.map((t, i) =>
  BILL_DAYS.reduce(
    (s: number, d) =>
      s +
      d.segs
        .filter((x: { ti: number; kwh: number }) => x.ti === i)
        .reduce((a: number, b: { ti: number; kwh: number }) => a + b.kwh, 0),
    0
  )
);

export const MONTH_KWH = DAILY.reduce((a, b) => a + b, 0);
export const DAYS_IN = DAILY.length;
export const DAYS_LEFT = 30 - DAYS_IN;
export const PACE = MONTH_KWH / DAYS_IN;
export const HOME_COST = TIERS.reduce((s, t, i) => s + TIER_USED[i] * t.price, 0);
export const MONTH_COST = HOME_COST * 1.08;
export const RATE = MONTH_COST / MONTH_KWH;
export const NEXT_I = TIERS.findIndex((t) => t.cap > MONTH_KWH);
export const CURRENT_TIER = TIERS[NEXT_I];
export const NEXT_TIER = TIERS[NEXT_I + 1] ?? TIERS[TIERS.length - 1];
export const HEADROOM = CURRENT_TIER.cap - MONTH_KWH;
export const CROSS_DAY = DAYS_IN + Math.ceil(HEADROOM / PACE);
export const STEP_PCT = Math.round((NEXT_TIER.price / CURRENT_TIER.price - 1) * 100);
export const LAST_TOTAL = LAST_DAILY.reduce((a, b) => a + b, 0);
export const MONTH_DELTA = Math.round((MONTH_KWH / LAST_TOTAL - 1) * 100);

export const USAGE_RANGES: Record<string, RangeData> = {
  day: {
    kwh: 12.4,
    deltaPct: -12,
    period: 'từ đầu ngày đến giờ',
    comparison: 'các ngày thứ Ba gần đây',
    bars: [
      ['00', 1.1, '00:00'],
      ['03', 0.9, '03:00'],
      ['06', 1.4, '06:00'],
      ['09', 1.8, '09:00'],
      ['12', 2.2, '12:00'],
      ['15', 1.9, '15:00'],
      ['18', 2.4, '18:00'],
      ['21', 0.7, '21:00'],
    ],
    shares: [52, 24, 9, 8, 7],
  },
  week: {
    kwh: 81.6,
    deltaPct: -4,
    period: 'từ đầu tuần đến giờ',
    comparison: 'cùng kỳ tuần trước',
    bars: [
      ['T2', 10.2, 'Thứ Hai'],
      ['T3', 12.4, 'Thứ Ba'],
      ['T4', 9.8, 'Thứ Tư'],
      ['T5', 13.1, 'Thứ Năm'],
      ['T6', 11.6, 'Thứ Sáu'],
      ['T7', 12.9, 'Thứ Bảy'],
      ['CN', 11.6, 'Chủ Nhật'],
    ],
    shares: [48, 22, 12, 10, 8],
  },
  month: {
    kwh: MONTH_KWH,
    deltaPct: MONTH_DELTA,
    period: 'từ đầu tháng đến giờ',
    comparison: 'cùng kỳ tháng trước',
    bars: [
      ['1', 58, '1 đến 4 tháng 9'],
      ['5', 64, '5 đến 8 tháng 9'],
      ['9', 61, '9 đến 12 tháng 9'],
      ['13', 72, '13 đến 16 tháng 9'],
      ['17', 69, '17 đến 20 tháng 9'],
      ['21', 74, '21 đến 24 tháng 9'],
      ['25', 66, '25 đến 28 tháng 9'],
      ['29', 51, '29 đến 30 tháng 9'],
    ],
    shares: [45, 23, 13, 11, 8],
  },
  year: {
    kwh: 2410,
    deltaPct: 6,
    period: 'từ đầu năm đến giờ',
    comparison: 'năm ngoái',
    bars: [
      ['T1', 178, 'Tháng 1'],
      ['T2', 165, 'Tháng 2'],
      ['T3', 189, 'Tháng 3'],
      ['T4', 214, 'Tháng 4'],
      ['T5', 258, 'Tháng 5'],
      ['T6', 291, 'Tháng 6'],
      ['T7', 304, 'Tháng 7'],
      ['T8', 296, 'Tháng 8'],
      ['T9', 284, 'Tháng 9'],
      ['T10', 231, 'Tháng 10'],
      ['T11', 0, 'Tháng 11'],
      ['T12', 0, 'Tháng 12'],
    ],
    shares: [44, 24, 13, 11, 8],
  },
};

export function getUsageDevices(rangeKey: string): BubbleDevice[] {
  const r = USAGE_RANGES[rangeKey] ?? USAGE_RANGES.week;
  return r.shares.map((pct: number, i: number) => {
    const kwh = Math.round((r.kwh * pct) / 100 * 10) / 10;
    const cost = Math.round(kwh * RATE);
    return {
      id: `dev-${i}`,
      name: DEVICE_NAMES[i],
      pct,
      kwh,
      cost,
    };
  });
}

export const DEVICE_DETAIL_AIRCON: DeviceDetailData = {
  id: 'dev-0',
  name: 'Điều hòa',
  meta: '1.860 W · PHÒNG KHÁCH',
  avgW: '1.860',
  costMonth: '364,5',
  note: 'Máy nén chạy lâu hơn 40% so với tuần trước khi nhiệt độ ngoài trời tăng 4 độ. Giữ mức 26,5°C thay vì 24°C sẽ tiết kiệm khoảng 85.000 đ mỗi tuần.',
  stats: [
    { label: 'Tổng điện tiêu thụ', value: '41,9 kWh' },
    { label: 'Tổng ước tính chi phí', value: '119.200 đ' },
    { label: 'Số lần bật', value: '23 lần' },
    { label: 'Tổng thời gian chạy', value: '58h 20p' },
  ],
};

export const DEVICE_WEEK_BARS: BarDatum[] = [
  ['T2', 5.1, 'Thứ Hai'],
  ['T3', 6.4, 'Thứ Ba'],
  ['T4', 4.8, 'Thứ Tư'],
  ['T5', 7.2, 'Thứ Năm'],
  ['T6', 6.0, 'Thứ Sáu'],
  ['T7', 6.8, 'Thứ Bảy'],
  ['CN', 5.6, 'Chủ Nhật'],
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    q: 'Tại sao hóa đơn tăng 35%?',
    a: 'Có hai nguyên nhân cộng dồn trong tuần này. Nhiệt độ ngoài trời trung bình 38,5°C, cao hơn tuần trước 4 độ, khiến máy nén chạy hết công suất lâu hơn 40%. Tổng điện dùng cũng đã vượt 200 kWh, nên phần điện sau đó bị tính theo bậc giá cao hơn.',
    facts: [
      { k: 'Nhiệt độ ngoài trời', v: '38,5 °C' },
      { k: 'Thời gian máy nén chạy', v: '+40%' },
      { k: 'Bậc giá hiện tại', v: 'Bậc 3' },
    ],
    cta: 'Thử nghiệm 3 ngày ở mức 26,5°C',
  },
  {
    q: 'Tải chạy ngầm của tôi là bao nhiêu?',
    a: 'Từ 02:00 đến 05:00 sáng, công suất nền ổn định ở mức 35 W sau khi loại trừ chu kỳ tủ lạnh. Mức này tiêu tốn khoảng 25 kWh/tháng từ cụm TV và modem wifi, tính theo bậc cao nhất hiện tại (Bậc 3) tương đương khoảng 57.000 đ.',
    facts: [
      { k: 'Công suất chờ', v: '35 W' },
      { k: 'Lãng phí hàng tháng', v: '25 kWh' },
      { k: 'Tính theo Bậc 3', v: '57.000 đ' },
    ],
    cta: '',
  },
  {
    q: 'Làm sao để giữ nguyên bậc điện này?',
    a: 'Bạn đã dùng 284 kWh và còn 16 ngày nữa trong chu kỳ. Để duy trì ở Bậc 3, bạn cần giữ mức dùng 6,4 kWh/ngày so với mức 19,8 kWh hiện tại. Chuyển bình nóng lạnh sang khung giờ 22:00 sẽ bù đắp được khoảng một nửa khoảng cách này.',
    facts: [
      { k: 'Đã dùng đến nay', v: '284 kWh' },
      { k: 'Mức dự phòng', v: '16 kWh' },
      { k: 'Hạn mức hàng ngày', v: '6,4 kWh' },
    ],
    cta: 'Thử nghiệm 3 ngày ở mức 26,5°C',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-0',
    who: 'ai',
    text: 'Chào buổi tối. Công tơ điện của bạn đang hoạt động và đã đồng bộ dữ liệu 30 ngày qua. Hãy hỏi về bất kỳ chỉ số nào để xem chi tiết nguồn gốc.',
    facts: [],
  },
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'Tại sao hóa đơn tăng 35%?',
    category: 'ĐIỀU HÒA',
    period: 'THG 9',
    timeAgo: '2 giờ trước',
    group: 'today',
    dotColor: '#B5E930',
    messages: [
      {
        id: 't1-m1',
        who: 'me',
        text: 'Tại sao hóa đơn tháng này tăng 35% so với tháng trước?',
      },
      {
        id: 't1-m2',
        who: 'ai',
        text: 'Tháng 9 nóng hơn tháng 8 khoảng 2,4°C, đẩy thời gian chạy điều hòa phòng khách từ 4,8 lên 8,1 giờ mỗi ngày. Lượng điện tăng thêm 98 kWh đã đẩy 42 kWh sang Bậc 4 (3.151 đ/kWh), chiếm 31% mức tăng chi phí.',
        facts: [
          { k: 'THỜI GIAN CHẠY AC', v: '8,1h/ngày (+68%)' },
          { k: 'CHÊNH LỆCH NHIỆT ĐỘ', v: '+2,4°C tb' },
          { k: 'CHUYỂN SANG BẬC 4', v: '42 kWh' },
        ],
        cta: 'Thử nghiệm AC 26°C + quạt',
      },
    ],
  },
  {
    id: 'thread-2',
    title: 'Tải chạy ngầm sau nửa đêm',
    category: 'CHẠY NGẦM',
    period: '30 NGÀY',
    timeAgo: '5 giờ trước',
    group: 'today',
    dotColor: '#4A6B60',
    messages: [
      {
        id: 't2-m1',
        who: 'me',
        text: 'Thiết bị nào đang chạy ngầm sau nửa đêm?',
      },
      {
        id: 't2-m2',
        who: 'ai',
        text: 'Từ 02:00 đến 05:00 sáng, công suất nền duy trì ở 35 W sau khi trừ chu kỳ máy nén tủ lạnh. Lượng điện này tiêu hao khoảng 25 kWh/tháng từ cụm TV và modem mạng, tính theo bậc cận biên (Bậc 3) tương đương khoảng 71.000 đ.',
        facts: [
          { k: 'CÔNG SUẤT CHỜ', v: '35 W' },
          { k: 'TIÊU HAO THÁNG', v: '25 kWh' },
          { k: 'ƯỚC TÍNH CHI PHÍ', v: '71.000 đ' },
        ],
        cta: 'Thử ngắt ổ cắm cụm TV',
      },
    ],
  },
  {
    id: 'thread-3',
    title: 'Khung giờ bật bình nóng lạnh',
    category: 'BÌNH NÓNG LẠNH',
    period: 'THG 8',
    timeAgo: 'Thứ Hai',
    group: 'this_week',
    dotColor: '#B5E930',
    messages: [
      {
        id: 't3-m1',
        who: 'me',
        text: 'Bật bình nóng lạnh vào khung giờ nào tiết kiệm nhất?',
      },
      {
        id: 't3-m2',
        who: 'ai',
        text: 'Bình nóng lạnh gián tiếp của bạn tiêu thụ 2.500 W trong 35 phút mỗi chu kỳ đun. Cài đặt đun trong khoảng 22:00 đến 23:00 sẽ tránh được giờ cao điểm và giảm hao phí nhiệt dự phòng qua đêm trước khi tắm buổi sáng.',
        facts: [
          { k: 'CÔNG SUẤT', v: '2.500 W' },
          { k: 'THỜI GIAN ĐUN', v: '35 phút' },
          { k: 'KHUNG GIỜ TỐI ƯU', v: '22:00–23:00' },
        ],
        cta: 'Hẹn giờ bình nóng lạnh 22:00',
      },
    ],
  },
  {
    id: 'thread-4',
    title: 'Làm sao để giữ nguyên bậc điện này?',
    category: 'HÓA ĐƠN',
    period: 'THG 9',
    timeAgo: 'Chủ Nhật',
    group: 'this_week',
    dotColor: '#2F7A0C',
    messages: [
      {
        id: 't4-m1',
        who: 'me',
        text: 'Làm sao để giữ trong Bậc 3 tháng này?',
      },
      {
        id: 't4-m2',
        who: 'ai',
        text: 'Bạn đã dùng 284 kWh và còn 6 ngày nữa trong chu kỳ. Để ở trong Bậc 3, bạn cần duy trì ngân sách 2,7 kWh/ngày so với mức 4,2 kWh hiện tại. Chuyển bình nóng lạnh sang khung giờ 22:00 sẽ giảm được khoảng một nửa khoảng chênh này.',
        facts: [
          { k: 'ĐÃ DÙNG ĐẾN NAY', v: '284 kWh' },
          { k: 'MỨC DỰ PHÒNG', v: '16 kWh' },
          { k: 'HẠN MỨC NGÀY', v: '2,7 kWh/ngày' },
        ],
        cta: 'Bắt đầu thử nghiệm 3 ngày ở 26,5°C',
      },
    ],
  },
  {
    id: 'thread-5',
    title: 'Tủ lạnh có đóng ngắt quá thường xuyên?',
    category: 'TỦ LẠNH',
    period: 'THG 8',
    timeAgo: '28 Thg 8',
    group: 'earlier',
    dotColor: '#164437',
    messages: [
      {
        id: 't5-m1',
        who: 'me',
        text: 'Tủ lạnh đóng ngắt chu kỳ liên tục trong ngày có bình thường không?',
      },
      {
        id: 't5-m2',
        who: 'ai',
        text: 'Máy nén tủ lạnh đã đóng ngắt 38 lần ngày hôm qua, trung bình chạy 18 phút và nghỉ 20 phút. Chu kỳ này là bình thường với nhiệt độ phòng 32°C, tuy nhiên bụi bẩn bám trên dàn nóng có thể làm tăng tần suất đóng ngắt thêm ~10%.',
        facts: [
          { k: 'CHU KỲ HÀNG NGÀY', v: '38 lần' },
          { k: 'THỜI GIAN CHẠY TB', v: '18 phút' },
          { k: 'ẢNH HƯỞNG BỤI DÀN', v: '+10% tần suất' },
        ],
        cta: 'Ghi nhận kiểm tra dàn nóng',
      },
    ],
  },
  {
    id: 'thread-6',
    title: 'Bếp từ so với nồi cơm điện',
    category: 'BẾP TỪ',
    period: 'THG 8',
    timeAgo: '21 Thg 8',
    group: 'earlier',
    dotColor: '#8CD41C',
    messages: [
      {
        id: 't6-m1',
        who: 'me',
        text: 'Nấu bằng bếp từ hay nồi cơm điện tốn ít điện hơn?',
      },
      {
        id: 't6-m2',
        who: 'ai',
        text: 'Một lần nấu 45 phút trên bếp từ tiêu thụ khoảng 0,85 kWh. Nồi cơm điện chuyên dụng chỉ tiêu thụ 0,32 kWh để nấu cộng thêm 0,04 kWh/h để giữ ấm. Khi nấu các món hạt/cơm, nồi cơm điện tiết kiệm hơn ~60% điện năng so với bếp từ.',
        facts: [
          { k: 'BỮA ĂN BẾP TỪ', v: '0,85 kWh' },
          { k: 'NỒI CƠM ĐIỆN', v: '0,32 kWh' },
          { k: 'TIẾT KIỆM ĐIỆN', v: '~60%' },
        ],
        cta: 'So sánh tải nấu ăn trong Thử nghiệm',
      },
    ],
  },
];

export const MOCK_EXP_LOG: ExperimentLogItem[] = [
  {
    id: 'exp-1',
    title: 'Chuyển bình nóng lạnh sang khung giờ 22:00',
    date: '18 đến 25 Thg 8',
    result: 'Áp dụng',
    savedVnd: 52000,
    note: '',
    good: true,
  },
  {
    id: 'exp-2',
    title: 'Điều hòa 27°C không bật quạt',
    date: '2 đến 5 Thg 8',
    result: 'Hủy bỏ',
    savedVnd: 0,
    note: 'Quá nóng vào ban đêm',
    good: false,
  },
  {
    id: 'exp-3',
    title: 'Cụm TV cắm ổ có công tắc ngắt',
    date: '21 đến 28 Thg 7',
    result: 'Áp dụng',
    savedVnd: 61000,
    note: '',
    good: true,
  },
];

export const EXP_LOG = MOCK_EXP_LOG;
export const EXP_KEPT = EXP_LOG.filter((l) => l.good).length;
export const EXP_SAVED = EXP_LOG.reduce((s, l) => s + l.savedVnd, 0);

export const ACCOUNT_GROUPS: AccountGroup[] = [
  {
    title: 'THÔNG TIN NHÀ',
    items: [
      { label: 'Số người trong nhà', value: '4 người' },
      { label: 'Biểu phí & nhà cung cấp', value: 'EVN Hà Nội' },
      { label: 'Thiết bị phát hiện', value: '5 thiết bị' },
      { label: 'Cảm biến & hiệu chuẩn', value: 'Bình thường' },
    ],
  },
  {
    title: 'THÔNG BÁO',
    items: [
      { label: 'Cảnh báo nhảy bậc điện', value: 'Bật' },
      { label: 'Cảnh báo tải chờ ban đêm', value: 'Bật' },
      { label: 'Tổng kết tuần', value: 'Chủ nhật' },
    ],
  },
  {
    title: 'QUY ĐỊNH & ĐIỀU KHOẢN',
    items: [
      { label: 'Chính sách bảo mật', value: '' },
      { label: 'Điều khoản sử dụng', value: '' },
      { label: 'Xuất dữ liệu', value: '' },
      { label: 'Phiên bản ứng dụng', value: '1.4.0' },
    ],
  },
];

