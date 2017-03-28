var webpack = require('webpack');
var path = require('path');

var util = require('./config/util')
var vendors = [].concat(
    util.getVendors(),
    util.getDevLib()
)

module.exports = {
    output: {
        path: 'src',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: path.resolve(__dirname),
        }),
    ],
};
