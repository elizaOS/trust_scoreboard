import type { FC } from "react"
import Image from "next/image"
import styles from "./Trades.module.css"

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
  <div className="flex items-center justify-between bg-[#1C1C1C] rounded-lg p-4 mb-2">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Image
          src="/solana-logo.png"
          alt="Solana Logo"
          width={24}
          height={24}
          className="absolute top-0 right-0"
        />
        <Image
          src={trade.user.avatarUrl}
          alt={trade.user.name}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-white text-lg">{trade.type}</span>
        <span className="text-gray-400">{trade.user.name}</span>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-green-400">+{trade.tokenOut.amount.toLocaleString()} ${trade.tokenOut.symbol}</span>
      <span className="text-white">-{trade.tokenIn.amount} {trade.tokenIn.symbol}</span>
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
      user: { name: "Jupiter", avatarUrl: "/avatar.png" }
    },
    // Add more mock trades as needed
  ]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-white text-center mb-4">Marc's Trades</h1>
      <p className="text-gray-400 text-center mb-8">
        Join our discord for access to Marc's Cabal Chat.
      </p>
      
      <div className="space-y-4">
        {trades.map(trade => (
          <div key={trade.id}>
            <div className="text-gray-400 mb-2">
              {trade.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
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
