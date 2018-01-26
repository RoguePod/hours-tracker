import { Header, Menu } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';

class SignedOutHeader extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { location } = this.props;

    return (
      !_isEqual(location, nextProps.location)
    );
  }

  render() {
    const { location: { pathname } } = this.props;

    const isSignIn         = pathname === '/sign-in';
    const isForgotPassword = pathname.startsWith('/sign-in/forgot-password');

    return (
      <header>
        <Header
          as="h1"
          color="blue"
        >
          {'Hours Tracker'}
        </Header>

        <Menu
          secondary
        >
          <Link
            className={cx('item', { active: isSignIn })}
            to="/sign-in"
          >
            {'Sign In'}
          </Link>
          <Link
            className={cx('item', { active: isForgotPassword })}
            to="/sign-in/forgot-password"
          >
            {'Forgot Password'}
          </Link>
        </Menu>
      </header>
    );
  }
}

export default SignedOutHeader;
