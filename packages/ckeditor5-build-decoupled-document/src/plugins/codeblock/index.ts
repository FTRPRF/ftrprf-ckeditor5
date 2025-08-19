import icon from './icon.svg';
import {Plugin} from "@ckeditor/ckeditor5-core";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export class CodeBlock extends Plugin {
	public init(): void {
		const editor = this.editor;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if ( editor.config._config.codeBlock && editor.config._config.codeBlock.onOpen ) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const open = editor.config._config.codeBlock?.onOpen;
			// The button must be registered among the UI components of the editor
			// to be displayed in the toolbar.
			editor.ui.componentFactory.add( 'codeBlock', () => {
				// The button will be an instance of ButtonView.
				const button = new ButtonView();

				button.set( {
					label: 'Insert code block',
					withText: false,
					tooltip: true,
					icon
				} );

				button.on( 'execute', () => {
					open();
				} );

				return button;
			} );
		}
	}
}

export const icons = {
	icon
};
