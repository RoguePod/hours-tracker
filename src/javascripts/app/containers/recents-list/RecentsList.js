import { Query, Subscription } from "react-apollo";

import { Clock } from "javascripts/shared/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import RecentRow from "./RecentRow";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import gql from "graphql-tag";

const QUERY = gql`
  query {
    projectsRecents {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription ProjectsRecentsSubscription {
    projectsRecentsSubscription {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

class RecentsList extends React.Component {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.project).isRequired,
    query: PropTypes.gqlQuery.isRequired
  };

  shouldComponentUpdate(nextProps) {
    const {
      projects,
      query: { loading }
    } = this.props;

    return (
      loading !== nextProps.query.loading ||
      !_isEqual(projects, nextProps.projects)
    );
  }

  render() {
    const {
      projects,
      query: { loading }
    } = this.props;

    const rows = projects.map(project => {
      return <RecentRow key={project.id} project={project} />;
    });

    const listClasses =
      "flex flex-col items-center justify-center flex-1 text-blue";

    return (
      <>
        <div className="bg-blue text-white p-4 font-bold">
          {"Recent Projects"}
        </div>
        {loading && (
          <div className={listClasses}>
            <Clock size="60px" />
            <div className="pt-2">{"Loading Recents..."}</div>
          </div>
        )}

        {!loading && (
          <div className="overflow-y-auto overflow-x-hidden">{rows}</div>
        )}
      </>
    );
  }
}

const RecentsListSubscription = props => {
  return (
    <Subscription subscription={SUBSCRIPTION}>
      {subscription => {
        let projects = _get(props, "query.data.projectsRecents", []);

        if (!subscription.loading) {
          projects = _get(subscription, "data.projectsRecentsSubscription", []);
        }

        return <RecentsList {...props} projects={projects} />;
      }}
    </Subscription>
  );
};

const RecentsListQuery = props => {
  return (
    <Query query={QUERY}>
      {query => {
        return <RecentsListSubscription {...props} query={query} />;
      }}
    </Query>
  );
};

export default RecentsListQuery;
