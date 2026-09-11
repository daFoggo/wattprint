import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import {
  CURRENT_TIER,
  DAYS_LEFT,
  HEADROOM,
  INITIAL_CHAT,
  MOCK_SUGGESTIONS,
  MONTH_KWH,
  PACE,
} from './mock';
import type {
  BreakdownView,
  ChatMessage,
  CustomerType,
  ExperimentState,
  Range,
  TariffPlan,
  UnitMode,
  UsageTab,
} from './types';

interface EnergyStoreValue {
  // Legacy / Common
  range: Range;
  tariff: TariffPlan;
  setRange: (range: Range) => void;
  setTariff: (tariff: TariffPlan) => void;

  // Unit toggle (kWh ⇄ VND)
  unit: UnitMode;
  toggleUnit: () => void;

  // Usage Screen State
  usageTab: UsageTab;
  setUsageTab: (tab: UsageTab) => void;
  breakdownView: BreakdownView;
  setBreakdownView: (view: BreakdownView) => void;
  selectedDeviceIndex: number;
  setSelectedDeviceIndex: (index: number) => void;
  selectedUsageBar: number;
  setSelectedUsageBar: (index: number) => void;
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;

  // Copilot Chat State
  chatMessages: ChatMessage[];
  sendChatMessage: (query: string) => void;

  // Experiment State
  experimentState: ExperimentState;
  setExperimentState: (state: ExperimentState) => void;
  experimentTemp: number;
  setExperimentTemp: React.Dispatch<React.SetStateAction<number>>;
}

const EnergyStoreContext = createContext<EnergyStoreValue | null>(null);

export function EnergyStoreProvider({ children }: PropsWithChildren) {
  const [range, setRange] = useState<Range>('week');
  const [tariff, setTariff] = useState<TariffPlan>('tiered');
  const [unit, setUnit] = useState<UnitMode>('kwh');
  const [usageTab, setUsageTab] = useState<UsageTab>('week');
  const [breakdownView, setBreakdownView] = useState<BreakdownView>('bubble');
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const [selectedUsageBar, setSelectedUsageBar] = useState<number>(3);
  const [customerType, setCustomerType] = useState<CustomerType>('home');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [experimentState, setExperimentState] = useState<ExperimentState>('running');
  const [experimentTemp, setExperimentTemp] = useState<number>(26.5);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'kwh' ? 'cost' : 'kwh'));
  };

  const sendChatMessage = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      who: 'me',
      text: trimmed,
    };

    const hit = MOCK_SUGGESTIONS.find((s) => s.q.toLowerCase() === trimmed.toLowerCase());
    const budget = HEADROOM / DAYS_LEFT;

    let aiMsg: ChatMessage;
    if (hit) {
      let text = hit.a;
      let facts = Array.isArray(hit.facts) ? hit.facts : [];

      if (hit.a === 'TIER_ANSWER') {
        text = `You are at ${MONTH_KWH} kWh with ${DAYS_LEFT} days left in the cycle. Staying inside ${CURRENT_TIER.name.toLowerCase()} means holding ${budget.toFixed(1)} kWh a day against your current ${PACE.toFixed(1)}. Shifting the water heater to the 22:00 window covers about half of the gap.`;
        facts = [
          { k: 'Used so far', v: `${MONTH_KWH} kWh` },
          { k: 'Headroom', v: `${HEADROOM} kWh` },
          { k: 'Daily budget', v: `${budget.toFixed(1)} kWh` },
        ];
      } else if (hit.a === 'PHANTOM_ANSWER') {
        const W = 35;
        const kwh = (W * 24 * 30) / 1000;
        const vnd = kwh * CURRENT_TIER.price;
        text = `Between 02:00 and 05:00 the flat floor sits at ${W} W after the fridge cycle is removed. That is about ${kwh.toFixed(0)} kWh a month from the TV cluster and the router shelf, billed at your marginal band, ${CURRENT_TIER.name.toLowerCase()}, so roughly ${Math.round(vnd).toLocaleString('en-US')} VND.`;
        facts = [
          { k: 'Standby power', v: `${W} W` },
          { k: 'Monthly waste', v: `${kwh.toFixed(0)} kWh` },
          { k: `At ${CURRENT_TIER.name} rate`, v: `${Math.round(vnd).toLocaleString('en-US')} VND` },
        ];
      }

      aiMsg = {
        id: `ai-${Date.now() + 1}`,
        who: 'ai',
        text,
        facts,
        cta: hit.cta,
      };
    } else {
      aiMsg = {
        id: `ai-${Date.now() + 1}`,
        who: 'ai',
        text: 'I read that against your meter, the weather feed and the current EVN bands. Nothing in the last 30 days explains a change of that size on its own, so the honest answer is that it is within normal variation.',
        facts: [
          { k: 'Days indexed', v: '30' },
          { k: 'Confidence', v: 'Medium' },
        ],
      };
    }

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const value = useMemo<EnergyStoreValue>(
    () => ({
      range,
      tariff,
      setRange,
      setTariff,
      unit,
      toggleUnit,
      usageTab,
      setUsageTab,
      breakdownView,
      setBreakdownView,
      selectedDeviceIndex,
      setSelectedDeviceIndex,
      selectedUsageBar,
      setSelectedUsageBar,
      customerType,
      setCustomerType,
      chatMessages,
      sendChatMessage,
      experimentState,
      setExperimentState,
      experimentTemp,
      setExperimentTemp,
    }),
    [
      range,
      tariff,
      unit,
      usageTab,
      breakdownView,
      selectedDeviceIndex,
      selectedUsageBar,
      customerType,
      chatMessages,
      experimentState,
      experimentTemp,
    ]
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

