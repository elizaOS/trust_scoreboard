import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const URL = `${process.env.DAO_API_URL}`

    const response = await fetch(URL, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(response.status).json({
        error: error.message || "Failed to fetch users",
      })
    }

    const data = await response.json()

    return res.status(200).json(data)
  } catch (error) {
    console.error("Error:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
