const { colors } = require('tailwindcss/defaultTheme')
module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        //Give the default template more directives. 
        // Use these names in the place of named colors on helper classes
        //Ex: bg-primary 
        primary: '#5c6ac4',
        secondary: '#ecc94b',
      }
    },
  },
  variants: {},
  plugins: [],
}
