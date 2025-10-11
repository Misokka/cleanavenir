import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#083A31', 
          light: '#3F6868',   
        },
        neutral: {
          light: '#E9EDF1',   
          dark: '#000000',   
        },

        'clean-dark': '#083A31',
        'clean-secondary': '#3F6868',
        'clean-light': '#E9EDF1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
