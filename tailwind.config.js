module.exports = {
  purge: [],
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'lightred': '#FF565E',
      'lightyellow': '#FFC542',
      'lightgreen': '#3ED598',
      'darkred': '#623A42',
      'darkyellow': '#625B39',
      'darkgreen': '#286053',
     }),
     textColor: theme => ({
      ...theme('colors'),
      'lightred': '#FF565E',
      'lightyellow': '#FFC542',
      'lightgreen': '#3ED598',
      'darkred': '#623A42',
      'darkyellow': '#625B39',
      'darkgreen': '#286053',
     }),
    extend: {
      width: {
        '80': '20rem',
        '48%': '48%',
      },
    },
  },
  variants: {},
  plugins: [],
}
