import { tailwindConfig } from "natmfat/integrations/tailwind";
import type { Config } from "tailwindcss";

export default {
  ...tailwindConfig,
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
} satisfies Config;
