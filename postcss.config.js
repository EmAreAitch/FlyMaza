module.exports = {
  plugins: {
    '@tailwindcss/nesting': {},  // flatten nested rules
    "@tailwindcss/postcss": {},   // ← new plugin
    autoprefixer: {},             // add vendor prefixes
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}
