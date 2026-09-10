import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Range, TariffPlan } from './types';

interface EnergyStoreValue {
  range: Range;
  tariff: TariffPlan;
  setRange: (range: Range) => void;
  setTariff: (tariff: TariffPlan) => void;
}

const EnergyStoreContext = createContext<EnergyStoreValue | null>(null);

export function EnergyStoreProvider({ children }: PropsWithChildren) {
  const [range, setRange] = useState<Range>('week');
  const [tariff, setTariff] = useState<TariffPlan>('tiered');

  const value = useMemo<EnergyStoreValue>(
    () => ({ range, tariff, setRange, setTariff }),
    [range, tariff]
  );

  return <EnergyStoreContext.Provider value={value}>{children}</EnergyStoreContext.Provider>;
}

export function useEnergyStore(): EnergyStoreValue {
  const value = useContext(EnergyStoreContext);
  if (!value) {
    throw new Error('useEnergyStore must be used within an EnergyStoreProvider');
  }
  return value;
}
