// /pages/api/user/getProfile.ts
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the session, which includes the access token
  const session = await getSession({ req });

  // Check if session exists and accessToken is available
  if (!session || !session.user || !session.user.connections) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No connections found" });
  }

  const connection =
    session.user.connections["telegram"] || session.user.connections["discord"];
  if (!connection) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No Telegram or Discord connection found" });
  }
  if (!connection || !connection.accessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No access token found" });
  }

  const accessToken = connection.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/getProfile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      const error = await response.json();
      return res
        .status(response.status)
        .json({ error: error.message || "Failed to fetch profile" });
    }

    // Parse and return the response data
    const profileData = await response.json();
    return res.status(200).json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
