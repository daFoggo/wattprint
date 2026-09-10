import type { DeviceUsage, EnergySummary, UsagePoint } from './types';

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
