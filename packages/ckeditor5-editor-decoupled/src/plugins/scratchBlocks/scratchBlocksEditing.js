import { Plugin } from '@ckeditor/ckeditor5-core';
import ScratchBlocksCommand from './scratchBlocksCommand.js';
import {
	Widget,
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget';
import { uniq } from 'lodash-es';
import { getTextFromChild, stringOrEmpty } from './utils.js';

export const SCRATCH_ELEMENTS = {
	SCRATCH_CONTAINER: 'scratchBlock',
	SCRATCH_TEXT: 'scratchText'
};

export const SCRATCH_COMMANDS = {
	ADD_SCRATCH_CONTAINER: 'addScratchBlock'
};

export default class ScratchBlocksEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add(
			SCRATCH_COMMANDS.ADD_SCRATCH_CONTAINER,
			new ScratchBlocksCommand( this.editor )
		);

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(
				this.editor.model,
				viewElement =>
					viewElement.hasClass( SCRATCH_ELEMENTS.SCRATCH_CONTAINER )
			)
		);
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( SCRATCH_ELEMENTS.SCRATCH_CONTAINER, {
			allowWhere: '$text',
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'color', 'text' ]
		} );
	}

	/**
	 * Defines the converters for the scratch block elements
	 */
	_defineConverters() {
		const conversion = this.editor.conversion;

		scratchBlockConverters( conversion );
	}
}

function scratchBlockConverters( conversion ) {
	// <scratchBlock> converters
	conversion.for( 'upcast' ).elementToElement( {
		view: {
			name: 'span',
			classes: SCRATCH_ELEMENTS.SCRATCH_CONTAINER
		},
		model: ( viewElement, { writer: modelWriter } ) => {
			return modelWriter.createElement(
				SCRATCH_ELEMENTS.SCRATCH_CONTAINER,
				{
					text:
						getTextFromChild( viewElement ) ||
						viewElement.getAttribute( 'text' ),
					color: viewElement.getAttribute( 'class' )
				}
			);
		}
	} );
	conversion.for( 'dataDowncast' ).elementToElement( {
		model: SCRATCH_ELEMENTS.SCRATCH_CONTAINER,
		view: ( modelElement, { writer: viewWriter } ) =>
			createScratchBlockView( modelElement, viewWriter )
	} );
	conversion.for( 'editingDowncast' ).elementToElement( {
		model: SCRATCH_ELEMENTS.SCRATCH_CONTAINER,
		view: ( modelElement, { writer: viewWriter } ) =>
			createScratchBlockView( modelElement, viewWriter )
	} );
}

function createScratchBlockView( modelElement, viewWriter ) {
	const scratchBlockContainer = viewWriter.createContainerElement( 'span', {
		class: uniq( [
			SCRATCH_ELEMENTS.SCRATCH_CONTAINER,
			...stringOrEmpty( modelElement.getAttribute( 'color' ) ).split( ' ' )
		] ) // filter out undefined or null values
			.filter( i => i )
			.join( ' ' )
	} );

	// create a text container to hold the text
	const textContainer = viewWriter.createContainerElement( 'span', {
		class: SCRATCH_ELEMENTS.SCRATCH_TEXT
	} );
	// insert the text into the text container
	viewWriter.insert(
		viewWriter.createPositionAt( textContainer, 0 ),
		viewWriter.createText(
			stringOrEmpty( modelElement.getAttribute( 'text' ) ).trim()
		)
	);

	// insert the text container into the scratch block container
	viewWriter.insert(
		viewWriter.createPositionAt( scratchBlockContainer, 0 ),
		textContainer
	);

	return toWidget( scratchBlockContainer, viewWriter );
}
