const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = [
  {
    name: 'site',
    entry: './src/site/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|jp2|webp)$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'build/site/assets'),
      filename: 'index.js',
    },
    cache: {
      type: 'filesystem',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/site/index.html', to: '..' },
        ],
      }),
    ],
    performance: {
      hints: false,
    },
  },
  {
    name: 'worker',
    entry: './src/worker/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'build/worker'),
      filename: 'index.mjs',
      // library: {
      //   type: 'module',
      // },
    },
    cache: {
      type: 'filesystem',
    },
    experiments: {
      outputModule: true,
    },
  }
]