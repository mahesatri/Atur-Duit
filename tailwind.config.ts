import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#00C58A",
        greenDark: "#1F4F3F",
        greenSoft: "#2D7A5E",
        greenMist: "#9DDFC7",
        bg: "#F5F9F7",
        sidebar: "#1F4F3F",
        income: "#00C58A",
        expense: "#FF6B6B",
        expenseDeep: "#8A1F1F",
        expenseSoft: "#FFE9E9",
        iconBg: "#E8FAF0",
        incomeChip: "#F4FFF7",
        expenseChip: "#FDF7EF",
        textDark: "#1F4F3F",
        textLabel: "#4E6B54",
        textMuted: "#9BB5A4",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        pill: "16px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.05)",
        floating: "0 4px 20px rgba(0,0,0,0.10)",
        nav: "0 -2px 16px rgba(0,0,0,0.08)",
        sidebar: "2px 0 20px rgba(0,0,0,0.08)",
      },
      spacing: {
        "52": "13rem",
        "16": "4rem",
      },
    },
  },
  plugins: [],
};

export default config;
