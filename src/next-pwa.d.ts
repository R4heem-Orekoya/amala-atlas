declare module "next-pwa" {
  import type { NextConfig } from "next";

  type PWAConfig = {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    //eslint-disable-next-line
    runtimeCaching?: any[];
  };

  export default function withPWA(
    options?: PWAConfig
  ): (config: NextConfig) => NextConfig;
}
