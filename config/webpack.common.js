const path = require('path')
const { isDev } = require('./constants')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WebpackBar = require('webpackbar')
const webpack = require('webpack')

const getCssLoaders = (importLoaders) => [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
              stage: 3,
            },
          ],
        ],
      },
      sourceMap: isDev,
    },
  },
]

module.exports = {
  entry: path.resolve(__dirname, '/src/index.tsx'),
  output: {
    filename: `[name]${isDev ? '' : '.[chunkhash:8]'}.js`,
    path: path.resolve(__dirname, '../dist'), // 設定しないと、CleanWebpackPluginが効かない
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    // 配置别名不用再一层一层的../../和tsconfig.json中的baseUrl和paths配合
    alias: {
      src: path.resolve(__dirname, '/src'),
      components: path.resolve(__dirname, '/src/components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          '@teamsupercell/typings-for-css-modules-loader',
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
        exclude: /node_modules/,
      },
      // 画像やiconfontなど
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/fonts',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'React+Typescript',
      filename: `index${isDev ? '' : '.[chunkhash:8]'}.html`,
      template: './public/index.html',
    }),
    new ReactRefreshWebpackPlugin(),
    // 配置ProvidePlugin就不需要每个组件都import React from 'react了
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    // typings-for-css-modules-loader会生成.d.ts文件，需要告诉webpack忽略它们。
    new webpack.WatchIgnorePlugin({
      paths: [/css\.d\.ts$/, /scss\.d\.ts$/],
    }),
    new WebpackBar({
      name: isDev ? 'runned' : 'packaged',
      color: '#fa8c16',
    }),
  ],
}
