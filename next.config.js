/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "pbs.twimg.com",
      "images.ladbible.com",
      "t.me",
      "telegram.org",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ipfs.nftstorage.link",
      },
    ],
  },
}

module.exports = nextConfig
