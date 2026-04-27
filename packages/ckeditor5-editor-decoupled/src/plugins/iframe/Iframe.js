/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import IframeEditing from './IframeEditing.js';
import IframeUI from './IframeUI.js';

export default class Iframe extends Plugin {
	static get requires() {
		return [ IframeEditing, IframeUI ];
	}

	static get pluginName() {
		return 'iframe';
	}
}
