import { PropItem } from 'react-docgen-typescript';
import { defaults, pickBy, isUndefined } from 'lodash';
import pascalcase from 'pascalcase';
import { CustomComponentDoc, findComponentDoc, getComponentPropsArray, getDefaultValueValue } from 'utils/tsdoc.utils';
import { ComponentStoryFn, Meta } from '@storybook/react';
import React, { ReactNode } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { KnobType, LiveExampleState, MetadataSources, TypeString } from './types';

/**
 * A list of Prop names that should not appear in Knobs
 */
export const ignoreProps = [
  'className',
  'tooltipClassName',
  'contentClassName',
  'id',
  'onClick',
  'onChange',
  'onBlur',
  'onFocus',
  'onClose',
  'handleValidation',
  'aria-label',
  'aria-labelledby',
  'aria-controls',
  'popoverClassName',
  'popoverZIndex',
  'portalClassName',
  'portalContainer',
  'shouldTooltipUsePortal',
  'adjustOnMutation',
  'refEl',
  'scrollContainer',
  'setOpen',
  'shouldClose',
];


/**
 * @returns the input array, or values of the input Record
 */
const valuesArrayFrom = (
  ArrayLike?: Array<any> | Record<string, any>,
): Array<any> | undefined =>
  ArrayLike
    ? Array.isArray(ArrayLike)
      ? ArrayLike
      : Object.values(ArrayLike)
    : undefined;



/**
 * Utility to get the `argTypes` object for a given prop
 */
export const getSBInputType = ({
  meta,
  StoryFn,
  TSDocProp: { name },
}: MetadataSources) => meta?.argTypes?.[name] ?? StoryFn?.argTypes?.[name];

/**
 * Returns a filter function for PropItems
 * with `meta` and `StoryFn` in the closure
 */
export function getPropItemFilterFn({
  meta,
  StoryFn,
}: Omit<MetadataSources, 'TSDocProp'>) {
  return (TSDocProp: PropItem) => {
    const isIgnored = ignoreProps.includes(TSDocProp.name);
    const SBInputType = getSBInputType({ meta, StoryFn, TSDocProp });
    const isExcludedBySB: boolean =
      meta?.parameters?.controls?.exclude?.includes(TSDocProp.name);
    const isControlNone = ['none', false].includes(SBInputType?.control);
    return !isIgnored && !isExcludedBySB && !isControlNone;
  };
}

/**
 * Returns a map function that maps a PropItem to KnobValue,
 * with `meta` and `StoryFn` in the closure
 */
export function getPropItemToKnobTypeMapFn({
  meta,
  StoryFn,
}: Omit<MetadataSources, 'TSDocProp'>) {
  return (TSDocProp: PropItem): KnobType => ({
    ...TSDocProp,
    name: TSDocProp.name,
    options: getKnobOptions({ meta, StoryFn, TSDocProp }),
    controlType: getControlType({ meta, StoryFn, TSDocProp }),
    description: getKnobDescription({
      meta,
      StoryFn,
      TSDocProp,
    }),
    defaultValue: getDefaultValue({
      meta,
      StoryFn,
      TSDocProp,
    }),
  } as KnobType)
}

/**
 * @returns A Type string based on metadata from Storybook and TSDoc
 */
export function getControlType({
  meta,
  StoryFn,
  TSDocProp,
}: MetadataSources): TypeString {
  const type = TSDocProp.type;
  const SBInputType = getSBInputType({ meta, StoryFn, TSDocProp });

  if (SBInputType && SBInputType.control) {
    return SBInputType.control.type ?? SBInputType.control;
  }

  switch (type.name) {
    case 'enum':
      switch (type.raw) {
        case 'boolean':
          return 'boolean';
        case 'ReactNode':
          return 'string';
      }

      return 'array';

    case 'string':
    case 'number':
      return type.name;

    default:
      return 'other';
  }
}

/**
 * @returns Options for enum type knobs, based on metadata from Storybook and TSDoc.
 * Returns an empty array if there are no options
 */
export function getKnobOptions({
  meta,
  StoryFn,
  TSDocProp,
}: MetadataSources): Array<string> {
  const type = TSDocProp.type;
  const SBInputType = getSBInputType({ meta, StoryFn, TSDocProp });

  const argOptions: Array<any> | undefined = valuesArrayFrom(
    SBInputType?.options,
  )?.map(opt => opt?.toString());
  const controlOptions: Array<any> | undefined = valuesArrayFrom(
    SBInputType?.control.options,
  )?.map(opt => opt?.toString());

  const options: Array<string> = (
    argOptions ??
    controlOptions ??
    type?.value?.map(({ value }) => value.toString().replace(/"/g, '')) ??
    []
  ).filter((opt: string) => !!opt);

  return options;
}

/**
 * @returns the default value based on metadata from Storybook and TSDoc
 */
export function getDefaultValue({
  meta,
  StoryFn,
  TSDocProp,
}: MetadataSources): any {
  const TSDefaultValue = getDefaultValueValue(TSDocProp);
  const SBArg = meta.args?.[TSDocProp.name] ?? StoryFn.args?.[TSDocProp.name];
  const SBInputType = getSBInputType({ meta, StoryFn, TSDocProp });
  const SBDefaultValue = SBInputType?.defaultValue;
  return SBArg ?? SBDefaultValue ?? TSDefaultValue;
}

export function getInitialKnobValues(
  knobsArray: Array<KnobType>,
  meta: Meta<any>,
  StoryFn: ComponentStoryFn<any>,
) {
  const knobDefaults = knobsArray.reduce((values, { name, defaultValue }) => {
    values[name] = defaultValue;
    return values;
  }, {} as Record<'string', any>);
  return defaults(knobDefaults, meta.args, StoryFn.args);
}

/**
 * @returns the prop description based on metadata from Storybook and TSDoc
 */
export function getKnobDescription({
  meta,
  StoryFn,
  TSDocProp,
}: MetadataSources) {
  return (
    (meta.argTypes?.[TSDocProp.name] || StoryFn.argTypes?.[TSDocProp.name])
      ?.description ?? TSDocProp.description
  );
}

/**
 * Returns example code for the given component data
 */
export function getStoryCode({
  componentName,
  meta,
  StoryFn,
  knobValues,
}: {
  componentName: string;
  meta?: Meta<any>;
  StoryFn?: ComponentStoryFn<any>;
  knobValues?: { [arg: string]: any };
}): string | undefined {

  const useStorySourceForComponents = ['typography']

  const getStoryJSX = (element: ReactNode, displayName: string) =>
    reactElementToJSXString(element, {
      displayName: _ => pascalcase(displayName),
      showFunctions: true,
      useBooleanShorthandSyntax: false,
    });

  const getStorySourceCode = (meta?: Meta<any>) => {
    if (meta && meta.parameters) {
      const {
        parameters: { default: defaultStoryName, storySource },
      } = meta;

      const locationsMap = defaultStoryName
        ? storySource.locationsMap[defaultStoryName]
        : Object.values(storySource.locationsMap)[0];

      const lines = (storySource.source as string).match(/^.*$/gm);
      const storyCode = lines
        ?.slice(locationsMap.startLoc.line - 1, locationsMap.endLoc.line - 1)
        .join('\n');
      return storyCode;
    }
  };

  /**
   * If this is the Typography component,
   * we use the original story code,
   * otherwise we convert the component to JSX
   */
  if (useStorySourceForComponents.includes(componentName)) {
    return getStorySourceCode(meta);
  } else {
    const renderedStory = StoryFn
      ? React.createElement(StoryFn, {...knobValues})
      : undefined;
    return getStoryJSX(renderedStory, componentName);
  }
}

/**
 * Given component metadata
 * returns a LiveExampleState object
 */
export function getLiveExampleState({
  componentName,
  meta,
  stories,
  tsDoc
}: {
  componentName:string,
  meta: Meta<any>,
  stories: { [key: string]: ComponentStoryFn<any>},
  tsDoc: Array<CustomComponentDoc> | null
}): LiveExampleState {
  const defaultStoryName =
  meta.parameters?.default ?? Object.keys(stories)[0];

  const StoryFn = defaultStoryName
    ? stories[defaultStoryName]
    : Object.values(stories)[0];

  const knobsArray: Array<KnobType> = getComponentPropsArray(
    findComponentDoc(componentName, tsDoc),
  )
    // Filter out component props we don't want knobs for.
    // i.e. `@ignore` tags, excluded in SB.parameters.controls
    .filter(getPropItemFilterFn({ meta, StoryFn }))
    // Convert to custom KnobType by adding additional properties,
    // and updating other properties
    .map(getPropItemToKnobTypeMapFn({ meta, StoryFn }));

  // Extract the default Knob Values, and include any props not explicitly included in TSDoc
  // This state object will be modified whenever a user interacts with a knob.
  const knobValues = pickBy(
    getInitialKnobValues(knobsArray, meta, StoryFn),
    // Filter out values that are explicitly undefined
    val => !isUndefined(val),
  );

  const storyCode = getStoryCode({
    componentName,
    meta,
    StoryFn,
    knobValues,
  });

  return {
    meta,
    knobValues,
    knobsArray,
    StoryFn,
    storyCode,
  }
}