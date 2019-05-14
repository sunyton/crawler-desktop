const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const path = require('path')

module.exports = merge(baseConfig, {
    mode: process.env.NODE_ENV,
    target: 'electron-main',
    entry: {
        main: './src/main.ts'

    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    path.resolve(__dirname, 'src', 'main.ts'),
                    path.resolve(__dirname, 'src/controllers')
                ],
                loader: 'awesome-typescript-loader'
            }
        ]
    }
})