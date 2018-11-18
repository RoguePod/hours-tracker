import {
  Button,
  FormError,
  Spinner,
  TextAreaField,
  TimeField
} from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';
import { isParsedTime, isRequired, isStoppedAt } from 'javascripts/validators';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import { connect } from 'react-redux';
import { createEntry } from 'javascripts/app/redux/entry';
import moment from 'moment';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntryNewForm extends React.Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    error: PropTypes.string,
    fetching: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onCreateEntry: PropTypes.func.isRequired,
    running: PropTypes.entry,
    submitting: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    error: null,
    fetching: null,
    running: null
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _parseDate(value, timezone) {
    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return null;
    }

    const values = [
      parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
      parsed.getHours(), parsed.getMinutes()
    ];

    return moment.tz(values, timezone)
      .utc()
      .valueOf();
  }

  _handleSubmit(data) {
    const { onCreateEntry, timezone } = this.props;

    const params = {
      ...data,
      startedAt: this._parseDate(data.startedAt, timezone),
      stoppedAt: this._parseDate(data.stoppedAt, timezone),
      timezone
    };

    return new Promise((resolve, reject) => {
      onCreateEntry(params, resolve, reject);
    });
  }

  _handleProjectChange(clientRef, projectRef) {
    const { change } = this.props;

    change('clientRef', clientRef);
    change('projectRef', projectRef);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const {
      error, fetching, handleSubmit, running, submitting, timezone
    } = this.props;

    const stoppedAtValidation = [isParsedTime, isStoppedAt];

    if (running) {
      stoppedAtValidation.unshift(isRequired);
    }

    return (
      <React.Fragment>
        <form
          noValidate
          onSubmit={handleSubmit(this._handleSubmit)}
        >
          <FormError error={error} />
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <Field
                autoCapitalize="none"
                autoCorrect="off"
                component={TimeField}
                disabled={submitting}
                label="Started"
                name="startedAt"
                timezone={timezone}
                type="text"
                validate={[isRequired, isParsedTime]}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <Field
                autoCapitalize="none"
                autoCorrect="off"
                component={TimeField}
                disabled={submitting}
                label="Stopped"
                name="stoppedAt"
                timezone={timezone}
                type="text"
                validate={stoppedAtValidation}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <Field
                component={ProjectField}
                disabled={submitting}
                label="Project"
                name="projectName"
                nameClient="clientRef"
                nameProject="projectRef"
                onProjectChange={this._handleProjectChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <Field
                autoCapitalize="sentences"
                autoCorrect="on"
                autoHeight
                component={TextAreaField}
                disabled={submitting}
                label="Description"
                name="description"
                rows={1}
              />
            </div>
          </div>
          <Button
            className="py-2 w-full"
            color="green"
            disabled={submitting}
            loading={submitting}
            type="submit"
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
        <Spinner
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </React.Fragment>
    );
  }
  /* eslint-enable max-lines-per-function */
}

const form = reduxForm({
  form: 'EntryNewForm'
})(EntryNewForm);

const props = (state) => {
  return {
    fetching: state.entry.fetching,
    running: state.running.entry,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onCreateEntry: createEntry
};

export default connect(props, actions)(form);
