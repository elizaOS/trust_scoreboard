import type { NextPage } from "next";
import Head from "next/head";
import CreditsView from "../views/credits";

const Credits: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Buy API Credits - Trust Score</title>
        <meta
          name="description"
          content="Purchase API credits for Trust Score access"
        />
      </Head>
      <CreditsView />
    </div>
  );
};

export default Credits;