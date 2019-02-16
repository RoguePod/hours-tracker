import { Route, Switch } from "react-router-dom";

import EditPage from "./edit-page/EditPage";
import IndexPage from "./index-page/IndexPage";
import NewPage from "./new-page/NewPage";
import ProjectsStack from "./projects-stack/ProjectsStack";
import PropTypes from "javascripts/prop-types";
import React from "react";

const ClientsStack = ({ match }) => {
  return (
    <Switch>
      <Route component={NewPage} path={`${match.url}/new`} />
      <Route component={EditPage} path={`${match.url}/:id/edit`} />
      <Route
        component={ProjectsStack}
        path={`${match.url}/:clientId/projects`}
      />
      <Route component={IndexPage} path={match.url} />
    </Switch>
  );
};

ClientsStack.propTypes = {
  match: PropTypes.routerMatch.isRequired
};

export default ClientsStack;
