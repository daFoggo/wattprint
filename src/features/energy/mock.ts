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
    period: 'so far today',
    comparison: 'than recent Tuesdays',
    shares: [52, 24, 9, 8, 7],
  },
  week: {
    kwh: 81.6,
    deltaPct: -4,
    period: 'so far this week',
    comparison: 'than the same days last week',
    shares: [48, 22, 12, 10, 8],
  },
  month: {
    kwh: 284.0,
    deltaPct: 8,
    period: 'so far this month',
    comparison: 'than the same point last month',
    shares: [45, 23, 13, 11, 8],
  },
};

export const DEVICE_NAMES = ['Air con', 'Water heater', 'Cooktop', 'Fridge', 'Always on'];

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
    text: 'Standby load dropped to 35 W after you switched off the TV cluster.',
  },
  {
    id: 'a2',
    time: '18:40',
    text: 'Air con turned on at 24 degrees. 48 kWh left before EVN Tier 4.',
  },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: 't1',
    time: '18:40',
    rampIndex: 0,
    text: 'Air con turned on, set to 24 degrees.',
    detail: [],
  },
  {
    id: 't2',
    time: '17:05',
    rampIndex: 1,
    text: 'Water heater ran for 22 minutes.',
    detail: [],
  },
  {
    id: 't3',
    time: '12:18',
    rampIndex: 2,
    text: 'Cooktop was on 3 times, now off.',
    detail: [
      'on at 12:18 for 14m, now off',
      'on at 07:40 for 6m, now off',
      'on at 06:12 for 3m, now off',
    ],
  },
  {
    id: 't4',
    time: '05:12',
    rampIndex: 4,
    text: 'Standby load dropped from 110 W to 35 W.',
    detail: [],
  },
];

// --- EVN 6-tier household tariff and 3-window TOU ---
export const TIERS: TierInfo[] = [
  { name: 'Tier 1', sub: '0 to 50 kWh, 1,893', price: 1893, cap: 50, color: '#164437' },
  { name: 'Tier 2', sub: '51 to 100 kWh, 1,956', price: 1956, cap: 100, color: '#2C5F45' },
  { name: 'Tier 3', sub: '101 to 200 kWh, 2,271', price: 2271, cap: 200, color: '#2F7A0C' },
  { name: 'Tier 4', sub: '201 to 300 kWh, 2,860', price: 2860, cap: 300, color: '#5AAE14' },
  { name: 'Tier 5', sub: '301 to 400 kWh, 3,197', price: 3197, cap: 400, color: '#8CD41C' },
  { name: 'Tier 6', sub: 'above 400 kWh, 3,302', price: 3302, cap: Infinity, color: '#B5E930' },
];

export const TOU: TOUInfo[] = [
  { name: 'Off peak', sub: '22:00 to 04:00, every day', price: 1738, share: 0.30, color: '#164437' },
  { name: 'Normal', sub: '04:00 to 09:30 & 11:30 to 17:00', price: 2870, share: 0.45, color: '#5AAE14' },
  { name: 'Peak', sub: '09:30 to 11:30 & 17:00 to 20:00', price: 4924, share: 0.25, color: '#B5E930' },
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
    period: 'so far today',
    comparison: 'than recent Tuesdays',
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
    period: 'so far this week',
    comparison: 'than the same days last week',
    bars: [
      ['M', 10.2, 'Monday'],
      ['T', 12.4, 'Tuesday'],
      ['W', 9.8, 'Wednesday'],
      ['T', 13.1, 'Thursday'],
      ['F', 11.6, 'Friday'],
      ['S', 12.9, 'Saturday'],
      ['S', 11.6, 'Sunday'],
    ],
    shares: [48, 22, 12, 10, 8],
  },
  month: {
    kwh: MONTH_KWH,
    deltaPct: MONTH_DELTA,
    period: 'so far this month',
    comparison: 'than the same point last month',
    bars: [
      ['1', 58, 'Sep 1 to 4'],
      ['5', 64, 'Sep 5 to 8'],
      ['9', 61, 'Sep 9 to 12'],
      ['13', 72, 'Sep 13 to 16'],
      ['17', 69, 'Sep 17 to 20'],
      ['21', 74, 'Sep 21 to 24'],
      ['25', 66, 'Sep 25 to 28'],
      ['29', 51, 'Sep 29 to 30'],
    ],
    shares: [45, 23, 13, 11, 8],
  },
  year: {
    kwh: 2410,
    deltaPct: 6,
    period: 'so far this year',
    comparison: 'than last year',
    bars: [
      ['J', 178, 'January'],
      ['F', 165, 'February'],
      ['M', 189, 'March'],
      ['A', 214, 'April'],
      ['M', 258, 'May'],
      ['J', 291, 'June'],
      ['J', 304, 'July'],
      ['A', 296, 'August'],
      ['S', 284, 'September'],
      ['O', 231, 'October'],
      ['N', 0, 'November'],
      ['D', 0, 'December'],
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
  name: 'Air con',
  meta: '1,860 W · LIVING ROOM',
  avgW: '1,860',
  costMonth: '364.5',
  note: 'The compressor ran 40% longer than last week while outdoor temperature rose 4 degrees. Holding 26.5 instead of 24 would cut about 85,000 VND a week.',
  stats: [
    { label: 'Total usage', value: '41.9 kWh' },
    { label: 'Total estimated cost', value: '119,200 VND' },
    { label: 'Times on', value: '23' },
    { label: 'Total time on', value: '58h 20m' },
  ],
};

export const DEVICE_WEEK_BARS: BarDatum[] = [
  ['M', 5.1, 'Monday'],
  ['T', 6.4, 'Tuesday'],
  ['W', 4.8, 'Wednesday'],
  ['T', 7.2, 'Thursday'],
  ['F', 6.0, 'Friday'],
  ['S', 6.8, 'Saturday'],
  ['S', 5.6, 'Sunday'],
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    q: 'Why is the bill up 35%?',
    a: 'Two things stacked up this week. Outdoor temperature averaged 38.5 degrees, 4 above last week, so the compressor held peak output 40% longer. Your running total also crossed 200 kWh, so everything since then is billed one band higher.',
    facts: [
      { k: 'Outdoor average', v: '38.5 °C' },
      { k: 'Compressor runtime', v: '+40%' },
      { k: 'Current band', v: 'Tier 3' },
    ],
    cta: 'Start a 3 day test at 26.5',
  },
  {
    q: 'What is my phantom load?',
    a: 'Between 02:00 and 05:00 the flat floor sits at 35 W after the fridge cycle is removed. That is about 25 kWh a month from the TV cluster and the router shelf, billed at your marginal band, Tier 3, so roughly 57,000 VND.',
    facts: [
      { k: 'Standby power', v: '35 W' },
      { k: 'Monthly waste', v: '25 kWh' },
      { k: 'At Tier 3 rate', v: '57,000 VND' },
    ],
    cta: '',
  },
  {
    q: 'How do I stay in this tier?',
    a: 'You are at 284 kWh with 16 days left in the cycle. Staying inside Tier 3 means holding 6.4 kWh a day against your current 19.8. Shifting the water heater to the 22:00 window covers about half of the gap.',
    facts: [
      { k: 'Used so far', v: '284 kWh' },
      { k: 'Headroom', v: '16 kWh' },
      { k: 'Daily budget', v: '6.4 kWh' },
    ],
    cta: 'Start a 3 day test at 26.5',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-0',
    who: 'ai',
    text: 'Good evening. Your meter is live and the last 30 days are indexed. Ask about a number and I will show where it comes from.',
    facts: [],
  },
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'Why is the bill up 35%?',
    category: 'AIR CON',
    period: 'SEP',
    timeAgo: '2h ago',
    group: 'today',
    dotColor: '#B5E930',
    messages: [
      {
        id: 't1-m1',
        who: 'me',
        text: 'Why is the bill up 35% this month compared to last?',
      },
      {
        id: 't1-m2',
        who: 'ai',
        text: 'September was 2.4°C warmer than August, pushing your living room air conditioning runtime from 4.8 to 8.1 hours daily. The extra 98 kWh pushed 42 kWh into Tier 4 (3,151 VND/kWh), accounting for 31% of the increase.',
        facts: [
          { k: 'AC RUNTIME', v: '8.1h/d (+68%)' },
          { k: 'TEMP DELTA', v: '+2.4°C avg' },
          { k: 'TIER 4 SHIFT', v: '42 kWh' },
        ],
        cta: 'Run AC 26°C + fan experiment',
      },
    ],
  },
  {
    id: 'thread-2',
    title: 'Standby load after midnight',
    category: 'ALWAYS ON',
    period: '30D',
    timeAgo: '5h ago',
    group: 'today',
    dotColor: '#4A6B60',
    messages: [
      {
        id: 't2-m1',
        who: 'me',
        text: 'What is running standby load after midnight?',
      },
      {
        id: 't2-m2',
        who: 'ai',
        text: 'Between 02:00 and 05:00 the flat floor sits at 35 W after the fridge compressor cycle is removed. That is about 25 kWh a month from the TV cluster and the router shelf, billed at your marginal band (Tier 3), roughly 71,000 VND.',
        facts: [
          { k: 'STANDBY LOAD', v: '35 W' },
          { k: 'MONTHLY WASTE', v: '25 kWh' },
          { k: 'EST. COST', v: '71,000 VND' },
        ],
        cta: 'Test TV cluster smart plug cutoff',
      },
    ],
  },
  {
    id: 'thread-3',
    title: 'Water heater window',
    category: 'WATER HEATER',
    period: 'AUG',
    timeAgo: 'Mon',
    group: 'this_week',
    dotColor: '#B5E930',
    messages: [
      {
        id: 't3-m1',
        who: 'me',
        text: 'When is the most efficient window to run the water heater?',
      },
      {
        id: 't3-m2',
        who: 'ai',
        text: 'Your storage water heater pulls 2,500 W for 35 minutes per heating cycle. Scheduling it between 22:00 and 23:00 avoids daytime peak tariff rates and cuts overnight standby reheating losses before morning showers.',
        facts: [
          { k: 'POWER DRAW', v: '2,500 W' },
          { k: 'CYCLE DURATION', v: '35 mins' },
          { k: 'TARGET WINDOW', v: '22:00–23:00' },
        ],
        cta: 'Set 22:00 water heater timer',
      },
    ],
  },
  {
    id: 'thread-4',
    title: 'How do I stay in this tier?',
    category: 'BILL',
    period: 'SEP',
    timeAgo: 'Sun',
    group: 'this_week',
    dotColor: '#2F7A0C',
    messages: [
      {
        id: 't4-m1',
        who: 'me',
        text: 'How do I stay in Tier 3 this month?',
      },
      {
        id: 't4-m2',
        who: 'ai',
        text: 'You are at 284 kWh with 6 days left in the cycle. Staying inside Tier 3 means holding a 2.7 kWh/day budget against your current 4.2 kWh pace. Shifting the water heater to the 22:00 window covers about half of the gap.',
        facts: [
          { k: 'USED SO FAR', v: '284 kWh' },
          { k: 'HEADROOM', v: '16 kWh' },
          { k: 'DAILY BUDGET', v: '2.7 kWh/d' },
        ],
        cta: 'Start 3-day test at 26.5°C',
      },
    ],
  },
  {
    id: 'thread-5',
    title: 'Is the fridge cycling too often?',
    category: 'FRIDGE',
    period: 'AUG',
    timeAgo: '28 Aug',
    group: 'earlier',
    dotColor: '#164437',
    messages: [
      {
        id: 't5-m1',
        who: 'me',
        text: 'Is the fridge cycling too often during the day?',
      },
      {
        id: 't5-m2',
        who: 'ai',
        text: 'The refrigerator compressor cycled 38 times yesterday, averaging 18 minutes on and 20 minutes off. This duty cycle is normal for 32°C ambient room temperature, but dust on the condenser coils could be adding ~10% cycle frequency.',
        facts: [
          { k: 'DAILY CYCLES', v: '38 times' },
          { k: 'AVG ON-CYCLE', v: '18 mins' },
          { k: 'EST. IMPACT', v: '+10% freq' },
        ],
        cta: 'Log coil cleaning check',
      },
    ],
  },
  {
    id: 'thread-6',
    title: 'Cooktop versus rice cooker',
    category: 'COOKTOP',
    period: 'AUG',
    timeAgo: '21 Aug',
    group: 'earlier',
    dotColor: '#8CD41C',
    messages: [
      {
        id: 't6-m1',
        who: 'me',
        text: 'Which uses more electricity: cooking on induction or electric cooker?',
      },
      {
        id: 't6-m2',
        who: 'ai',
        text: 'A typical 45-minute induction cooking session draws ~0.85 kWh. A dedicated rice cooker uses 0.32 kWh for cooking plus 0.04 kWh/h warming. For grain cooking, the dedicated cooker uses ~60% less energy than the open cooktop.',
        facts: [
          { k: 'INDUCTION MEAL', v: '0.85 kWh' },
          { k: 'RICE COOKER', v: '0.32 kWh' },
          { k: 'ENERGY SAVED', v: '~60%' },
        ],
        cta: 'Compare cooking loads in Lab',
      },
    ],
  },
];

export const MOCK_EXP_LOG: ExperimentLogItem[] = [
  {
    id: 'exp-1',
    title: 'Water heater moved to the 22:00 window',
    date: '18 to 25 Aug',
    result: 'Kept',
    savedVnd: 52000,
    note: '',
    good: true,
  },
  {
    id: 'exp-2',
    title: 'Air con at 27 with no fan',
    date: '2 to 5 Aug',
    result: 'Dropped',
    savedVnd: 0,
    note: 'Too warm at night',
    good: false,
  },
  {
    id: 'exp-3',
    title: 'TV cluster on a switched socket',
    date: '21 to 28 Jul',
    result: 'Kept',
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
    title: 'HOME',
    items: [
      { label: 'Household profile', value: '4 people' },
      { label: 'Tariff and provider', value: 'EVN Hanoi' },
      { label: 'Devices detected', value: '5' },
      { label: 'Sensor and calibration', value: 'OK' },
    ],
  },
  {
    title: 'NOTIFICATIONS',
    items: [
      { label: 'Tier warnings', value: 'On' },
      { label: 'Phantom load alerts', value: 'On' },
      { label: 'Weekly summary', value: 'Sunday' },
    ],
  },
  {
    title: 'LEGAL',
    items: [
      { label: 'Privacy', value: '' },
      { label: 'Terms of use', value: '' },
      { label: 'Data export', value: '' },
      { label: 'App version', value: '1.4.0' },
    ],
  },
];

