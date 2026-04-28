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

// FTRPRF: single line below — keep extra exports inside ./plugins/index.ts so the
// patch on this upstream-tracked file stays minimal across syncs.
export * from './plugins/index.js';
