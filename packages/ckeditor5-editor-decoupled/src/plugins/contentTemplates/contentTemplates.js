import { Plugin } from '@ckeditor/ckeditor5-core';

import ContentTemplatesEditing from './contentTemplatesEditing.js';
import ContentTemplatesUI from './contentTemplatesUI.js';
import './contentTemplates.css';

/**
 * The content-templates plugin.
 */
export default class ContentTemplates extends Plugin {
	static get requires() {
		return [ ContentTemplatesEditing, ContentTemplatesUI ];
	}

	static get pluginName() {
		return 'contentTemplates';
	}
}
