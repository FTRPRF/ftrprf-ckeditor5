import {
	View,
	LabeledFieldView,
	createLabeledInputText,
	ButtonView,
	submitHandler,
	FocusCycler,
	createDropdown,
	ViewModel,
	addListToDropdown
} from '@ckeditor/ckeditor5-ui';
import {
	Collection,
	FocusTracker,
	KeystrokeHandler
} from '@ckeditor/ckeditor5-utils';
import { IconCheck, IconCancel } from '@ckeditor/ckeditor5-icons';
import { SCRATCH_BLOCK_TYPES } from './scratchBlocksUI.js';

export default class FormView extends View {
	constructor( locale ) {
		super( locale );

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();

		this.textInputView = this._createInput( 'Add text' );
		this.colorDropdown = this._createColorDropdown();

		this.saveButtonView = this._createButton(
			'Save',
			IconCheck,
			'ck-button-save'
		);

		// Submit type of the button will trigger the submit event on entire form when clicked
		// (see submitHandler() in render() below).
		this.saveButtonView.type = 'submit';

		this.cancelButtonView = this._createButton(
			'Cancel',
			IconCancel,
			'ck-button-cancel'
		);

		// Delegate ButtonView#execute to FormView#cancel.
		this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );

		this.childViews = this.createCollection( [
			this.colorDropdown,
			this.textInputView,
			this.saveButtonView,
			this.cancelButtonView
		] );

		this._focusCycler = new FocusCycler( {
			focusables: this.childViews,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate form fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',

				// Navigate form fields forwards using the Tab key.
				focusNext: 'tab'
			}
		} );

		this.setTemplate( {
			tag: 'form',
			attributes: {
				class: [ 'ck', 'ck-scratchBlocks-form' ],
				tabindex: '-1'
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: [ 'ck', 'ck-scratchBlocks-form__fields' ]
					},
					children: [ this.textInputView, this.colorDropdown ]
				},
				{
					tag: 'div',
					attributes: {
						class: [ 'ck', 'ck-scratchBlocks-button-row' ]
					},
					children: [ this.saveButtonView, this.cancelButtonView ]
				}
			]
		} );
	}

	render() {
		super.render();

		submitHandler( {
			view: this
		} );

		this.childViews._items.forEach( view => {
			// Register the view in the focus tracker.
			this.focusTracker.add( view.element );
		} );

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element );
	}

	destroy() {
		super.destroy();

		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	focus() {
		this.textInputView.focus();
	}

	_createInput( label ) {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledInputText
		);

		labeledInput.label = label;

		return labeledInput;
	}

	_createButton( label, icon, className ) {
		const button = new ButtonView();

		button.set( {
			label,
			icon,
			tooltip: true,
			class: className
		} );

		return button;
	}

	_createColorDropdown() {
		const dropdown = createDropdown( this.locale );
		const labelButton = {
			label: this.color,
			role: 'menuitemradio',
			withText: true
		};

		dropdown.buttonView.set( labelButton );

		const items = new Collection();
		SCRATCH_BLOCK_TYPES.map( option => {
			items.add( {
				type: 'button',
				model: new ViewModel( {
					...option,
					class: [ 'blockOption', option.color ].join( ' ' )
				} )
			} );
		} );

		addListToDropdown( dropdown, items );

		this.listenTo( dropdown, 'execute', evt => {
			const color = evt.source.color;
			this.color = color;
			dropdown.buttonView.class = [ 'blockOption', this.color ].join( ' ' );
			dropdown.buttonView.label = color;
		} );

		dropdown.render();
		return dropdown;
	}

	_setColor( color ) {
		this.color = color;
	}
}
