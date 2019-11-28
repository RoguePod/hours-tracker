import { ActionIcon, Spinner } from 'javascripts/shared/components';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';

import { Formik } from 'formik';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import StopWatchForm from './StopWatchForm';
import Timer from './Timer';
import _get from 'lodash/get';
import _pick from 'lodash/pick';
import gql from 'graphql-tag';
import { serverErrors } from 'javascripts/globals';

const START_MUTATION = gql`
  mutation EntryStart($description: String, $projectId: String) {
    entryStart(description: $description, projectId: $projectId) {
      id
    }
  }
`;

const STOP_MUTATION = gql`
  mutation EntryStop {
    entryStop {
      id
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation EntryUpdate($description: String, $id: ID!, $projectId: String) {
    entryUpdate(description: $description, id: $id, projectId: $projectId) {
      description
      id
      projectId
    }
  }
`;

const QUERY = gql`
  query EntryRunning {
    entryRunning {
      description
      id
      projectId
      startedAt
      timezone
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription EntryRunningSubscription {
    entryRunningSubscription {
      description
      id
      projectId
      startedAt
      timezone
    }
  }
`;

const StopWatch = () => {
  const location = useLocation();
  const form = React.useRef(null);
  const { data, loading } = useQuery(QUERY);
  const [onUpdateEntry] = useMutation(UPDATE_MUTATION);
  const [onStopEntry] = useMutation(STOP_MUTATION);
  const [onStartEntry] = useMutation(START_MUTATION);
  const subscription = useSubscription(SUBSCRIPTION);

  const _handleStart = () => {
    const params = _get(form.current, 'current.state.values', {});

    onStartEntry({
      variables: _pick(params, ['description', 'projectId'])
    });
  };

  const _handleSwap = () => {
    onStartEntry({ variables: {} });
  };

  const _handleStop = () => {
    onStopEntry();
  };

  const _handleSubmit = (params, actions) => {
    if (!params.id) {
      return null;
    }

    return (
      onUpdateEntry({ variables: { params } })
        // .then((response) => {
        //   // { data: { entryUpdate: { id } } }
        //   console.log(response);
        //   // onAddFlash("Sign In Successful!");
        // })
        .catch((error) => {
          const { errors, status } = serverErrors(error);

          if (actions) {
            actions.setStatus(status);
            actions.setErrors(errors);
            actions.setSubmitting(false);
          }
        })
    );
  };

  const _renderRunningButtons = (entry) => {
    return (
      <div className="flex flex-row justify-between flex-no-wrap py-4">
        <ActionIcon
          color="red"
          icon="stop"
          onClick={_handleStop}
          title="Stop"
          type="button"
        />

        <ActionIcon
          color="purple"
          icon="sync-alt"
          onClick={_handleSwap}
          title="Swap"
          type="button"
        />

        <ActionIcon
          as={Link}
          color="teal"
          icon="exchange-alt"
          title="Split"
          to={`/entries/${entry.id}/split`}
        />

        <ActionIcon
          as={Link}
          color="orange"
          icon="pencil-alt"
          title="Edit"
          to={{
            ...location,
            pathname: `/entries/${entry.id}/edit`,
            state: { modal: true }
          }}
        />
      </div>
    );
  };

  const _renderNotRunningButtons = () => {
    return (
      <div className="flex flex-row justify-center flex-no-wrap py-4">
        <ActionIcon
          icon="play"
          onClick={() => _handleStart(onStartEntry)}
          title="Start"
        />
      </div>
    );
  };

  const _renderForm = (formikProps) => {
    return <StopWatchForm {...formikProps} onAutoSave={_handleSubmit} />;
  };

  let entry = _get(data, 'entryRunning');

  if (!subscription.loading) {
    entry = _get(subscription, 'data.entryRunningSubscription');
  }

  const hasEntry = Boolean(!loading && _get(entry, 'id'));
  const initialValues = _pick(entry, ['id', 'description', 'projectId']);

  return (
    <div className="relative">
      <div className="p-4">
        <Timer disabled={!hasEntry} entry={entry} />
        {hasEntry && _renderRunningButtons(entry)}
        {!hasEntry && _renderNotRunningButtons()}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          key={hasEntry ? entry.id : 'NONE'}
          onSubmit={_handleSubmit}
          ref={form}
          render={_renderForm}
        />
      </div>
      {loading && <Spinner spinning={loading} />}
    </div>
  );
};

StopWatch.propTypes = {};

StopWatch.defaultProps = {};

export default React.memo(StopWatch);
