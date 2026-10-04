import React from 'react';
import {
  PieChart,
  Users,
  Wallet,
  Megaphone,
} from 'lucide-react';

export type TabType = 'dashboard' | 'warga' | 'kas' | 'pengumuman';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  wargaCount: number;
  saldoKas: number;
  pengumumanCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  wargaCount,
  saldoKas,
  pengumumanCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'warga' as TabType,
      label: 'Data Warga & KK',
      icon: Users,
      badge: `${wargaCount} Jiwa`,
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'kas' as TabType,
      label: 'Kas & Iuran',
      icon: Wallet,
      badge: `Rp ${(saldoKas / 1000).toFixed(0)}k`,
      badgeClass: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'pengumuman' as TabType,
      label: 'Pengumuman & Agenda',
      icon: Megaphone,
      badge: pengumumanCount > 0 ? `${pengumumanCount}` : null,
      badgeClass: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-1.5 mb-6 overflow-x-auto">
      <nav className="flex space-x-1 min-w-max" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 mr-2 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-700/80 text-white border border-emerald-400/40'
                      : tab.badgeClass
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
