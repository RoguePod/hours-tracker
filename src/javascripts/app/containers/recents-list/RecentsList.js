import { useQuery, useSubscription } from '@apollo/react-hooks';

import { Clock } from 'javascripts/shared/components';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RecentRow from './RecentRow';
import _get from 'lodash/get';
import gql from 'graphql-tag';

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

const RecentsList = () => {
  const subscription = useSubscription(SUBSCRIPTION);
  const { data, loading } = useQuery(QUERY);

  let projects = _get(data, 'projectsRecents', []);
  if (!subscription.loading) {
    projects = _get(subscription, 'data.projectsRecentsSubscription', []);
  }

  const rows = projects.map((project) => (
    <RecentRow key={project.id} project={project} />
  ));

  const listClasses =
    'flex flex-col items-center justify-center flex-1 text-blue';

  return (
    <>
      <div className="bg-blue text-white p-4 font-bold">
        {'Recent Projects'}
      </div>
      {loading && (
        <div className={listClasses}>
          <Clock size="60px" />
          <div className="pt-2">{'Loading Recents...'}</div>
        </div>
      )}

      {!loading && (
        <div className="overflow-y-auto overflow-x-hidden">{rows}</div>
      )}
    </>
  );
};

RecentsList.propTypes = {};

export default React.memo(RecentsList);
