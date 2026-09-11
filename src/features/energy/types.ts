export type TariffPlan = 'tiered' | 'tou';

export type Range = 'day' | 'week' | 'month';

export type TariffPeriod = 'off_peak' | 'normal' | 'peak';

export type EnergyStatus = 'good' | 'warning' | 'critical';

export interface DeviceUsage {
  id: string;
  name: string;
  category: string;
  kwh: number;
  cost: number;
  share: number;
}

export interface UsagePoint {
  timestamp: string;
  kwh: number;
  tariffPeriod: TariffPeriod;
}

export interface EnergySummary {
  currentPowerW: number;
  todayKwh: number;
  todayCost: number;
  projectedMonthlyCost: number;
  status: EnergyStatus;
  statusMessage: string;
}

export type UnitMode = 'kwh' | 'cost';

export type DashboardRange = 'day' | 'week' | 'month';

export interface DashboardHeroData {
  kwh: number;
  deltaPct: number;
  period: string;
  comparison: string;
  shares: number[];
}

export interface BubbleDevice {
  id: string;
  name: string;
  pct: number;
  kwh: number;
  cost: number;
}

export interface AlertItem {
  id: string;
  time: string;
  text: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  rampIndex: number;
  text: string;
  detail: string[];
}

export type UsageTab = 'day' | 'week' | 'month' | 'year' | 'bill';
export type BreakdownView = 'bubble' | 'donut' | 'bars';
export type CustomerType = 'home' | 'biz';

export type BarDatum = [label: string, value: number, tooltip: string];

export interface RangeData {
  kwh: number;
  deltaPct: number;
  period: string;
  comparison: string;
  bars: BarDatum[];
  shares: number[];
}

export interface TierInfo {
  name: string;
  sub: string;
  price: number;
  cap: number;
  color: string;
}

export interface TOUInfo {
  name: string;
  sub: string;
  price: number;
  share: number;
  color: string;
}

export interface BillDay {
  day: number;
  kwh: number;
  segs: { ti: number; kwh: number }[];
}

export interface DeviceDetailData {
  id: string;
  name: string;
  meta: string;
  avgW: string;
  costMonth: string;
  note: string;
  stats: { label: string; value: string }[];
}

export interface ChatFact {
  k: string;
  v: string;
}

export interface ChatMessage {
  id: string;
  who: 'ai' | 'me';
  text: string;
  facts?: ChatFact[];
  cta?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  category: string;
  period: string;
  timeAgo: string;
  group: 'today' | 'this_week' | 'earlier';
  dotColor: string;
  messages: ChatMessage[];
}

export interface Suggestion {
  q: string;
  a: string;
  facts: string | ChatFact[];
  cta: string;
}

export type ExperimentState = 'running' | 'summary' | 'suggest' | 'locked';

export interface ExperimentLogItem {
  id: string;
  title: string;
  date: string;
  result: string;
  savedVnd: number;
  note: string;
  good: boolean;
}

export interface AccountGroup {
  title: string;
  items: { label: string; value: string }[];
}
