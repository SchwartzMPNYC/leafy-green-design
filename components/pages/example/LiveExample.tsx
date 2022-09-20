import { useEffect, useReducer } from 'react';
import { kebabCase } from 'lodash';
import Card from '@leafygreen-ui/card';
import { css } from '@leafygreen-ui/emotion';
import pascalcase from 'pascalcase';
import { ComponentStoryFn, Meta } from '@storybook/react';
import { getComponentStory } from 'utils/getComponentStory';
import { BaseLayoutProps } from 'utils/types';
import { getComponentProps } from 'utils/tsdoc.utils';
import { KnobRow } from './KnobRow';

const ignoreProps = [
  'className',
  'tooltipClassName',
  'contentClassName',
  'id',
  'onClick',
  'onChange',
  'onBlur',
  'handleValidation',
  'aria-label',
  'aria-labelledby',
  'aria-controls',
  'popoverClassName',
  'portalClassName',
  'portalContainer',
  'shouldTooltipUsePortal',
  'adjustOnMutation',
  'refEl',
  'scrollContainer',
  'setOpen',
  'shouldClose',
];
export interface LiveExampleState {
  meta?: Meta<any>;
  args?: { [arg: string]: any };
  StoryFn?: ComponentStoryFn<any>;
}

export const LiveExample = ({
  componentName,
  tsDoc,
}: Partial<BaseLayoutProps>) => {
  const [{ meta, args, StoryFn }, setState] = useReducer(
    (state: LiveExampleState, newState: LiveExampleState) => {
      return {
        ...state,
        ...newState,
      };
    },
    {
      meta: undefined,
      args: undefined,
      StoryFn: undefined,
    } as LiveExampleState,
  );

  // Fetch Story if/when component changes
  useEffect(() => {
    const kebabName = kebabCase(componentName);
    getComponentStory(kebabName).then(module => {
      const { default: meta, ...stories } = module;
      const StoryFn = Object.values(stories)[0];
      const args = { ...meta.args, ...StoryFn?.args };
      setState({ meta, args, StoryFn });
    });
  }, [componentName]);

  const { props } = tsDoc?.find(
    doc => doc.displayName === pascalcase(componentName),
  ) || {
    props: undefined,
  };
  const knobProps = getComponentProps(props).filter(prop => {
    const isIgnored = ignoreProps.includes(prop.name);
    const isExcludedBySB = meta?.parameters?.controls.exclude?.includes(
      prop.name,
    );
    const isControlNone = ['none', false].includes(
      meta?.argTypes?.[prop.name]?.control,
    );
    return !isIgnored && !isExcludedBySB && !isControlNone;
  });

  const darkMode = args?.darkMode;

  return (
    <>
      <Card
        darkMode={darkMode}
        className={css`
          margin-block: 2em;
        `}
      >
        <div
          className={css`
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 33vh;
          `}
        >
          {StoryFn && <StoryFn {...args} />}
        </div>
        <div>
          {knobProps &&
            knobProps.map(prop => (
              <KnobRow
                key={prop.name}
                prop={prop}
                darkMode={darkMode}
                args={args}
                setArg={(key: string, value: any) => {
                  setState({
                    meta,
                    StoryFn,
                    args: { ...args, [key]: value },
                  });
                }}
                meta={meta}
              />
            ))}
        </div>
      </Card>
    </>
  );
};
