const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: "production",
	entry: './index.js',
	output: {
		publicPath: '/',
		filename: 'bundle.js',
	},
	devServer: {
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
           },
         ],
	},
	plugins: [
         new HtmlWebPackPlugin({
			template: './index.html',
		}),
       ],
};
