import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import {
  CURRENT_TIER,
  DAYS_LEFT,
  HEADROOM,
  INITIAL_CHAT,
  MOCK_CHAT_THREADS,
  MOCK_SUGGESTIONS,
  MONTH_KWH,
  PACE,
} from './mock';
import type {
  BreakdownView,
  ChatMessage,
  ChatThread,
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
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  createThread: (title?: string) => string;
  sendChatMessageToThread: (threadId: string, text: string) => void;
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
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [experimentState, setExperimentState] = useState<ExperimentState>('running');
  const [experimentTemp, setExperimentTemp] = useState<number>(26.5);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'kwh' ? 'cost' : 'kwh'));
  };

  const createThread = useCallback((title?: string): string => {
    const newId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: title || 'New inquiry',
      category: 'GENERAL',
      period: 'TODAY',
      timeAgo: 'Just now',
      group: 'today',
      dotColor: '#B5E930',
      messages: [
        {
          id: `msg-${Date.now()}`,
          who: 'ai',
          text: 'Good evening. Your meter is live and the last 30 days are indexed. Ask about a number and I will show where it comes from.',
          facts: [],
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    return newId;
  }, []);

  const sendChatMessageToThread = useCallback((threadId: string, text: string) => {
    const trimmed = text.trim();
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
      let ansText = hit.a;
      let facts = Array.isArray(hit.facts) ? hit.facts : [];

      if (hit.a === 'TIER_ANSWER') {
        ansText = `You are at ${MONTH_KWH} kWh with ${DAYS_LEFT} days left in the cycle. Staying inside ${CURRENT_TIER.name.toLowerCase()} means holding ${budget.toFixed(1)} kWh a day against your current ${PACE.toFixed(1)}. Shifting the water heater to the 22:00 window covers about half of the gap.`;
        facts = [
          { k: 'Used so far', v: `${MONTH_KWH} kWh` },
          { k: 'Headroom', v: `${HEADROOM} kWh` },
          { k: 'Daily budget', v: `${budget.toFixed(1)} kWh` },
        ];
      } else if (hit.a === 'PHANTOM_ANSWER') {
        const W = 35;
        const kwh = (W * 24 * 30) / 1000;
        const vnd = kwh * CURRENT_TIER.price;
        ansText = `Between 02:00 and 05:00 the flat floor sits at ${W} W after the fridge cycle is removed. That is about ${kwh.toFixed(0)} kWh a month from the TV cluster and the router shelf, billed at your marginal band, ${CURRENT_TIER.name.toLowerCase()}, so roughly ${Math.round(vnd).toLocaleString('en-US')} VND.`;
        facts = [
          { k: 'Standby power', v: `${W} W` },
          { k: 'Monthly waste', v: `${kwh.toFixed(0)} kWh` },
          { k: `At ${CURRENT_TIER.name} rate`, v: `${Math.round(vnd).toLocaleString('en-US')} VND` },
        ];
      }

      aiMsg = {
        id: `ai-${Date.now() + 1}`,
        who: 'ai',
        text: ansText,
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

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          const isNewInquiry = th.title === 'New inquiry';
          const newTitle = isNewInquiry ? trimmed : th.title;
          let newCategory = th.category;
          let newDotColor = th.dotColor;
          if (isNewInquiry) {
            const lower = trimmed.toLowerCase();
            if (lower.includes('bill') || lower.includes('tier')) {
              newCategory = 'BILL';
              newDotColor = '#2F7A0C';
            } else if (lower.includes('ac') || lower.includes('air')) {
              newCategory = 'AIR CON';
              newDotColor = '#B5E930';
            } else if (lower.includes('phantom') || lower.includes('standby')) {
              newCategory = 'ALWAYS ON';
              newDotColor = '#4A6B60';
            } else if (lower.includes('water') || lower.includes('heat')) {
              newCategory = 'WATER HEATER';
              newDotColor = '#B5E930';
            } else if (lower.includes('fridge')) {
              newCategory = 'FRIDGE';
              newDotColor = '#164437';
            } else if (lower.includes('cook')) {
              newCategory = 'COOKTOP';
              newDotColor = '#8CD41C';
            }
          }
          return {
            ...th,
            title: newTitle,
            category: newCategory,
            dotColor: newDotColor,
            timeAgo: 'Just now',
            messages: [...th.messages, userMsg, aiMsg],
          };
        }
        return th;
      })
    );
  }, []);

  const sendChatMessage = useCallback((query: string) => {
    if (activeThreadId) {
      sendChatMessageToThread(activeThreadId, query);
    }
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
  }, [activeThreadId, sendChatMessageToThread]);

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
      threads,
      activeThreadId,
      setActiveThreadId,
      createThread,
      sendChatMessageToThread,
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
      threads,
      activeThreadId,
      createThread,
      sendChatMessageToThread,
      chatMessages,
      sendChatMessage,
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

