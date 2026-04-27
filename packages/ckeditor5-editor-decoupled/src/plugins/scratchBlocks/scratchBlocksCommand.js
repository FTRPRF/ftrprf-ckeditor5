import { Command } from '@ckeditor/ckeditor5-core';
import { SCRATCH_ELEMENTS } from './scratchBlocksEditing.js';

export default class ScratchBlocksCommand extends Command {
	/**
     * @param {Object} evt an object containing the text and className of the scratch block
     */
	execute( evt ) {
		const model = this.editor.model;
		const selection = this.editor.model.document.selection;

		model.change( writer => {
			const scratchBlockContainer = writer.createElement(
				SCRATCH_ELEMENTS.SCRATCH_CONTAINER,
				{
					...evt,
					...Object.fromEntries( selection.getAttributes() )
				}
			);

			this.editor.model.insertContent( scratchBlockContainer );
		} );
	}

	/**
     * sets isEnabled to true if the scratch block can be inserted at the current position
     */
	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent(
			selection.getFirstPosition(),
			SCRATCH_ELEMENTS.SCRATCH_CONTAINER
		);

		this.isEnabled = allowedIn !== null;
	}
}
