const path = require('path')
const { isDev } = require('./constants')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WebpackBar = require('webpackbar')
const webpack = require('webpack')
const px2rem = require('postcss-px2rem')

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
            px2rem({ remUnit: 37.5 }),
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
    publicPath: '/', // 解决url的层级变化导致加载js的404问题
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
          // @babel/plugin-transform-runtime解决webpack没有校验高级的es6语法
          plugins: ['@babel/plugin-transform-runtime', isDev && require.resolve('react-refresh/babel')].filter(Boolean),
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
          ...getCssLoaders(3),
          '@teamsupercell/typings-for-css-modules-loader',
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
