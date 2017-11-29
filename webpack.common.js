const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

// This contains shared configuration for dev and prod builds
module.exports = {
	entry: {
		// All App source files will be compiled into main
		main: './src/index.jsx',

		// All vendor files will be compiled into vendor.
		// You should add new packages you install here. 
		vendor: [
			'babel-polyfill',
			'react',
			'react-dom',
			'react-router-dom',
			'semantic-ui-react',
		]
	},
	module: {
		rules: [
			// Transpile all .js and .jsx files
			{
				test: /\.(js|jsx)?$/,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'react', 
								'env', 
							],
							plugins: [
								'transform-class-properties', 
								'transform-decorators-legacy', 
								'syntax-dynamic-import', 
							],
						}
					},
				],
			},

			// Compile SCSS files
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{ loader: 'css-loader', options: { minimize: true, sourceMap: true } },
						{ loader: 'sass-loader', options: { sourceMap: true } },
					]
				}),
			},

			// Copy static assets over with file-loader
			{
				test: /\.(ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: 'file-loader', options: {name: '[name].[ext]'},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: 'file-loader', options: {name: 'fonts/[name].[ext]'},
			},
			{
				test: /\.(jpg|gif|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: 'file-loader', options: {name: 'images/[name].[ext]'},
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	plugins: [
		new webpack.HashedModuleIdsPlugin(),
		
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),

		// This pulls out webpack boilerplate code that changes every build to help with caching
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons'
		}),

		// Extract inline styles into a separate css file
		new ExtractTextPlugin('css/[name].[chunkhash].css'),
		
		new HTMLWebpackPlugin({
			filename: 'index.html',
			template: 'src/assets/index.html',
		}),
	],
	output: {
		path: __dirname + '/dist',
		filename: 'js/[name].[chunkhash].js',
		chunkFilename: 'js/[name].[chunkhash].js',
		publicPath: '/',
	},
};
