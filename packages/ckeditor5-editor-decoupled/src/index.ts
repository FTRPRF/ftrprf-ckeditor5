/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module editor-decoupled
 */

export { DecoupledEditor } from './decouplededitor.js';
export { DecoupledEditorUI } from './decouplededitorui.js';
export { DecoupledEditorUIView } from './decouplededitoruiview.js';

// FTRPRF custom plugins.
export { Exercise } from './plugins/exercise/index.js';
export { FullScreen } from './plugins/fullScreen/index.js';
export { HtmlInsert } from './plugins/htmlInsert/index.js';
export { OwnImagePlugin } from './plugins/image/index.js';
export { Modal } from './plugins/modal/index.js';
export { RemoveBlockStyle } from './plugins/removeBlockStyle/index.js';
export { Source } from './plugins/source/index.js';
export { StyledLink } from './plugins/styledLink/index.js';

// FTRPRF private plugins (vendored from @ftrprf/* repos).
export { Iframe } from './plugins/iframe/index.js';
export { contentTemplates as ContentTemplates } from './plugins/contentTemplates/index.js';
export { ScratchBlocks } from './plugins/scratchBlocks/index.js';
