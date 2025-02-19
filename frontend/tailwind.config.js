import preline from "preline/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        logolike: ["Jua", "serif"], // Esta es la fuente específica
      },
      colors: {
        CadmiumOrange: "#eb8933",
        MaximumYellow: "#f4b841",
        YankeesBlue: "#103045",
        Moonstone: "#4b9bb8",
      },
      backgroundImage: {
        "pulpo-pattern": "url('./src/shared/assets/pattern pulpo.svg')",
      },
    },
  },
  plugins: [preline],
};
