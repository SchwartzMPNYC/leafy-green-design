import ComponentLayout from 'layouts/ComponentLayout';
import { ReactElement } from 'react';
import { getStaticComponentPaths } from 'utils/getStaticComponent';
import { LiveExample } from 'components/pages/example/LiveExample';
import { getTSDoc } from 'utils/_getComponentResources';
import { getComponent } from 'utils/getContentfulResources';
import { CustomComponentDoc } from 'utils/tsdoc.utils';

const ComponentExample = ({
  componentName,
  tsDoc,
}: {
  componentName: string;
  tsDoc: Array<CustomComponentDoc>;
}) => {
  return <LiveExample componentName={componentName} tsDoc={tsDoc} />;
};

ComponentExample.getLayout = function getLayout(page: ReactElement) {
  return (
    <ComponentLayout componentFields={page.props.fields}>
      {page}
    </ComponentLayout>
  );
};

export const getStaticPaths = getStaticComponentPaths;

export const getStaticProps = async ({ params }) => {
  const { componentName } = params;

  // Here we pull out the designGuidelines to ensure we're not passing that to this page unnecessarily
  const {
    fields: { designGuidelines, ...meta },
  } = (await getComponent(componentName)) ?? {
    fields: { designGuidelines: null },
  };
  const tsDoc = await getTSDoc(componentName);

  return {
    props: {
      componentName,
      fields: meta,
      tsDoc,
    },
  };
};

export default ComponentExample;
