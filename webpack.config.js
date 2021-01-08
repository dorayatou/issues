const path = require('path');

module.exports = {
    mode: 'development',
    entry: './packages/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.(scss|css)$/i,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: true,
                            modules: {
                                // auto: (resourcePath) => resourcePath.endsWith('.custom-module.css'),
                                auto: /\.comp-module\.\w+$/i,
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                mode: (resourcePath) => {
                                    if (/pure.css$/i.test(resourcePath)) {
                                      return 'pure';
                                    }
                      
                                    if (/global.css$/i.test(resourcePath)) {
                                      return 'global';
                                    }
                      
                                    return 'local';
                                },
                                localIdentContext: path.resolve(__dirname, 'static'),
                                localIdentHashPrefix: 'hash',
                                namedExport: true,
                                exportLocalsConvention: 'asIs'
                            },
                            url: (url, resourcePath) => {
                                console.log('url', url, 'resourcePath', resourcePath);
                                return false;
                            },
                            import: false
                            // mode: 'local',
                            // localsConvention: 'camelCase',
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: "./",
        hot: true
    }
};