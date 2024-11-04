// FILE: src/views/HomeView.tsx
import { FC, useState } from 'react';
import LeaderboardTotals from '../../components/LeaderboardTotals';
import LeaderboardPartners from '../../components/LeaderboardPartners';
import LeaderboardHoldings from '../../components/LeaderboardHoldings';
import LeaderboardHoldingTotals from '../../components/LeaderboardHoldingTotals';

export const HomeView: FC = () => {
  const [activeView, setActiveView] = useState<'partners' | 'holdings'>('partners');

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="md:hero mx-auto p-2">
        <div className="md:hero-content flex flex-col w-full">
          {/* Leaderboard Section */}
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-[34px] font-semibold text-[#242424] bg-clip-text mb-[24px]">
              Leaderboard
            </h2>
            <div className="flex mb-[24px]">
              <button
                onClick={() => setActiveView('partners')}
                className={`px-6 py-2 rounded-[0.875rem] transition-all ${
                  activeView === 'partners'
                  ? 'bg-[#B5AD94] text-white' // Active state
                  : 'bg-[#E8E3D500] text-[#9B8D7D]' // Inactive state
                }`}
              >
                Partners
              </button>
              <button
                onClick={() => setActiveView('holdings')}
                className={`px-6 py-2 rounded-[0.875rem] transition-all ${
                  activeView === 'holdings'
                  ? 'bg-[#B5AD94] text-white font-semibold' // Active state
                  : 'bg-[#E8E3D500] text-[#9B8D7D] font-semibold' // Inactive state
                }`}
              >
                Holdings
              </button>
            </div>
            {activeView === 'partners' ? <LeaderboardTotals /> : <LeaderboardHoldingTotals />}
            <div className="relative group">
                {activeView === 'partners' ? <LeaderboardPartners /> : <LeaderboardHoldings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};