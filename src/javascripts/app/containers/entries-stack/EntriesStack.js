import { Route, Switch } from 'react-router-dom';

import EditMultiplePage from './edit-multiple-page/EditMultiplePage';
import EditPage from './edit-page/EditPage';
import IndexStack from './index-stack/IndexStack';
import NewPage from './new-page/NewPage';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitPage from './split-page/SplitPage';

const EntriesStack = ({ match }) => {
  return (
    <Switch>
      <Route
        component={NewPage}
        path={`${match.url}/new`}
      />
      <Route
        component={EditMultiplePage}
        path={`${match.url}/edit`}
      />
      <Route
        component={EditPage}
        path={`${match.url}/:id/edit`}
      />
      <Route
        component={SplitPage}
        path={`${match.url}/:id/split`}
      />
      <Route
        component={IndexStack}
        path={match.url}
      />
    </Switch>
  );
};

EntriesStack.propTypes = {
  match: PropTypes.routerMatch.isRequired
};

export default EntriesStack;
