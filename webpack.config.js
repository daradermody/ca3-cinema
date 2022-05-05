const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = [
  {
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
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js',
    },
    cache: {
      type: 'filesystem',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/site/index.html', to: '.' },
        ],
      }),
    ],
    performance: {
      hints: false,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      historyApiFallback: true,
    },
  }
]