/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.discordapp.com', 'pbs.twimg.com'],
  },
}

module.exports = nextConfig
