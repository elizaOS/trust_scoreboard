import type { NextPage } from "next"
import Head from "next/head"
import Trades from "../components/trades/Trades"

const TradesPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Marc's Trades</title>
        <meta
          name="description"
          content="View Marc's trading activity and performance"
        />
      </Head>
      <Trades />
    </div>
  )
}

// Add this to explicitly tell Next.js this is not a dynamic page
export const getStaticProps = () => {
  return {
    props: {},
  }
}

export default TradesPage
