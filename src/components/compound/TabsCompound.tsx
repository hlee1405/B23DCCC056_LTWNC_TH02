import React, { createContext, useContext, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used inside <Tabs.Root>');
  }
  return context;
}

interface TabsRootProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

function TabsRoot({ activeTab, onTabChange, children }: TabsRootProps) {
  return (
    <TabsContext.Provider value={{ activeTab, onTabChange }}>
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">{children}</div>
    </TabsContext.Provider>
  );
}

interface TabItemProps {
  id: string;
  label: string;
  count?: number;
}

function TabItem({ id, label, count }: TabItemProps) {
  const { activeTab, onTabChange } = useTabsContext();
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      id={`tab-${id}`}
      onClick={() => onTabChange(id)}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
        isActive
          ? 'bg-white text-slate-900 shadow-xs'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${
            isActive ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  Item: TabItem,
});
