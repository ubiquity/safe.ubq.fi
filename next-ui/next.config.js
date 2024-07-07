const { execSync } = require("child_process");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SALT: process.env.SALT,
    commitHash: execSync(`git rev-parse --short HEAD`).toString().trim(),
  },
};

module.exports = nextConfig;
