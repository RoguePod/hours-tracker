module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.js'),
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-reporter')
  ]
}
