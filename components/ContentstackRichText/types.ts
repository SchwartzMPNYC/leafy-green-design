import { EntryEmbedable, Node, TextNode } from '@contentstack/utils';

import BadgeProps from '@leafygreen-ui/badge/dist/Badge/types';
import { ButtonProps } from '@leafygreen-ui/button';
import { CalloutProps } from '@leafygreen-ui/callout/dist/Callout/types';

type AnyNode = CSNode | CSTextNode;

/** Contentstack is missing props in their type definitions */
export interface CSNode extends Node {
  uid: string;
  children: Array<AnyNode>;
}

export interface CSTextNode extends TextNode, CSNode {
  children: Array<AnyNode>;
}

export interface CSEntry extends EntryEmbedable {}

// TODO: consider extending `@contentstack/utils.NodeType`
/**
 * Map of all Contentstack block types. Blocks contain inline or block nodes.
 */
export enum BLOCKS {
  DOCUMENT = 'doc',
  FRAGMENT = 'fragment',
  PARAGRAPH = 'p',
  ANCHOR = 'a',
  REFERENCE = 'reference',
  HEADING_1 = 'h1',
  HEADING_2 = 'h2',
  HEADING_3 = 'h3',
  HEADING_4 = 'h4',
  HEADING_5 = 'h5',
  HEADING_6 = 'h6',
  ORDERED_LIST = 'ol',
  UNORDERED_LIST = 'ul',
  LIST_ITEM = 'li',
  ENTRY = 'entry',
  SPAN = 'span',
  HR = 'hr',
  QUOTE = 'blockquote',
  EMBEDDED_ENTRY = 'embedded-entry-block',
  EMBEDDED_ASSET = 'embedded-asset-block',
  TABLE = 'table',
  TABLE_HEAD = 'thead',
  TABLE_BODY = 'tbody',
  TABLE_ROW = 'tr',
  TABLE_CELL = 'td',
  TABLE_HEADER_CELL = 'th',
}

/**
 * Define custom Contentstack block interfaces
 */

/** https://app.contentstack.com/#!/stack/bltee845ee8bbd3fe1a/content-type/annotated_image_block/content-type-builder?branch=main */
export interface AnnotatedImageBlockProps {
  title: string;
  image: any; // TODO: Image interface
  steps: Array<AnnotatedImageBlockStep>;
}
interface AnnotatedImageBlockStep {
  title: string;
  description?: string;
}

/** https://app.contentstack.com/#/stack/bltee845ee8bbd3fe1a/content-type/badge_block/content-type-builder?branch=main */
export interface BadgeBlockProps {
  title: string;
  variant?: BadgeProps['variant'];
}

/** */
export interface BasicUsageBlockProps {
  title: string;
  dos?: CSNode;
  donts?: CSNode;
}

/** */
export interface ButtonBlockProps {
  button_block: string;
  url: string;
  content?: string;
  variant?: ButtonProps['variant'];
  link?: string;
}

/** */
export interface CalloutBock {
  url: string;
  title?: string;
  content?: CSNode;
  variant?: CalloutProps['variant'];
}

/** */
export interface CardBlockProps {
  url: string;
  title?: string;
  content?: CSNode;
}

/** */
export interface ExampleCardBlockProps {
  title: string;
  header_text: string;
  subtext?: string;
  variant: 'info' | 'caution' | 'do' | 'dont';
  image: any; // TODO: image
}

/** */
export interface ExpandableCardBlockProps {
  url: string;
  title: string;
  description?: string;
  content?: CSNode;
}

/** https://app.contentstack.com/#!/stack/bltee845ee8bbd3fe1a/content-type/horizontal_layout/content-type-builder?branch=main */
export interface HorizontalLayoutBlockProps {
  url: string;
  title: string;
  column_1: CSNode; // richText
  column_2: CSNode; // richText,
  vertical_align:
    | 'top'
    | 'center'
    | 'bottom'
    | 'space-evenly'
    | 'space-around'
    | 'space-between';
}

export interface ContentTypePropMap {
  'annotated_image_block': AnnotatedImageBlockProps,
  'badge_block': BadgeBlockProps,
  'basic_usage_block': BasicUsageBlockProps,
  'button_block': ButtonBlockProps,
  'callout_block': CalloutBock,
  'card_block': CardBlockProps,
  'example_card_block': ExampleCardBlockProps,
  'expandable_card_block': ExpandableCardBlockProps,
  'horizontal_layout': HorizontalLayoutBlockProps,
}

export type ContentTypeUID = keyof ContentTypePropMap
