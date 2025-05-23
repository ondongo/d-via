import type { Config } from "tailwindcss";
import { Customcolors } from "./theme/colors";
import { Customshadow } from "./theme/shadow";
import { Customanimation, Customkeyframes } from "./theme/animation";
import { CustomfontFamily, CustomfontSize } from "./theme/fonts";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/admin/admin-style.css",
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: "15px",
      },
    },

    extend: {
      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },
      fontSize: CustomfontSize,
      colors: Customcolors,
      boxShadow: Customshadow,
      animation: Customanimation,
      fontFamily: CustomfontFamily,
      keyframes: Customkeyframes,
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
} satisfies Config;
