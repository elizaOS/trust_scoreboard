import type { NextPage } from "next";
import Head from "next/head";
import ProfileView from "../views/profile";

const Profile: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta
          name="description"
          content="Profile"
        />
      </Head>
      <ProfileView />
    </div>
  );
};

export default Profile;
