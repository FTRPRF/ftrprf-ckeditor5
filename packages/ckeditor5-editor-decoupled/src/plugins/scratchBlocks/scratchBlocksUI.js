import { Plugin } from '@ckeditor/ckeditor5-core';
import { ClickObserver } from '@ckeditor/ckeditor5-engine';
import {
	ContextualBalloon,
	ViewModel as Model,
	addListToDropdown,
	clickOutsideHandler,
	createDropdown
} from '@ckeditor/ckeditor5-ui';
import ScratchBlocks from './scratchBlocks.js';
import { Collection } from '@ckeditor/ckeditor5-utils';
import { SCRATCH_COMMANDS, SCRATCH_ELEMENTS } from './scratchBlocksEditing.js';
import { getRangeText, getTextFromChild } from './utils.js';
import FormView from './scratchBlocksView.js';
import scratchBlocksIcon from './scratchblocks.svg';

/**
 * This object contains the SCRATCH_BLOCK_TYPES for the dropdown.
 */
export const SCRATCH_BLOCK_TYPES = [
	{
		withText: true,
		label: 'Motion',
		color: 'motion'
	},
	{
		withText: true,
		label: 'Looks',
		color: 'looks'
	},
	{
		withText: true,
		label: 'Sound',
		color: 'sound'
	},
	{
		withText: true,
		label: 'Events',
		color: 'events'
	},
	{
		withText: true,
		label: 'Control',
		color: 'control'
	},
	{
		withText: true,
		label: 'Sensing',
		color: 'sensing'
	},
	{
		withText: true,
		label: 'Operators',
		color: 'operators'
	},
	{
		withText: true,
		label: 'Variables',
		color: 'variables'
	},
	{
		withText: true,
		label: 'My Blocks',
		color: 'myBlocks'
	}
];

/**
 * This plugin is responsible for adding the button to the toolbar.
 * It also listens for clicks on the button and executes the command.
 */
export default class ScratchBlocksUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	init() {
		const editor = this.editor;
		const view = editor.editing.view;
		const viewDocument = view.document;

		view.addObserver( ClickObserver );
		this._balloon = this.editor.plugins.get( ContextualBalloon );
		this.formView = this._createFormView();

		// add the dropdown to the toolbar
		editor.ui.componentFactory.add( ScratchBlocks.pluginName, locale => {
			const items = new Collection();
			SCRATCH_BLOCK_TYPES.map( option => {
				items.add( {
					type: 'button',
					model: new Model( {
						...option,
						class: [ 'blockOption', option.color ].join( ' ' )
					} )
				} );
			} );

			const dropdown = createDropdown( locale );
			dropdown.buttonView.set( {
				label: 'Scratch Blocks',
				withText: false,
				tooltip: true,
				icon: scratchBlocksIcon
			} );

			addListToDropdown( dropdown, items );
			dropdown.render();

			this.listenTo( dropdown, 'execute', evt => {
				const selection = this.editor.model.document.selection;
				const editor = this.editor;

				const selectedText = getRangeText( selection.getFirstRange() );

				editor.execute( SCRATCH_COMMANDS.ADD_SCRATCH_CONTAINER, {
					text: selectedText,
					color: evt.source.color
				} );
			} );

			return dropdown;
		} );

		// listen for clicks on the scratch block
		editor.listenTo( viewDocument, 'click', ( evt, data ) => {
			let modelElement = data.target;

			const modelElementClasses = modelElement.getAttribute( 'class' );
			if (
				modelElementClasses &&
				( modelElementClasses.includes(
					SCRATCH_ELEMENTS.SCRATCH_CONTAINER
				) ||
					modelElementClasses.includes( SCRATCH_ELEMENTS.SCRATCH_TEXT ) )
			) {
				if (
					modelElementClasses.includes( SCRATCH_ELEMENTS.SCRATCH_TEXT )
				) {
					modelElement = modelElement.parent;
				}
				const colors = SCRATCH_BLOCK_TYPES.map(
					option => option.color
				);
				const color = modelElement
					.getAttribute( 'class' )
					.split( ' ' )
					.filter( className => colors.includes( className ) )[ 0 ];

				const selectionText = getTextFromChild( modelElement );
				this._showUI( selectionText, color );
			}
		} );
	}

	_showUI( text, color ) {
		// Fill the form with the current text
		this.formView.textInputView.fieldView.value = text;
		this.formView.color = color;

		// set label and icon of button
		const dropdownButton = this.formView.colorDropdown.buttonView;
		dropdownButton.class = [ 'blockOption', color ].join( ' ' );
		dropdownButton.label = color;

		this._balloon.add( {
			view: this.formView,
			position: this._getBalloonPositionData()
		} );

		this.formView.focus();
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView( editor.locale );

		// Execute the command after clicking the "Save" button.
		this.listenTo( formView, 'submit', () => {
			editor.execute(
				SCRATCH_COMMANDS.ADD_SCRATCH_CONTAINER,
				// Grab values from the scratchBlock and text and color fields.
				{
					text: formView.textInputView.fieldView.element.value,
					color: formView.color
				}
			);

			// Hide the form view after submit.
			this._hideUI();
		} );

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo( formView, 'cancel', () => {
			this._hideUI();
		} );

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler( {
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );

		return formView;
	}

	_hideUI() {
		this.formView.textInputView.fieldView.value = '';
		this.formView.element.reset();
		this._balloon.remove( this.formView );

		// Focus the editing view after inserting the abbreviation so the user can start typing the content
		// right away and keep the editor focused.
		this.editor.editing.view.focus();
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

		// Set a target position by converting view selection range to DOM
		target = () =>
			view.domConverter.viewRangeToDom(
				viewDocument.selection.getFirstRange()
			);

		return {
			target
		};
	}
}
