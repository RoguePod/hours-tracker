import { Route, Switch } from "react-router-dom";

import EditPage from "./edit-page/EditPage";
import NewPage from "./new-page/NewPage";
import PropTypes from "javascripts/prop-types";
import React from "react";

const ProjectsStack = ({ match }) => {
  return (
    <Switch>
      <Route component={NewPage} path={`${match.path}/new`} />
      <Route component={EditPage} path={`${match.path}/:id/edit`} />
    </Switch>
  );
};

ProjectsStack.propTypes = {
  match: PropTypes.routerMatch.isRequired
};

export default ProjectsStack;
