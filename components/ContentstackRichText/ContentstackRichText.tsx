import { HTMLElementProps } from '@leafygreen-ui/lib';

import { nodeTypeToElementMap } from './componentMap';
import ContentstackText from './ContentstackText';
import { CSNode } from './types';
import { getCSNodeTextContent, isTextNode, nodeHasAssets } from './utils';

interface CSRichTextProps extends HTMLElementProps<'div'> {
  content?: CSNode;
  [key: string]: any;
}

/**
 * Renders a ContentStack Node
 */
const ContentstackRichText = ({
  content,
  ...rest
}: CSRichTextProps): JSX.Element => {
  if (!content) return <>Content not found</>;

  if (isTextNode(content)) {
    return <ContentstackText node={content} {...rest} />;
  } else {
    const textContent = getCSNodeTextContent(content);

    if (textContent || nodeHasAssets(content)) {
      return nodeTypeToElementMap[content.type]?.(content, rest);
    } else {
      return <></>;
    }
  }
};

export default ContentstackRichText;
