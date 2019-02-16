import { ForgotPasswordPage, SignInPage } from "javascripts/app/containers";
import { Route, Switch } from "react-router-dom";

import PropTypes from "javascripts/prop-types";
import React from "react";

const Routes = ({ match }) => {
  return (
    <Switch>
      <Route
        component={ForgotPasswordPage}
        path={`${match.url}/forgot-password`}
      />
      <Route component={SignInPage} exact path={match.url} />
    </Switch>
  );
};

Routes.propTypes = {
  match: PropTypes.routerMatch.isRequired
};

export default Routes;
