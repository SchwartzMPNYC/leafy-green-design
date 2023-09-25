import styled from '@emotion/styled';
import { signIn, signOut, useSession } from 'next-auth/client'
import { mq } from 'utils/mediaQuery';

import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import {
  FocusableMenuItem,
  Menu as LGMenu,
  MenuItem,
} from '@leafygreen-ui/menu';
import { palette } from '@leafygreen-ui/palette';
import { fontWeights, spacing } from '@leafygreen-ui/tokens';

import { UserInfo } from '../UserInfo';

const Container = styled('div')`
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  padding-top: ${spacing[4]}px;
  z-index: 1;
  // todo: remove
  gap: 8px;
  ${mq({
    display: ['none', 'none', 'flex'],
  })}
`;

const Menu = styled(LGMenu)`
  padding: 0;
  width: unset;
  background-color: ${palette.gray.dark3};
`;

const UserMenuTrigger = styled(Button)`
  border-radius: 16px;
  padding-left: ${spacing[2]}px;
  max-height: 32px;
  background-color: ${palette.white};
  border-color: ${palette.gray.light2};
  font-weight: ${fontWeights.regular};

  &[aria-expanded='true'] {
    font-weight: ${fontWeights.bold};
    border-color: ${palette.gray.light1};
    background-color: ${palette.gray.light2};
  }
`;

const LogOutMenuItem = styled(MenuItem)`
  padding: 20px;
`;

const DesktopSignIn = () => {

  const [session, loading] = useSession();

  // todo: replace with real values
  const user = {
    firstName: 'Sean',
    lastName: 'Park',
    email: 's.park@mongodb.com',
  };

  return (
    <Container>
      <Button
        variant="primaryOutline"
        leftGlyph={<Icon glyph="LogIn" />}
        onClick={signIn}
      >
        Log in
      </Button>
      <Menu
        trigger={
          <UserMenuTrigger rightGlyph={<Icon glyph="CaretDown" />}>
            {user.firstName}
          </UserMenuTrigger>
        }
      >
        <FocusableMenuItem>
          <UserInfo {...user} />
        </FocusableMenuItem>
        <LogOutMenuItem glyph={<Icon glyph="LogOut" />}>Log out</LogOutMenuItem>
      </Menu>
      {/* TODO: replace the above with this logic */}
      {/* {session
      ? <Menu trigger={<UserMenuTrigger rightGlyph={<Icon glyph="CaretDown" />}>{userName} </UserMenuTrigger>} />
      : <Button variant="primaryOutline" leftGlyph={<Icon glyph="LogIn" />} onClick={signIn}>Log in</Button>
    } */}
    </Container>
  );
};

export default DesktopSignIn;
