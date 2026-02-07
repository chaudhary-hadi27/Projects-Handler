// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Fix Turbopack warning
    turbopack: {
        root: process.cwd()
    }
}

module.exports = nextConfig