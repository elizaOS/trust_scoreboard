import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get cursor and limit from query params, with defaults
    const cursor = req.query.cursor || 1
    const limit = req.query.limit || 100
    const URL = `${process.env.NEST_API_URL}/user/getUsers?cursor=${cursor}&limit=${limit}`

    const usersResponse = await fetch(URL, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!usersResponse.ok) {
      const error = await usersResponse.json()
      return res.status(usersResponse.status).json({
        error: error.message || "Failed to fetch users",
      })
    }

    const users = await usersResponse.json()
    console.log("users", users)
    return res.status(200).json(users)
  } catch (error) {
    console.error("Error:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
