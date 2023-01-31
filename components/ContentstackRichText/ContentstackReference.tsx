import ContentstackEntry from './ContentstackEntry';
import ContentstackImage from './ContentstackImage';
import { CSNode } from './types';

const ContentstackReference = ({
  content,
  ...props
}: {
  content: CSNode;
  [key: string]: any;
}) => {
  const {
    type,
    'content-type-uid': contentTypeUid,
    'entry-uid': entryUid,
  } = content.attrs;

  console.log(props);

  if (type === 'asset') {
    return <ContentstackImage content={content} {...props} />;
  } else if (type === 'entry') {
    return (
      <ContentstackEntry
        contentTypeUid={contentTypeUid}
        entryUid={entryUid}
        {...props}
      />
    );
  } else {
    console.warn(`Unknown reference type: ${type}.`);
    return <>Unknown reference type: {type}. </>;
  }
};

export default ContentstackReference;
