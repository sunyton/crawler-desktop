const path = require('path')


module.exports = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    devtool: 'source-map',
    plugins: []
}