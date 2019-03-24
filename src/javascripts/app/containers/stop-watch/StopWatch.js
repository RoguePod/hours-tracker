import { ActionIcon, Spinner } from "javascripts/shared/components";
import { Mutation, Query, Subscription } from "react-apollo";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import StopWatchForm from "./StopWatchForm";
import Timer from "./Timer";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
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
/* eslint-enable prettier/prettier */

class StopWatch extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    location: PropTypes.routerLocation.isRequired,
    query: PropTypes.query.isRequired
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

  shouldComponentUpdate(nextProps) {
    const {
      entry,
      query: { loading }
    } = this.props;

    return (
      loading !== nextProps.query.loading || !_isEqual(entry, nextProps.entry)
    );
  }

  _handleStart(onStartEntry) {
    const params = _get(this.form, "current.state.values", {});

    onStartEntry({
      variables: _pick(params, ["description", "projectId"])
    });
  }

  _handleSwap(onStartEntry) {
    onStartEntry({ variables: {} });
  }

  _handleStop(onStopEntry) {
    onStopEntry();
  }

  _handleSubmit(onSubmit, variables, actions) {
    if (variables.id) {
      onSubmit({ variables })
        // .then((response) => {
        //   // { data: { entryUpdate: { id } } }
        //   console.log(response);
        //   // onAddFlash("Sign In Successful!");
        // })
        .catch(error => {
          const { errors, status } = serverErrors(error);

          if (actions) {
            actions.setStatus(status);
            actions.setErrors(errors);
            actions.setSubmitting(false);
          }
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

        <Mutation mutation={START_MUTATION}>
          {onStartEntry => (
            <ActionIcon
              color="purple"
              icon="sync-alt"
              onClick={() => this._handleSwap(onStartEntry)}
              title="Swap"
              type="button"
            />
          )}
        </Mutation>

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
    const {
      entry,
      query: { loading }
    } = this.props;

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
                key={hasEntry ? entry.id : "NONE"}
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

const StopWatchSubscription = props => {
  return (
    <Subscription subscription={SUBSCRIPTION}>
      {subscription => {
        let entry = _get(props, "query.data.entryRunning");

        if (!subscription.loading) {
          entry = _get(subscription, "data.entryRunningSubscription");
        }

        return (
          <StopWatch {...props} entry={entry} subscription={subscription} />
        );
      }}
    </Subscription>
  );
};

const StopWatchQuery = props => {
  return (
    <Query query={QUERY}>
      {query => {
        return <StopWatchSubscription {...props} query={query} />;
      }}
    </Query>
  );
};

export default StopWatchQuery;
