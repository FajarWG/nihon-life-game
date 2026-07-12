import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in a parent folder otherwise
  // makes Turbopack treat ../ as the project root.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
