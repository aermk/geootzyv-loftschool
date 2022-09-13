const path = require('path'); // path - пакет ноды для работы с путями

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './sourse/js/index.js', // точка входа, так же может быть объект с точками входа
    mode: process.env.NODE_ENV || 'development', // можем из консоли попасть в исходник, в продакшене не можем
    output: { // то, что нам выдаст вебпак
        path: path.resolve(__dirname, 'dist'), // путь (папка дист)
        filename: 'bundle.js', // название файла
    },
    module: {
        rules: [
            // когда вебпак видит что у нас есть файл с расширением hbs,
            // он запускает лоадер
            { test: /\.hbs$/, loader: "handlebars-loader" },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],

    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './sourse/index.hbs'
        }),
        new MiniCssExtractPlugin({
            filename: "main.css",
        }),
    ]
};