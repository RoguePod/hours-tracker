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

  /* eslint-disable max-lines-per-function */
  render() {
    const { location: { pathname } } = this.props;

    const isSignIn         = pathname === '/sign-in';
    const isForgotPassword = pathname.startsWith('/sign-in/forgot-password');

    const tabClasses = 'inline-block border rounded py-1 px-3';
    const selectedTabClasses = 'border-blue bg-blue text-white';

    const unselectedTabClasses =
      'border-transparent hover:border-grey-lighter text-blue ' +
      'hover:bg-grey-lighter hover:border-grey-lighter';

    const signInClasses = cx(
      tabClasses, {
        [selectedTabClasses]: isSignIn,
        [unselectedTabClasses]: !isSignIn
      }
    );

    const forgotPasswordClasses = cx(
      tabClasses, {
        [selectedTabClasses]: isForgotPassword,
        [unselectedTabClasses]: !isForgotPassword
      }
    );

    return (
      <header>
        <h1
          className="text-blue"
        >
          {'Hours Tracker'}
        </h1>

        <ul
          className="list-reset flex pt-4"
        >
          <li className="mr-4">
            <Link
              className={signInClasses}
              to="/sign-in"
            >
              {'Sign In'}
            </Link>
          </li>
          <li>
            <Link
              className={forgotPasswordClasses}
              to="/sign-in/forgot-password"
            >
              {'Forgot Password'}
            </Link>
          </li>
        </ul>
      </header>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default SignedOutHeader;
