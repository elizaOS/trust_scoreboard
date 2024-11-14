import { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

function verifyTelegramAuth(data: any): boolean {
  const secret = createHash("sha256").update(TELEGRAM_BOT_TOKEN).digest();
  const checkHash = data.hash;
  const dataStr = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
  const hash = createHash("sha256").update(dataStr).digest("hex");
  return checkHash === hash;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, username, hash } = req.query;
  if (!id || !username || !hash) {
    return res.status(400).json({ error: "Missing Telegram data" });
  }

  const telegramData = { id, username, hash };

  if (verifyTelegramAuth(telegramData)) {
    const user = await fetch(`${process.env.NEST_API_URL}/user/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "telegram",
        providerId: id,
        name: username,
      }),
    }).then((res) => res.json());

    res.status(200).json({ ...user });
  } else {
    res.status(400).json({ error: "Invalid Telegram authentication" });
  }
};

export default handler;
