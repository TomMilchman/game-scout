import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    outputFileTracingIncludes: {
        "*": ["./node_modules/steamapi/package.json"],
    },
};

export default nextConfig;
