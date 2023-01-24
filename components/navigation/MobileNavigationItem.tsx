import React from 'react';

import { keyMap } from '@leafygreen-ui/lib';
import { palette } from '@leafygreen-ui/palette';

import { useMobileNavigation } from './NavigationContext';
import { borderColor, leftRightPadding } from './styles';

import { css, cx } from '@emotion/css';

const listItemStyle = css`
  ${leftRightPadding}
  width: 50%;
  height: 68px;
  background-color: ${palette.gray.light3};
  border-bottom: 1px solid ${borderColor};
  display: flex;
  align-items: center;
  color: ${palette.gray.dark1};
  font-size: 16px;
  line-height: 24px;
  text-transform: capitalize;

  &:nth-child(odd) {
    border-right: 1px solid ${borderColor};
  }
`;

const activeStyle = css`
  background-color: ${palette.green.light3};
`;

type MobileNavigationItemProps = JSX.IntrinsicElements['li'] & {
  children: React.ReactNode;
  active?: boolean;
};

function MobileNavigationItem({
  children,
  active,
  onClick,
  ...rest
}: MobileNavigationItemProps) {
  const { setOpen } = useMobileNavigation();

  return (
    <li
      role="menuitem"
      onClick={e => {
        setOpen(curr => !curr);
        onClick?.(e);
      }}
      onKeyDown={e => {
        if (e.keyCode === keyMap.Space || e.keyCode === keyMap.Enter) {
          setOpen(curr => !curr);
          onClick?.(e as any); // onClick expecting React.MouseEvent
        }
      }}
      className={cx(listItemStyle, { [activeStyle]: active })}
      {...rest}
    >
      {children}
    </li>
  );
}

MobileNavigationItem.displayName = 'MobileNavigationItem';

export default MobileNavigationItem;
