const path = require('path')

module.exports = {
	mode: 'development',

	entry: {
		bundle: './source/js/index.js',
	},

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'assets/js'),
	},

	plugins: [],

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /.(js|jsx)$/,
				include: [path.resolve(__dirname, 'source/js')],
				loader: 'eslint-loader',
			},
			{
				test: /.(js|jsx)$/,
				include: [path.resolve(__dirname, 'source/js')],
				loader: 'babel-loader',

				options: {
					plugins: ['syntax-dynamic-import'],

					presets: [
						[
							'@babel/preset-env',
							{
								modules: false,
							},
						],
					],
				},
			},
		],
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/,
				},
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true,
		},
	},
}
