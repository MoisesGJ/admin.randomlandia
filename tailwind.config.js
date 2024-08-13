/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#e56c25",
        blue: "#2A3563",
        "blue-text": "#112A46",
        oldwhite: "#f6ead7",
      },
    },
  },
  plugins: [],
};
