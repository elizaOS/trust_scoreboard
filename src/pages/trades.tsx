import { FC } from "react"
import { TradesView } from "@/views/trades/index"
import Head from "next/head"

const TradesPage: FC = () => {
  return (
    <div>
      <Head>
        <title>ai16z - Marc&apos;s Trades</title>
        <meta name="description" content="ai16z - Marc's Trades" />
      </Head>
      <TradesView />
    </div>
  )
}

export default TradesPage
