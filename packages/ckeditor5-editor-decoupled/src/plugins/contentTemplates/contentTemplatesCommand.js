import { Command } from '@ckeditor/ckeditor5-core';
import { SelectAll } from '@ckeditor/ckeditor5-select-all';

/**
 * The content-templates plugin.
 */
export default class ContentTemplatesCommand extends Command {
	static get requires() {
		return [ SelectAll ];
	}

	execute( { html, replaceAll } ) {
		this.editor.model.change( () => {
			if ( replaceAll ) {
				removeAll( this.editor );
			}

			const viewFragment = this.editor.data.processor.toView( html );
			const modelFragment = this.editor.data.toModel( viewFragment );
			this.editor.model.insertContent( modelFragment );
		} );
	}
}

function removeAll( editor ) {
	const editorModel = editor.model;
	const editorDocument = editorModel.document;
	editor.execute( 'selectAll' );
	const root = editorDocument.getRoot();
	const children = root.getChildren();

	for ( const child of children ) {
		editorModel.change( writer => {
			writer.remove( child );
		} );
	}
}
