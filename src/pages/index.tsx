// FILE: src/pages/index.tsx
import type { NextPage } from "next"
import Head from "next/head"
import { HomeView } from "../views/home/index"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ai16z - Marc&apos;s Trust Leaderboard</title>
        <meta name="description" content="ai16z - Marc's Trust Leaderboard" />
      </Head>
      <HomeView />
    </div>
  )
}

export default Home
