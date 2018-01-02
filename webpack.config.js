'use strict';

// --- dependencies
const path = require('path');
const webpack = require('webpack');

// --- Environment
const isProduction = (process.env.NODE_ENV === 'production');

// --- dev folder
const devFolder = path.resolve(__dirname, './frontend');

// --- globals
const aliasScss = 'globalScss';
const aliasStyl = 'globalStyl';

const globalStyl = `${devFolder}/assets/styl/_global.styl`;
const globalScss = `${devFolder}/assets/scss/_global.scss`;

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
const config = {
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
      vue$: 'vue/dist/vue.esm.js',
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

const catalog_v2 = Object.assign({}, config, getComponent('catalog_v2'));
const buyfeedback_v2 = Object.assign({}, config, getComponent('buyfeedback_v2'));

module.exports = [
  catalog_v2,
  buyfeedback_v2
];

function getComponent(name) {
  return {
    name: name,
    entry: getEntry(name),
    output: {
      path: (isProduction) ?
        path.resolve(__dirname, `./components/${name}/static/js`) :
        path.resolve(__dirname, `./static/js/${name}`),
      publicPath: `../../${(isProduction) ? `components/${name}/static/js` : `static/js/${name}`}/`,
      filename: `${name}.bundle.js`,
      chunkFilename: '[name].chunk.js'
    }
  }
}

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
