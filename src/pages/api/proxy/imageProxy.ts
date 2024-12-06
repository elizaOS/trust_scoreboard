import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    // Cache the image for 24 hours
    res.setHeader("Cache-Control", "public, max-age=86400")
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    )
    res.send(buffer)
  } catch (error) {
    console.error("Image proxy error:", error)
    res.status(500).json({ error: "Failed to fetch image" })
  }
}
