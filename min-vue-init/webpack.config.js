const path = require('path')
module.exports = {
    mode: "development",
    
    entry:{
        'reactive.webpack':"./src/reactive/reactive.js",
        complier:"./src/complier/index.js"
    },
    module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' }],
    },
    output:{
        path: path.resolve(__dirname,"./build"),
        filename:"[name].js"
    }
}