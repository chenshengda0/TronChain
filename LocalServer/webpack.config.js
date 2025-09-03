const path = require( "path" )
const webpack = require( "webpack" )
const TerserPlugin = require('terser-webpack-plugin');
require( "dotenv" ).config()

module.exports = {
    stats: {
        // Configure the console output
        errorDetails: false, //this does show errors
        colors: false,
        modules: true,
        reasons: true
    },
    target: "node",
    //模式
    mode: "production",
    //devtool: false,
    //入口
    entry: {
        index: "./src/index.ts"
    },
    //目标
    output: {
        path: path.resolve( "./build" ),
        filename: "[name].js",
        environment: {
            arrowFunction: false
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node-modules/gi,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    /*
                                    {
                                        "targets":{
                                            "chrome": "58",
                                            "ie": "8"
                                        },
                                        "corejs":"3",
                                        "useBuiltIns": "usage"
                                    }
                                    */
                                ]
                            ]
                        }
                    },{
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            T: ["dreamer-common-def", "T"],
            getRandom: ["dreamer-common-def", "getRandom"],
            getAxis: ["dreamer-common-def", "getAxis"],
            matrix2D: ["dreamer-common-def", "matrix2D"],
            matrix3D: ["dreamer-common-def", "matrix3D"],
            matrixCss: ["dreamer-common-def", "matrixCss"],
            determinant: ["dreamer-common-def", "determinant"],
            adjoint: ["dreamer-common-def", "adjoint"],
            perspectiveNO: ["dreamer-common-def", "perspectiveNO"],
            runtimeDecorator: ["dreamer-common-def", "runtimeDecorator"],
        }),
        new webpack.DefinePlugin({
            // MongoDB
            'process.env.MONGO_URL':                  JSON.stringify(process.env.MONGO_URL),

        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.ts'],
        alias: {
            Pages: path.resolve( __dirname, "src/Pages" ),
        }
    },
    //Error: Received packet in the wrong sequence.
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
}