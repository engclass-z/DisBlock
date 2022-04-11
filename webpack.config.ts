import { Configuration } from 'webpack';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config: Configuration = {
  entry: {
    app: path.join(__dirname, 'src', 'app', 'index.ts'),
    popup: path.join(__dirname, 'src', 'components', 'index.tsx'),
  },
  output: {
    path: path.join(__dirname, './dist/js'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: (chunk: any) => {
        return chunk.name !== 'background';
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '../', context: 'public' }],
      options: {},
    }),
    new MiniCssExtractPlugin({
      filename: '../css/app.css',
    }),
  ],
};

export default config;
