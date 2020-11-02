const defaultTheme = require("tailwindcss/defaultTheme");

const whitelist = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
  "pink"
].reduce(
  (result, color) =>
    result.push(`text-${color}-600`, `bg-${color}-600`, `bg-${color}-500`) &&
    result,
  []
);

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./index.html", "./src/**/*.{vue, js}"],
    options: {
      whitelist
    }
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  extend:{
    animation: {
      fadeIn: "fadeIn 2s ease-in forwards"
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 }
      }
    }
  },
  variants: {
    animation: ["responsive", "motion-safe"]
  },
  plugins: [require("@tailwindcss/custom-forms")]
};
