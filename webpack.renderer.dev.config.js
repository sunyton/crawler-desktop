const baseConfig =require('./webpack.renderer.config')
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge.smart(baseConfig, {
    devServer: {
        port: 8081,
        contentBase: path.resolve(__dirname, 'build')
    }
})