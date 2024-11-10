import type { NextPage } from "next";
import Head from "next/head";
import SaasView from "../views/saas";

const Saas: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Trust Score API - Pricing</title>
        <meta
          name="description"
          content="Access Trust Score API with flexible pricing plans"
        />
      </Head>
      <SaasView />
    </div>
  );
};

export default Saas;