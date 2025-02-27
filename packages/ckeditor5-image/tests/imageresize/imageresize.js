/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import ImageResize from '../../src/imageresize.js';
import ImageResizeButtons from '../../src/imageresize/imageresizebuttons.js';
import ImageResizeEditing from '../../src/imageresize/imageresizeediting.js';
import ImageResizeHandles from '../../src/imageresize/imageresizehandles.js';

describe( 'ImageResize', () => {
	it( 'should require "ImageResizeEditing", "ImageResizeHandles", and "ImageResizeButtons"', () => {
		expect( ImageResize.requires ).to.deep.equal( [ ImageResizeEditing, ImageResizeHandles, ImageResizeButtons ] );
	} );

	it( 'should be named', () => {
		expect( ImageResize.pluginName ).to.equal( 'ImageResize' );
	} );
} );
