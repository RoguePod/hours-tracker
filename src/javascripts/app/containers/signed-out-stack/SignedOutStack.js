import { ForgotPasswordPage, SignInPage } from 'javascripts/app/containers';
import { Route, Switch } from 'react-router-dom';

import { Clock } from 'javascripts/shared/components';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';

const SignedOutStack = () => {
  React.useEffect(() => {
    document.documentElement.className = 'antialiased h-full bg-blue-200';

    return () => {
      document.documentElement.className = 'antialiased h-full bg-white';
    };
  }, []);

  return (
    <div className="min-w-128 mx-auto py-4 px-2">
      <header className="text-blue flex flex-row items-center justify-center">
        <Clock animate={false} size="50px" />
        <h1 className="pl-3">{'Hours Tracker'}</h1>
      </header>

      <div className="pt-6">
        <Switch>
          <Route component={ForgotPasswordPage} path="/forgot-password" />
          {/* <Route component={SignUpPage} path="/sign-up" /> */}
          <Route component={SignInPage} exact path="/" />
        </Switch>
      </div>
    </div>
  );
};

SignedOutStack.propTypes = {};

SignedOutStack.defaultProps = {};

export default React.memo(SignedOutStack);
