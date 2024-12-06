import { Suspense, useMemo, type FC } from "react"
import Image from "next/image"
import { AvatarWithFallback } from "../leaderboard/AvatarImage"
import { TTrade, useGetTrades } from "@/services/useTrades"

const TradeRow: FC<{ trade: TTrade }> = ({ trade }) => {
  const buyTransaction = trade.transactions.find(
    (transaction) => transaction.type === "buy"
  )

  return (
    <div className="mb-2 flex items-center justify-between rounded-3xl bg-[#2d2d2d] p-3.5">
      <div className="flex items-center gap-2">
        <div className="relative h-[34px] w-[34px]">
          <div className="absolute bottom-0 right-0 z-10 inline-flex items-center justify-center rounded-full border-2 border-[#2d2d2d]">
            <Image
              src="/ai16z.png"
              alt="AI16Z Logo"
              width={24}
              height={24}
              className=""
            />
          </div>
          <AvatarWithFallback
            src={trade.logoURI}
            name={trade.tokenName}
            size={17}
            className="absolute left-0 top-0 h-[17px] max-h-[17px] min-h-[17px] w-[17px] min-w-[17px] max-w-[17px]"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg text-white">{trade.tokenName}</span>
          <span className="text-gray-400">Swapped</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-green-400">
          +{buyTransaction.uiAmount} {buyTransaction.tokenName}
        </span>
        <span className="text-white">
          -{trade.uiAmount} {trade.tokenName}
        </span>
      </div>
    </div>
  )
}

const Trades: FC = () => {
  const { trades, isLoading } = useGetTrades()

  const groupedTrades = useMemo(() => {
    return trades.reduce((acc, trade) => {
      const date = new Date(trade.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      acc[date] = acc[date] || []
      acc[date].push(trade)
      return acc
    }, {})
  }, [trades])

  // console.log("trades", trades)
  // console.log("groupedTrades", groupedTrades)

  // Mock data - replace with actual data fetching
  // const trades: Trade[] = [
  //   {
  //   "id": 6,
  //   "tokenAddr": "5Wks26U7cCtvWamvb8vSoW7a5F7PBz1YNZdnL197pump",
  //   "tokenName": "THREAD",
  //   "logoURI": "https://ipfs.io/ipfs/QmSjFvQMeJoynVMhAXKUCwiLZeANmQFCmyJG4WHp1AccKM",
  //   "decimals": 6,
  //   "bundleSignature": "ca0fb88f93779cc60986cd4bb78b92e1e853bbb5279229dfe190b66150115fe0",
  //   "amount": "40094386181369",
  //   "createdAt": "2024-12-05T03:57:06.609Z",
  //   "updatedAt": "2024-12-06T02:15:31.436Z",
  //   "transactions": [
  //     {
  //       "hash": "5ibLKYBmFG45qJ7QyWdZxdp71GL9YLhz2mXqHm4WmK1S1MCuo7X3MTpHCo4rRsCrcV6Kpo7Zd8Jo3CVVNS68yhs8",
  //       "tokenAddr": "So11111111111111111111111111111111111111112",
  //       "tokenName": "WSOL",
  //       "amount": "1841882130",
  //       "type": "sell",
  //       "uiAmount": "1.84"
  //     },
  //     {
  //       "hash": "45sKDAYKc3UxbRQGJ4oXwCo6hSikpWJAjR6dZwQ6Ju2kBEZNRWqYLFmYx7YNZULdFDgXBZxhnBAnngxNqdUREnBA",
  //       "tokenAddr": "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
  //       "tokenName": "AI16Z",
  //       "amount": "755020584348",
  //       "type": "buy",
  //       "uiAmount": "755.02"
  //     }
  //   ],
  //   "uiAmount": "40094386.18"
  // },
  //   {
  //     id: "1",
  //     date: new Date("2024-11-12"),
  //     type: "Swapped",
  //     tokenIn: { amount: 100, symbol: "SOL" },
  //     tokenOut: { amount: 234324, symbol: "WIF" },
  //     user: { name: "Jupiter", avatarUrl: "/avatar.png" },
  //   },
  //   {
  //     id: "2",
  //     date: new Date("2024-11-12"),
  //     type: "Swapped",
  //     tokenIn: { amount: 100, symbol: "SOL" },
  //     tokenOut: { amount: 234324, symbol: "WIF" },
  //     user: { name: "Jupiter", avatarUrl: "/avatar.png" },
  //   },
  //   {
  //     id: "2",
  //     date: new Date("2024-11-14"),
  //     type: "Swapped",
  //     tokenIn: { amount: 100, symbol: "SOL" },
  //     tokenOut: { amount: 234324, symbol: "WIF" },
  //     user: { name: "Jupiter", avatarUrl: "/avatar.png" },
  //   },
  //   // Add more mock trades as needed
  // ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto w-full max-w-xl py-12">
        <h1 className="mb-4 text-center text-4xl font-bold text-white">
          Marc&apos;s Trades
        </h1>
        <p className="mb-8 text-center text-gray-400">
          Join our discord for access to Marc&apos;s Cabal Chat.
        </p>

        <div className="space-y-4">
          {Object.entries(groupedTrades).map(([date, trades]) => (
            <div key={date}>
              <div className="mb-2 text-gray-400">{date}</div>
              {(trades as TTrade[]).map((trade: TTrade) => (
                <TradeRow key={trade.id} trade={trade} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  )
}

export default Trades
