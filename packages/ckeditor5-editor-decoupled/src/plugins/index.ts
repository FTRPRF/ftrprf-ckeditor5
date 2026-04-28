/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

// FTRPRF plugin barrel: single import point for everything in `src/plugins/`.
// Consumed by `src/index.ts` and `src/ckeditor.ts` so the patch on
// upstream-tracked files (index.ts in particular) stays one line during sync.
/* eslint-disable ckeditor5-rules/validate-module-tag */

import { Exercise } from './exercise/index.js';
import { FullScreen } from './fullScreen/index.js';
import { HtmlInsert } from './htmlInsert/index.js';
import { OwnImagePlugin } from './image/index.js';
import { Modal } from './modal/index.js';
import { RemoveBlockStyle } from './removeBlockStyle/index.js';
import { Source } from './source/index.js';
import { StyledLink } from './styledLink/index.js';
import { Iframe } from './iframe/index.js';
import { contentTemplates as ContentTemplates } from './contentTemplates/index.js';
import { ScratchBlocks } from './scratchBlocks/index.js';

export {
	Exercise,
	FullScreen,
	HtmlInsert,
	OwnImagePlugin,
	Modal,
	RemoveBlockStyle,
	Source,
	StyledLink,
	Iframe,
	ContentTemplates,
	ScratchBlocks
};

export const ftrprfPlugins = [
	ContentTemplates,
	Exercise,
	FullScreen,
	HtmlInsert,
	Iframe,
	Modal,
	OwnImagePlugin,
	RemoveBlockStyle,
	ScratchBlocks,
	Source,
	StyledLink
];
