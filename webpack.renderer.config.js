const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge.smart(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: './src/renderer.tsx'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [path.resolve(__dirname, './src')],
                loader: 'awesome-typescript-loader',
                options: {
                    "useBabel": true,
                    "babelOptions": {
                        "plugins": [['import', {"libraryName": 'antd',"libraryDirectory": 'es', "style": 'css'}]]
                    },
                    "babelCore": "@babel/core"
                }
                
            },
            {
                test: /\.css$/,
                exclude: /node_modules\/antd/,
                loaders: ['style-loader', 'css-loader?modules']
            },
            {
                test: /\.css$/,
                include: /node_modules\/antd\//,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                loader: 'file-loader', 
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        })
    ]
})