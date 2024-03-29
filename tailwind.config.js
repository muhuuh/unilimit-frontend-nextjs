/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        brightRed: "hsl(12, 88%, 59%)",
        brightRedLight: "hsl(12, 88%, 69%)",
        brightRedSupLight: "hsl(12, 88%, 95%)",
        darkRed: "RGB(205,5,5)",
        brownRed: "RGB(185, 39, 13)",
        brown: "RGB(128,25,7)",
        darkBrown: "RGB(109,16,7)",
        grayishBlue: "RGB(82,99,203)",
        darkBlue: "hsl(228, 39%, 23%)",
        darkGrayishBlue: "hsl(227, 12%, 61%)",
        paleGrayishBlue: "RGB(183, 193, 254)",
        veryDarkBlue: "hsl(233, 12%, 13%)",
        zigzagBlue: "RGB(19,52,80)",
        zigzagBlueDark: "RGB(22,36,54)",
        veryPaleRed: "hsl(13, 100%, 96%)",
        veryLightGray: "hsl(0, 0%, 98%)",
        goldGray: "RGB(75, 75, 75)",
        darkGray: "hsl(11, 3%, 30%)",
        lightBlack: "hsl(219, 5%, 15%)",
        lila: "#40005d",
        lightLila: "#a892ee",
        veryLightLila: "RGB(234, 227, 253)",
        buyGreen: "RGB(17,147,50)",
        lightGreen: "RGB(107,223,137)",
        DarkModeVeryDark: "RGB(18,18,18)",
        DarkModeTwitterDark: "RGB(25,39,52)",
        DarkModeDark2: "RGB(24,24,24)",
        DarkModeDark: "RGB(51,48,49)",
        DarkModeTradingView: "RGB(22,26,37)",
        DarkModeLightGray: "RGB(133,133,133)",
        DarkModeVeryLightGray: "RGB(179,179,179)",
        DarkModeGray: "RGB(64,64,64)",
        //teal: RGB(51,153,153)
      },
      height: {
        610: "38rem",
      },
      animation: {
        typing: "typing 5s infinite steps(34)",
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0",
          },
          "80%": {
            width: "37ch",
          },
          "100%": {
            width: "37ch",
          },
        },
      },
    },
  },
  plugins: [],
};
