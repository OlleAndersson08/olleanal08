import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Låt Postgres-drivrutinen köras som ett vanligt Node-paket (inte buntas),
  // vilket är best practice för "pg" på serverless/Vercel.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
