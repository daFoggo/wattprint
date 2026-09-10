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
