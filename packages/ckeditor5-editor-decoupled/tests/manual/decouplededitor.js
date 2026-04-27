/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { DecoupledEditor } from '../../src/decouplededitor.js';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { FontSize, FontFamily, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font';
import { CKFinderUploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import {
	Bold,
	Italic,
	Strikethrough,
	Underline,
	Superscript,
	Subscript
} from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
import { Style } from '@ckeditor/ckeditor5-style';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
	Image,
	ImageInsert,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	PictureEditing,
	AutoImage
} from '@ckeditor/ckeditor5-image';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List, ListProperties } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import {
	Table,
	TableToolbar,
	TableProperties,
	TableCellProperties
} from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';

// FTRPRF custom plugins (copied from master, ported to modern import paths).
import { Exercise } from '../../src/plugins/exercise/index.js';
import { FullScreen } from '../../src/plugins/fullScreen/index.js';
import { HtmlInsert } from '../../src/plugins/htmlInsert/index.js';
import { OwnImagePlugin } from '../../src/plugins/image/index.js';
import { Modal } from '../../src/plugins/modal/index.js';
import { RemoveBlockStyle } from '../../src/plugins/removeBlockStyle/index.js';
import { Source } from '../../src/plugins/source/index.js';
import { StyledLink } from '../../src/plugins/styledLink/index.js';

// FTRPRF private plugins (vendored from @ftrprf/* repos, ported to modern imports).
import { Iframe } from '../../src/plugins/iframe/index.js';
import { contentTemplates as ContentTemplates } from '../../src/plugins/contentTemplates/index.js';
import { ScratchBlocks } from '../../src/plugins/scratchBlocks/index.js';

import { createObserver } from '@ckeditor/ckeditor5-utils/tests/_utils/utils.js';

const editorData =
	'<h2>Hello world</h2>' +
	'<p>This is the decoupled editor.</p>' +
	'<figure class="media"><oembed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></oembed></figure>';

let editor, editable, observer;

function initEditor() {
	DecoupledEditor
		.create( {
			root: {
				initialData: editorData,
				modelAttributes: {
					section: 'intro'
				}
			},
			plugins: [
				Alignment,
				FontSize,
				FontFamily,
				FontColor,
				FontBackgroundColor,
				CKFinderUploadAdapter,
				Autoformat,
				AutoImage,
				BlockQuote,
				Bold,
				CKFinder,
				CKBox,
				CloudServices,
				CodeBlock,
				ContentTemplates,
				EasyImage,
				Essentials,
				Exercise,
				FindAndReplace,
				FullScreen,
				GeneralHtmlSupport,
				Heading,
				HtmlInsert,
				Iframe,
				Image,
				ImageCaption,
				ImageInsert,
				ImageResize,
				ImageStyle,
				ImageToolbar,
				ImageUpload,
				Indent,
				IndentBlock,
				Italic,
				Link,
				List,
				ListProperties,
				MediaEmbed,
				Modal,
				OwnImagePlugin,
				Paragraph,
				PasteFromOffice,
				PictureEditing,
				RemoveBlockStyle,
				RemoveFormat,
				ScratchBlocks,
				Source,
				SourceEditing,
				Strikethrough,
				Style,
				StyledLink,
				Subscript,
				Superscript,
				Table,
				TableCellProperties,
				TableProperties,
				TableToolbar,
				TextTransformation,
				Underline
			],
			toolbar: {
				items: [
					'heading',
					'|',
					'fontfamily',
					'fontsize',
					'fontColor',
					'fontBackgroundColor',
					'|',
					'bold',
					'italic',
					'underline',
					'strikethrough',
					'subscript',
					'superscript',
					'|',
					'alignment',
					'|',
					'numberedList',
					'bulletedList',
					'|',
					'outdent',
					'indent',
					'|',
					'link',
					'ownImagePlugin',
					'insertTable',
					'insertImage',
					'mediaEmbed',
					'codeBlock',
					'|',
					'undo',
					'redo',
					'|',
					'removeFormat',
					'|',
					'style',
					'removeBlockStyle',
					'|',
					'iframe',
					'scratchBlocks',
					'contentTemplates',
					'exercise',
					'modal',
					'styledLink',
					'fullScreen',
					'source',
					'htmlInsert',
					'|',
					'sourceEditing',
					'findAndReplace'
				]
			},
			iframe: { toolbar: [ 'iframe' ] },
			exercise: { onOpen: () => console.log( 'exercise.onOpen' ) },
			fullScreen: { onOpen: () => console.log( 'fullScreen.onOpen' ) },
			htmlInsert: { onOpen: () => console.log( 'htmlInsert.onOpen' ) },
			modal: { onOpen: () => console.log( 'modal.onOpen' ) },
			ownImage: { onOpen: () => console.log( 'ownImage.onOpen' ) },
			removeBlockStyle: {
				onOpen: () => console.log( 'removeBlockStyle.onOpen' ),
				onClose: () => console.log( 'removeBlockStyle.onClose' )
			},
			source: { onOpen: () => console.log( 'source.onOpen' ) },
			styledLink: { onOpen: () => console.log( 'styledLink.onOpen' ) },
			image: {
				resizeUnit: 'px',
				resizeOptions: [
					{ name: 'resizeImage:original', value: null, label: 'Original' },
					{ name: 'resizeImage:10', value: '126', label: '10%' },
					{ name: 'resizeImage:20', value: '253', label: '20%' },
					{ name: 'resizeImage:30', value: '380', label: '30%' },
					{ name: 'resizeImage:40', value: '506', label: '40%' },
					{ name: 'resizeImage:50', value: '633', label: '50%' },
					{ name: 'resizeImage:60', value: '760', label: '60%' },
					{ name: 'resizeImage:70', value: '886', label: '70%' },
					{ name: 'resizeImage:80', value: '1013', label: '80%' },
					{ name: 'resizeImage:90', value: '1139', label: '90%' },
					{ name: 'resizeImage:100', value: '1266', label: '100%' }
				],
				toolbar: [
					'imageStyle:inline',
					'imageStyle:wrapText',
					'imageStyle:breakText',
					'|',
					'toggleImageCaption',
					'imageTextAlternative',
					'imageResize'
				],
				insert: {
					integrations: [ 'url' ]
				}
			},
			table: {
				contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
			},
			list: {
				properties: {
					styles: true,
					startIndex: true,
					reversed: true
				}
			},
			codeBlock: {
				languages: [
					{ language: 'html', label: 'HTML' },
					{ language: 'css', label: 'CSS' },
					{ language: 'javascript', label: 'JavaScript' },
					{ language: 'python', label: 'Python' },
					{ language: 'json', label: 'JSON' },
					{ language: 'markdown', label: 'Markdown' },
					{ language: 'blocks', label: 'Scratch' }
				]
			},
			language: 'en'
		} )
		.then( newEditor => {
			console.log( 'Editor was initialized', newEditor );
			console.log( 'You can now play with it using global `editor` and `editable` variables.' );

			document.querySelector( '.menubar-container' ).appendChild( newEditor.ui.view.menuBarView.element );
			document.querySelector( '.toolbar-container' ).appendChild( newEditor.ui.view.toolbar.element );
			document.querySelector( '.editable-container' ).appendChild( newEditor.ui.view.editable.element );

			window.editor = editor = newEditor;
			window.editable = editable = editor.editing.view.document.getRoot();

			observer = createObserver();
			observer.observe( 'Editable', editable, [ 'isFocused' ] );
		} )
		.catch( err => {
			console.error( err.stack );
		} );
}

function destroyEditor() {
	editor.destroy()
		.then( () => {
			window.editor = editor = null;
			window.editable = editable = null;

			observer.stopListening();
			observer = null;

			console.log( 'Editor was destroyed' );
		} );
}

document.getElementById( 'initEditor' ).addEventListener( 'click', initEditor );
document.getElementById( 'destroyEditor' ).addEventListener( 'click', destroyEditor );
