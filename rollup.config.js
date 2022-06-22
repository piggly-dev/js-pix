import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
const extensions = ['.js', '.ts'];
module.exports = [
	{
		input: 'src/pix.ts',
		output: [
			{
				file: pkg.main,
				format: 'cjs',
			},
			{
				file: pkg.module,
				format: 'es',
			},
		],
		plugins: [
			resolve({ extensions }),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
			}),
		],
		external: ['qrcode'],
	},
	{
		input: 'src/pix.ts',
		output: [
			{
				file: pkg.browser,
				name: 'pix',
				format: 'umd',
				sourcemap: !production,
				globals: {
					qrcode: 'QRCode',
				},
			},
			{
				file: pkg.unpkg,
				name: 'pix',
				format: 'umd',
				sourcemap: !production,
				globals: {
					qrcode: 'QRCode',
				},
				plugins: [terser()],
			},
		],
		plugins: [
			resolve({ extensions }),
			commonjs(),
			babel({
				extensions,
				babelHelpers: 'bundled',
				include: ['src/**/*'],
				presets: [
					'@babel/preset-typescript',
					[
						'@babel/preset-env',
						{
							targets: '> 0.25%, last 2 versions, not dead',
						},
					],
				],
				plugins: [
					[
						'babel-plugin-module-resolver',
						{
							root: ['./src'],
							alias: {
								'@': './src',
							},
						},
					],
				],
			}),
		],
		external: ['qrcode'],
	},
];
