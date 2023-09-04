import postcssNesting from 'postcss-nesting'
import postcssVhFix from 'postcss-viewport-height-correction'

export default {
  parser: 'sugarss',
  map: false,
  plugins: {
    'postcss-plugin': {
      postcssNesting,
      postcssVhFix
    }
  }
}
