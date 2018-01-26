import {
  ClientsStack,
  DashboardPage,
  EntriesStack,
  ProfilePage
} from 'javascripts/app/containers';
import { Route, Switch } from 'react-router-dom';

import React from 'react';

const Routes = () => {
  return (
    <Switch>
      <Route
        component={ClientsStack}
        path="/clients"
      />
      <Route
        component={EntriesStack}
        path="/entries"
      />
      <Route
        component={ProfilePage}
        path="/profile"
      />
      <Route
        component={DashboardPage}
        exact
        path="/"
      />
    </Switch>
  );
};

export default Routes;
