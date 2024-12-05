import type { FC } from "react"
import Image from "next/image"
import styles from "./Trades.module.css"
import { AvatarWithFallback } from "../leaderboard/AvatarImage"

interface Trade {
  id: string
  date: Date
  type: "Swapped"
  tokenIn: {
    amount: number
    symbol: string
  }
  tokenOut: {
    amount: number
    symbol: string
  }
  user: {
    name: string
    avatarUrl: string
  }
}

const TradeRow: FC<{ trade: Trade }> = ({ trade }) => (
  <div className="mb-2 flex items-center justify-between rounded-3xl bg-[#2d2d2d] p-3.5">
    <div className="flex items-center gap-2">
      <div className="relative h-[34px] w-[34px]">
        <div className="absolute bottom-0 right-0 z-10 inline-flex items-center justify-center rounded-full border-2 border-[#2d2d2d]">
          <AvatarWithFallback
            src={trade.user.avatarUrl}
            name={trade.user.name}
            size={24}
            className="h-[24px] max-h-[24px] min-h-[24px] w-[24px] min-w-[24px] max-w-[24px]"
          />
        </div>
        <Image
          src="/logo_solana.svg"
          alt="Solana Logo"
          width={17}
          height={17}
          className="absolute left-0 top-0"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg text-white">{trade.type}</span>
        <span className="text-gray-400">{trade.user.name}</span>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-green-400">
        +{trade.tokenOut.amount.toLocaleString()} ${trade.tokenOut.symbol}
      </span>
      <span className="text-white">
        -{trade.tokenIn.amount} {trade.tokenIn.symbol}
      </span>
    </div>
  </div>
)

const Trades: FC = () => {
  // Mock data - replace with actual data fetching
  const trades: Trade[] = [
    {
      id: "1",
      date: new Date("2024-11-12"),
      type: "Swapped",
      tokenIn: { amount: 100, symbol: "SOL" },
      tokenOut: { amount: 234324, symbol: "WIF" },
      user: { name: "Jupiter", avatarUrl: "/avatar.png" },
    },
    {
      id: "2",
      date: new Date("2024-11-12"),
      type: "Swapped",
      tokenIn: { amount: 100, symbol: "SOL" },
      tokenOut: { amount: 234324, symbol: "WIF" },
      user: { name: "Jupiter", avatarUrl: "/avatar.png" },
    },
    {
      id: "2",
      date: new Date("2024-11-14"),
      type: "Swapped",
      tokenIn: { amount: 100, symbol: "SOL" },
      tokenOut: { amount: 234324, symbol: "WIF" },
      user: { name: "Jupiter", avatarUrl: "/avatar.png" },
    },
    // Add more mock trades as needed
  ]

  return (
    <div className="mx-auto w-full max-w-xl py-12">
      <h1 className="mb-4 text-center text-4xl font-bold text-white">
        Marc&apos;s Trades
      </h1>
      <p className="mb-8 text-center text-gray-400">
        Join our discord for access to Marc&apos;s Cabal Chat.
      </p>

      <div className="space-y-4">
        {trades.map((trade) => (
          <div key={trade.id}>
            <div className="mb-2 text-gray-400">
              {trade.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <TradeRow trade={trade} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Trades
