import {
	View,
	ButtonView,
	submitHandler,
	FocusCycler,
	SwitchButtonView,
	Template
} from '@ckeditor/ckeditor5-ui';
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils';
import { IconCancel } from '@ckeditor/ckeditor5-icons';

export default class FormView extends View {
	constructor( editor, templates ) {
		super( editor );
		const { locale } = editor;
		const { t } = locale;

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();

		this.replaceContentToggle = this._createCheckbox( {
			label: t( 'ReplaceAllContent' ),
			isOn: true
		} );

		this.cancelButtonView = this._createButton( {
			label: 'Cancel',
			icon: IconCancel,
			class: 'ck-button-cancel'
		} );

		// Delegate ButtonView#execute to FormView#cancel.
		this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );

		this.childViews = this.createCollection( [
			this.replaceContentToggle,
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

		const bind = Template.bind( this, this );

		this.setTemplate( {
			tag: 'form',
			attributes: {
				class: [ 'ck', 'content-templates-form' ],
				tabindex: '-1'
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: [ 'ck', 'ck-scratchBlocks-form__fields' ]
					},
					children: [ this.replaceContentToggle ]
				},
				{
					tag: 'p',
					children: [ t( 'SelectTemplate' ) ]
				},
				{
					tag: 'div',
					attributes: { class: 'options' },
					children: templates.map( item => {
						return {
							tag: 'button',
							attributes: {
								type: 'submit',
								class: 'option'
							},
							on: {
								click: [ bind.to( () => ( this.html = item.html ) ) ]
							},
							children: [
								{
									tag: 'img',
									attributes: {
										src: item.image,
										alt: item.title,
										class: 'image'
									}
								},
								{
									tag: 'div',
									children: [
										{
											tag: 'div',
											attributes: { class: 'title' },
											children: [ item.title ]
										},
										{
											tag: 'div',
											children: [ item.description ]
										}
									]
								}
							]
						};
					} )
				},
				{
					tag: 'div',
					attributes: {
						class: [ 'ck', 'ck-scratchBlocks-button-row' ]
					},
					children: [ this.cancelButtonView ]
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
		this.childViews.first.focus();
	}

	_createCheckbox( attributes ) {
		const checkbox = new SwitchButtonView( this.locale );

		checkbox.set( {
			withText: true,
			...attributes
		} );

		// listen to the checkbox and toggle the isOn property
		this.listenTo( checkbox, 'execute', () => {
			checkbox.isOn = !checkbox.isOn;
		} );

		return checkbox;
	}

	_createButton( attributes ) {
		const button = new ButtonView( this.locale );

		button.set( {
			...attributes
		} );

		return button;
	}
}
