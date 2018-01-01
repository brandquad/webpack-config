'use strict';

// --- dependencies
const path = require('path');
const webpack = require('webpack');

// --- Environment
const isProduction = process.env.NODE_ENV === 'production';

// --- components path
const devFolder = path.resolve(__dirname, './frontend');
const paths = {
  devFolder: devFolder,

  entry: {
    catalog_v2: getEntry('catalog_v2'),
    buyfeedback_v2: getEntry('buyfeedback_v2')
  },

  output: {
    path: path.resolve(__dirname, './static/js/dist'),
    publicPath: '../../static/js/dist/',
    filename: '[name].js'
  },

  globals: {
    styl: `${devFolder}/assets/styl/_global.styl`,
    scss: `${devFolder}/assets/scss/_global.scss`,
    sass: `${devFolder}/assets/scss/_global.scss`
  }
};

// --- globals
const aliasScss = 'globalScss';
const aliasStyl = 'globalStyl';

const globalStyl = paths.globals.styl;
const globalScss = paths.globals.scss;

// --- module rules
const rules = [
  {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'postcss-loader'
    ]
  },
  {
    test: /\.(scss|sass)$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ]
  },
  {
    test: /\.(styl|stylus)$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'stylus-loader'
    ]
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: {
        sass: { loader: getLoader('sass') },
        scss: { loader: getLoader('scss') },
        stylus: { loader: getLoader('stylus') }
      },
      cssModules: {
        localIdentName: '[name]---[hash:base64:5]',
        camelCase: true
      },
      autoprefixer: false // if postcss enabled
    }
  },
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  }
];

// --- Base Webpack configuration
module.exports = {
  entry: paths.entry,

  output: paths.output,

  module: {
    rules: rules
  },

  resolve: {
    extensions: [
      '*',
      '.css',
      '.scss',
      '.sass',
      '.styl',
      '.js',
      '.vue',
      '.json'
    ],
    alias: {
      globalStyl,
      globalScss
    }
  },

  performance: {
    hints: false
  },

  devtool: (isProduction) ? false : 'cheap-module-eval-source-map',

  plugins: (isProduction) ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ] : []
};

function getEntry(folder) {
  return path.resolve(__dirname, `${devFolder}/${folder}/main.js`);
}

function getLoader(ext) {
  const css = 'css-loader?{discardComments:{removeAll:true}}';
  const postcss = 'postcss-loader?sourceMap';

  let current;
  switch(ext) {
    case 'stylus':
      current = `stylus-loader?include css&import=~${aliasStyl}`;
      break;
    case 'scss':
    case 'sass':
      current = `sass-loader?data=@import '~${aliasScss}';`;
      break;
    default:
      current = '';
      break;
  }

  return `vue-style-loader!${css}!${postcss}!${current}`;
}
