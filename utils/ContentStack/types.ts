import { CustomComponentDoc } from '../tsdoc.utils';

export interface ContentPageGroup extends Object {
  uid: string;
  title: string;
  url: string;
  iconname: string;
  content_pages: Array<ContentPageMeta>;
}

/**
 * A content page with minimal metadata
 */
export interface ContentPageMeta {
  uid: string;
  title: string;
  url: string;
}

/**
 * A full content page including content
 */
export interface ContentPage extends ContentPageMeta {
  content: unknown;
}

/**
 * Minimal metadata about a component
 */
export interface ComponentPageMeta {
  uid: string;
  title: string;
  url: string;
  description: string;
}

/**
 * A {@link ComponentPageMeta} with additional data fields
 * including `figmaUrl` & `designguidelines` content
 */
export interface ComponentFields extends ComponentPageMeta {
  figmaUrl?: string;
  designguidelines?: unknown;
}

export interface BaseLayoutProps {
  componentName: string;
  componentKebabCaseName: string;
  changelog: string;
  readme: string;
  tsDoc: Array<CustomComponentDoc> | null;
}
