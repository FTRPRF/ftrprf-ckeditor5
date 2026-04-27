#!/usr/bin/env node

/**
 * Build a browser-loadable UMD bundle of the decoupled editor.
 * Output: dist/browser/ckeditor.js, exposing the global `DecoupledEditor`
 * (compatible with the legacy ckeditor5-build-decoupled-document layout).
 */

import { build } from '@ckeditor/ckeditor5-dev-build-tools';

await build( {
	input: 'src/index.ts',
	output: 'dist/browser/ckeditor.js',
	tsconfig: 'tsconfig.build.json',
	external: [],
	browser: true,
	name: 'DecoupledEditor',
	sourceMap: true,
	minify: true,
	clean: true
} );
