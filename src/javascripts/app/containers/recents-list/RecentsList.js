import { Clock } from "javascripts/shared/components";
import PropTypes from "javascripts/prop-types";
import { Query } from "react-apollo";
import React from "react";
import RecentRow from "./RecentRow";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import gql from "graphql-tag";

const QUERY = gql`
  query {
    userSession {
      autoloadLastDescription
      id
    }

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

class RecentsList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    projects: PropTypes.arrayOf(PropTypes.project).isRequired
  };

  shouldComponentUpdate(nextProps) {
    const { loading, projects } = this.props;

    return (
      loading !== nextProps.loading || !_isEqual(projects, nextProps.projects)
    );
  }

  render() {
    const { loading, projects } = this.props;

    const rows = projects.map(project => {
      return <RecentRow {...this.props} key={project.id} project={project} />;
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

const RecentsListQuery = props => {
  return (
    <Query query={QUERY}>
      {query => {
        const projects = _get(query, "data.projectsRecents", []);
        const user = _get(query, "data.userSession");

        return (
          <RecentsList {...props} {...query} projects={projects} user={user} />
        );
      }}
    </Query>
  );
};

export default RecentsListQuery;
