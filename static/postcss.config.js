const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
	plugins: [
		postcssPresetEnv({
			autoprefixer: { grid: 'no-autoplace' },
		}),
	],
}
