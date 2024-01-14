import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "red-gradient": "url('https://nextui.org/gradients/docs-right.png')",
        "blue-gradient": "url('https://nextui.org/gradients/docs-left.png')",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          // ...
          colors: {},
        },
        dark: {
          // ...
          colors: {
            // primary: "#DEDCFF",

          },
        },
        // ... custom themes
      },
    }),
  ],
};
