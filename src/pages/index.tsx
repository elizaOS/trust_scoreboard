// FILE: src/pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views/home/index";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ai16z Partners Lounge</title>
        <meta
          name="description"
          content="ai16z Partners Lounge"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;