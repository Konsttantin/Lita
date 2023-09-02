import postcssNesting from 'postcss-nesting'

export default {
  parser: 'sugarss',
  map: false,
  plugins: {
    'postcss-plugin': {
      postcssNesting
    }
  }
}
