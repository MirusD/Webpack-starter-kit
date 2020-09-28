const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const pages =
  fs
    .readdirSync(path.resolve(__dirname, 'src/pages/'))
    .filter(file => file !== 'base' && file !== 'index')
    .map(file => file.split('/',2))

const filename = (namefile, ext) => isProd ? `${namefile}.${ext}` : `${namefile}.[hash].${ext}`    

console.log('PAGES: ', pages);
console.log('IS DEV: ', isDev);

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        app: './index.js'
    },
    output: {
        filename: `./assets/js/${filename('[name]','js')}`,
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        modules: ['node_modules'],
        alias: {
            '@': path.resolve(__dirname,'src'),
            'component': '@/components',
            'page': '@/pages',
            'assets': '@/assets'
        }
    },
    devServer: {
        hot: isDev,
        port: 9000,
    },
    devtool: isDev ? 'source-map' : false,
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            pretty: isDev
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: filename('[name]','[ext]'),
                    outputPath: './assets/img/',
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: filename('[name]','[ext]'),
                            outputPath: './assets/fonts/',
                        }
                    }
                ],
            },
        ]    
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `./assets/styles/${filename('[name]', 'css')}`,
        }),
        new HtmlWebpackPlugin({
            template: './pages/index/index.pug',
            // filename: filename('index', 'html'),
            minify: isProd
        }),
        ...pages.map(page => new HtmlWebpackPlugin({
            template: `./pages/${page}/${page}.pug`,
            filename: filename(page, 'html'),
            minify: isProd
          })),
        new CleanWebpackPlugin(),  
    ],
};