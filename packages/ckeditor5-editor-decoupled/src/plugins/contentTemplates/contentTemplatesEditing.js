import { Plugin } from '@ckeditor/ckeditor5-core';
import ContentTemplatesCommand from './contentTemplatesCommand.js';

export const CONTENT_TEMPLATES_COMMANDS = {
	INSERT_CONTENT_TEMPLATE: 'insertContentTemplate'
};

export default class ContentTemplatesEditing extends Plugin {
	init() {
		this.editor.commands.add(
			CONTENT_TEMPLATES_COMMANDS.INSERT_CONTENT_TEMPLATE,
			new ContentTemplatesCommand( this.editor )
		);
	}
}
