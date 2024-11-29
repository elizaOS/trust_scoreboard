// FILE: src/views/HomeView.tsx
import { FC, useState } from "react"
import LeaderboardTotals from "../components/leaderboard/LeaderboardTotals"
import LeaderboardPartners from "../components/leaderboard/LeaderboardPartners"
import LeaderboardHoldings from "../components/leaderboard/LeaderboardHoldings"

export const HomeView: FC = () => {
  const [activeView, setActiveView] = useState<"partners" | "holdings">(
    "partners"
  )

  return (
    <div className="flex min-h-screen items-center justify-center px-2">
      <div className="mx-auto p-2 md:hero">
        <div className="flex w-full flex-col md:hero-content">
          {/* Leaderboard Section */}
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="mb-4 bg-clip-text text-3xl font-bold text-black">
              Leaderboard
            </h2>
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => setActiveView("partners")}
                className={`rounded-lg px-6 py-2 transition-all ${
                  activeView === "partners"
                    ? "bg-[#B5AD94] text-white" // Active state
                    : "bg-[#E8E3D500] text-slate-700" // Inactive state
                }`}
              >
                Partners
              </button>
              <button
                onClick={() => setActiveView("holdings")}
                className={`rounded-lg px-6 py-2 transition-all ${
                  activeView === "holdings"
                    ? "bg-[#B5AD94] text-white" // Active state
                    : "bg-[#E8E3D500] text-slate-700" // Inactive state
                }`}
              >
                Holdings
              </button>
            </div>
            <LeaderboardTotals />
            {/* <div className="relative group">
                {activeView === 'partners' ? <LeaderboardPartners /> : <LeaderboardHoldings />}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
