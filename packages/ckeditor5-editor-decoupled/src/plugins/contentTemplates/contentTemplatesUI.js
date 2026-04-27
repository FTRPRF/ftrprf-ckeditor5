import { Plugin } from '@ckeditor/ckeditor5-core';
import {
	ContextualBalloon,
	clickOutsideHandler,
	ButtonView,
} from '@ckeditor/ckeditor5-ui';
import ContentTemplates from './contentTemplates.js';
import FormView from './contentTemplatesView.js';
import { CONTENT_TEMPLATES_COMMANDS } from './contentTemplatesEditing.js';
import contenttemplates from './contenttemplates.svg';

export default class ContentTemplatesUI extends Plugin {
	static get requires() {
		return [ContextualBalloon];
	}

	init() {
		const editor = this.editor;
		const t = editor.t;

		this._balloon = this.editor.plugins.get(ContextualBalloon);
		this.formView = this._createFormView();

		editor.ui.componentFactory.add(ContentTemplates.pluginName, () => {
			const button = new ButtonView(this.locale);

			button.label = t('ContentTemplates');
			button.tooltip = true;
			button.withText = false;
			button.icon = contenttemplates;

			this.listenTo(button, 'execute', () => {
				this._showUI();
			});

			return button;
		});
	}

	_showUI() {
		this._balloon.add({
			view: this.formView,
			position: this._getBalloonPositionData(),
		});

		this.formView.focus();
	}

	_hideUI() {
		this.formView.element.reset();
		this._balloon.remove(this.formView);

		this.editor.editing.view.focus();
	}

	_createFormView() {
		const templates =
			this.editor.config.get('contentTemplatesConfig.templates') || [];
		const showExample = this.editor.config.get(
			'contentTemplatesConfig.showExample'
		);

		if (showExample) {
			templates.push(
				...[
					{
						title: 'Image and Title',
						image: 'template1.jpg',
						description:
							'One main image with a title and text that surround the image.',
						html:
							'<h3>' +
							// Use src=" " so image is not filtered out by the editor as incorrect (src is required).
							'<figure class="image ck-widget ck-widget_selected" contenteditable="false"><img' +
							' src="https://images.pexels.com/photos/16155346/pexels-' +
							'photo-16155346.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load">' +
							'<div class="ck ck-reset_all ck-widget__type-around"><div class="ck' +
							' ck-widget__type-around__button ck-widget__type-around__button_before" title="Insert paragraph before block"' +
							' aria-hidden="true">' +
							'<svg xmlns="http://www.w3.org/2000/svg"' +
							' viewBox="0 0 10 8"><path d="M9.055.263v3.972h-6.77M1 4.216l2-2.038m-2 2 2 2.038">' +
							'</path></svg></div>' +
							'<div class="ck ck-widget__type-around__button ck-widget__type-around__button_after"' +
							' title="Insert paragraph after block" aria-hidden="true">' +
							'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8">' +
							'<path d="M9.055.263v3.972h-6.77M1 4.216l2-2.038m-2 2 2 2.038"></path>' +
							'</svg></div><div class="ck ck-widget__type-around__fake-caret"></div></div></figure>' +
							'Type the title here' +
							'</h3>' +
							'<p>' +
							'Type the text here' +
							'</p>',
					},
					{
						title: 'Strange Template',
						image: 'template2.jpg',
						description:
							'A template that defines two columns, each one with a title, and some text.',
						html:
							'<table cellspacing="0" cellpadding="0" style="width:100%" border="0">' +
							'<tr>' +
							'<td style="width:50%">' +
							'<h3>Title 1</h3>' +
							'</td>' +
							'<td></td>' +
							'<td style="width:50%">' +
							'<h3>Title 2</h3>' +
							'</td>' +
							'</tr>' +
							'<tr>' +
							'<td>' +
							'Text 1' +
							'</td>' +
							'<td></td>' +
							'<td>' +
							'Text 2' +
							'</td>' +
							'</tr>' +
							'</table>' +
							'<p>' +
							'More text goes here.' +
							'</p>',
					},
					{
						title: 'Text and Table',
						image: 'template3.jpg',
						description: 'A title with some text and a table.',
						html:
							'<div style="width: 80%">' +
							'<h3>' +
							'Title goes here' +
							'</h3>' +
							'<table style="width:150px;float: right" cellspacing="0" cellpadding="0" border="1">' +
							'<caption style="border:solid 1px black">' +
							'<strong>Table title</strong>' +
							'</caption>' +
							'<tr>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
							'</tr>' +
							'</table>' +
							'<p>' +
							'Type the text here' +
							'</p>' +
							'</div>',
					},
				]
			);
		}

		const formView = new FormView(this.editor, templates);

		// After clicking one of the templates, insert it into the editor.
		this.listenTo(formView, 'submit', () => {
			this.editor.execute(
				CONTENT_TEMPLATES_COMMANDS.INSERT_CONTENT_TEMPLATE,
				{
					replaceAll: formView.replaceContentToggle.isOn,
					html: formView.html,
				}
			);

			// Hide the form view after submit.
			this._hideUI();
		});

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo(formView, 'cancel', () => {
			this._hideUI();
		});

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler({
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [this._balloon.view.element],
			callback: () => this._hideUI(),
		});

		return formView;
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
			target,
		};
	}
}
