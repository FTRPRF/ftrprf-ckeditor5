import ScratchBlocksEditing from './scratchBlocksEditing.js';
import ScratchBlocksUI from './scratchBlocksUI.js';
import './scratchBlocks.css';
import { Plugin } from '@ckeditor/ckeditor5-core';

/**
 * The scratch-blocks plugin.
 */
export default class ScratchBlocks extends Plugin {
	static get requires() {
		return [ ScratchBlocksEditing, ScratchBlocksUI ];
	}

	static get pluginName() {
		return 'ScratchBlocks';
	}
}
