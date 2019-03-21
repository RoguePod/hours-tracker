import { ActionIcon, Spinner } from "javascripts/shared/components";
import { Mutation, Query, Subscription } from "react-apollo";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import StopWatchForm from "./StopWatchForm";
import Timer from "./Timer";
import _get from "lodash/get";
import _pick from "lodash/pick";
import gql from "graphql-tag";
import { serverErrors } from "javascripts/globals";

/* eslint-disable prettier/prettier */
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
  mutation EntryUpdate($description: String, $projectId: String) {
    entryUpdate(description: $description, projectId: $projectId) {
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
/* eslint-enable prettier/prettier */

class StopWatch extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    loading: PropTypes.bool.isRequired,
    location: PropTypes.routerLocation.isRequired
  };

  static defaultProps = {
    entry: null
  };

  constructor(props) {
    super(props);

    this.form = React.createRef();

    this._handleStart = this._handleStart.bind(this);
    this._handleSwap = this._handleSwap.bind(this);
    this._handleStop = this._handleStop.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleStart(onStartEntry) {
    const params = _get(this.form, "current.state.values", {});

    onStartEntry({
      variables: _pick(params, ["description", "projectId"])
    });
  }

  _handleSwap(onStartEntry) {
    onStartEntry({});
  }

  _handleStop(onStopEntry) {
    onStopEntry();
  }

  _handleSubmit(onSubmit, variables, actions) {
    if (variables.id) {
      onSubmit({ variables })
        .then(({ data: { entryRunning: { id } } }) => {
          console.log(id);
          // onAddFlash("Sign In Successful!");
        })
        .catch(error => {
          const { errors, status } = serverErrors(error);
          actions.setStatus(status);
          actions.setErrors(errors);
          actions.setSubmitting(false);
        });
    }
  }

  _renderRunningButtons(entry) {
    const { location } = this.props;

    return (
      <div className="flex flex-row justify-between flex-no-wrap py-4">
        <Mutation mutation={STOP_MUTATION}>
          {onStopEntry => (
            <ActionIcon
              color="red"
              icon="stop"
              onClick={() => this._handleStop(onStopEntry)}
              title="Stop"
              type="button"
            />
          )}
        </Mutation>

        <ActionIcon
          color="purple"
          icon="sync-alt"
          onClick={this._handleSwap}
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
  }

  _renderNotRunningButtons() {
    return (
      <div className="flex flex-row justify-center flex-no-wrap py-4">
        <Mutation mutation={START_MUTATION}>
          {onStartEntry => (
            <ActionIcon
              icon="play"
              onClick={() => this._handleStart(onStartEntry)}
              title="Start"
            />
          )}
        </Mutation>
      </div>
    );
  }

  _renderForm(formProps, onSubmit) {
    return (
      <StopWatchForm
        {...formProps}
        onAutoSave={variables => this._handleSubmit(onSubmit, variables)}
      />
    );
  }

  render() {
    const { entry, loading } = this.props;

    const hasEntry = Boolean(!loading && _get(entry, "id"));
    const initialValues = _pick(entry, ["id", "description", "projectId"]);

    return (
      <div className="relative">
        <div className="p-4">
          <Timer disabled={!hasEntry} entry={entry} />
          {hasEntry && this._renderRunningButtons(entry)}
          {!hasEntry && this._renderNotRunningButtons()}

          <Mutation mutation={UPDATE_MUTATION}>
            {onSubmit => (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={(variables, actions) =>
                  this._handleSubmit(onSubmit, variables, actions)
                }
                ref={this.form}
                render={props => this._renderForm(props, onSubmit)}
              />
            )}
          </Mutation>
        </div>
        {loading && <Spinner spinning={loading} />}
      </div>
    );
  }
}

const StopWatchQuery = props => {
  return (
    <Query query={QUERY}>
      {query => {
        const entry = _get(query, "data.entryRunning", {});

        return <StopWatch {...props} {...query} entry={entry} />;
      }}
    </Query>
  );
};

const StopWatchSubscription = props => {
  return (
    <Subscription subscription={SUBSCRIPTION}>
      {subscription => {
        console.log(subscription);

        return <StopWatchQuery {...props} subscription={subscription} />;
      }}
    </Subscription>
  );
};

export default StopWatchSubscription;
