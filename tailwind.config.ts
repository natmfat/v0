import type { Config } from "tailwindcss";
import { tailwindConfig } from "tanukui/lib/tailwindConfig.js";

export default {
  ...tailwindConfig,
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
} satisfies Config;
