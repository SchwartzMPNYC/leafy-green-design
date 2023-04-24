import { useEffect, useRef, useState } from 'react';
import { CustomComponentDoc } from 'utils/tsdoc.utils';

import Card from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { usePrevious } from '@leafygreen-ui/hooks';
import LeafyGreenProvider, {
  useDarkMode,
} from '@leafygreen-ui/leafygreen-provider';

import { KnobsTable } from './KnobsTable/KnobsTable';
import {
  assertCompleteContext,
  isStateReady,
} from './useLiveExampleState/utils';
import { getStoryCode } from './utils/getStoryCode';
import { CodeExample } from './CodeExample';
import {
  blockContainerStyle,
  liveExampleWrapperStyle,
  storyContainerStyle,
} from './LiveExample.styles';
import { LiveExampleDecorator } from './LiveExampleDecorator';
import {
  LiveExampleError,
  LiveExampleLoading,
  LiveExampleNotFound,
} from './LiveExampleStateComponents';
import { LiveExampleContext, useLiveExampleState } from './useLiveExampleState';

// Use standard block flow for these packages
const useBlockWrapperFor = [
  'icon',
  'palette',
  'side-nav',
  'tokens',
  'typography',
];
const disableCodeExampleFor = ['icon', 'palette', 'tokens'];

export const LiveExample = ({
  componentName,
  tsDoc,
}: {
  componentName: string;
  tsDoc: Array<CustomComponentDoc> | null;
}) => {
  const prevComponentName = usePrevious(componentName);
  const [showCode, setShowCode] = useState(false);
  const [storyCode, setCode] = useState('No code found');
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const storyWrapperRef = useRef<HTMLDivElement>(null);

  // Establish a page state
  // { meta, StoryFn, knobValues, knobsArray, storyCode } =
  const { context, updateKnobValue, resetContext, setErrorState, isState } =
    useLiveExampleState(componentName, tsDoc);

  const { darkMode } = useDarkMode(context.knobValues?.darkMode);

  /** When the component name changes, reset the page */
  useEffect(() => {
    if (componentName !== prevComponentName) {
      if (tsDoc) {
        resetContext(componentName, tsDoc);
      } else {
        setErrorState('TSDoc not found');
      }
    }
  }, [componentName, prevComponentName, tsDoc, resetContext, setErrorState]);

  /** Re-generates story example code from context */
  const regenerateStoryCode = (context: Partial<LiveExampleContext>) => {
    const code = assertCompleteContext(context)
      ? getStoryCode(context) ?? 'No code found'
      : 'No code found';
    setCode(code);
  };

  /** re-generate example code when the context changes */
  useEffect(() => {
    regenerateStoryCode(context);
  }, [context]);

  /** Triggered on button click */
  const toggleShowCode = () => {
    setShowCode(sc => !sc);
    regenerateStoryCode(context);
  };

  const storyWrapperStyle = context.meta?.parameters?.wrapperStyle;

  const storyContainerHeight = Math.min(
    Math.max(
      storyWrapperRef.current?.clientHeight ?? 0,
      window.innerHeight / 3,
    ),
    window.innerHeight * 0.8,
  );

  // should match the total height of the story container
  const exampleCodeHeight = storyContainerHeight + 48;

  const codeExampleEnabled = !disableCodeExampleFor.includes(componentName);

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <Card
        className={css`
          margin-block: 2em;
        `}
      >
        <div className={liveExampleWrapperStyle}>
          <div
            id="story-container"
            ref={storyContainerRef}
            className={cx(
              storyContainerStyle,
              {
                [blockContainerStyle]:
                  useBlockWrapperFor.includes(componentName),
              },
              css`
                // at least as big as the story, but no more than 100vh
                min-height: ${storyContainerHeight}px;
              `,
            )}
          >
            {isStateReady(context) && (
              <div ref={storyWrapperRef} className={storyWrapperStyle}>
                <LiveExampleDecorator meta={context.meta}>
                  <context.StoryFn {...context.knobValues} />
                </LiveExampleDecorator>
              </div>
            )}
            {isState('loading') && <LiveExampleLoading />}
            {isState('not_found') && <LiveExampleNotFound />}
            {isState('error') && (
              <LiveExampleError message={context.errorMessage} />
            )}
          </div>
          {codeExampleEnabled && (
            <CodeExample
              showCode={showCode}
              code={storyCode}
              height={exampleCodeHeight}
            />
          )}
        </div>
        {isStateReady(context) && (
          <KnobsTable
            showCode={showCode}
            codeExampleEnabled={codeExampleEnabled}
            handleShowCodeClick={toggleShowCode}
            knobsArray={context.knobsArray}
            knobValues={context.knobValues}
            updateKnobValue={updateKnobValue}
          />
        )}
      </Card>
    </LeafyGreenProvider>
  );
};
