import {
  Button,
  DateField,
  FormError
} from 'javascripts/shared/components';
import {
  ClientField,
  ProjectField,
  UserField
} from 'javascripts/app/components';
import { Field, reduxForm } from 'redux-form';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _compact from 'lodash/compact';
import _get from 'lodash/get';
import { history } from 'javascripts/app/redux/store';
import { toQuery } from 'javascripts/globals';

class EntriesFilterForm extends React.Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    location: PropTypes.routerLocation.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    showAdmin: PropTypes.bool.isRequired
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
    this._handleClientChange = this._handleClientChange.bind(this);
    this._handleUserChange = this._handleUserChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleClear = this._handleClear.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleSubmit(data) {
    const { showAdmin, location, query } = this.props;

    const values = _compact(Object.values(data));

    return new Promise((resolve) => {
      if (values.length > 0) {
        const search = {
          clientRef: _get(data, 'clientRef.path', ''),
          endDate: _get(data, 'endDate', ''),
          projectRef: _get(data, 'projectRef.path', ''),
          startDate: _get(data, 'startDate', '')
        };

        if (showAdmin) {
          search.userRef = _get(data, 'userRef.path', '');
        }

        const route = {
          ...location,
          search: `?${toQuery({ ...query, ...search })}`
        };

        history.replace(route);
      } else {
        this._handleClear();
      }

      resolve();
    });
  }

  _handleClear() {
    /* eslint-disable no-unused-vars */
    const { location: { search, ...rest } } = this.props;
    /* eslint-enable no-unused-vars */

    history.replace(rest);
  }

  _handleProjectChange(clientRef, projectRef) {
    const { change } = this.props;

    change('clientRef', clientRef);
    change('projectRef', projectRef);
  }

  _handleClientChange(clientRef) {
    const { change } = this.props;

    change('clientRef', clientRef);
  }

  _handleUserChange(userRef) {
    const { change } = this.props;

    change('userRef', userRef);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { error, handleSubmit, showAdmin } = this.props;

    return (
      <form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={DateField}
              label="Start Date"
              name="startDate"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={DateField}
              label="End Date"
              name="endDate"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={ClientField}
              label="Client"
              name="clientName"
              nameClient="clientRef"
              onClientChange={this._handleClientChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={ProjectField}
              label="Project"
              name="projectName"
              nameClient="clientRef"
              nameProject="projectRef"
              onProjectChange={this._handleProjectChange}
            />
          </div>
        </div>
        {showAdmin &&
          <div className="mb-4">
            <Field
              component={UserField}
              label="User"
              name="userName"
              nameUser="userRef"
              onUserChange={this._handleUserChange}
            />
          </div>}
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 md:mb-0 mb-4">
            <Button
              className="py-2 w-full"
              color="green"
              type="submit"
            >
              {'Filter'}
            </Button>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <Button
              className="py-2 w-full"
              onClick={this._handleClear}
              type="button"
            >
              {'Clear'}
            </Button>
          </div>
        </div>
      </form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default reduxForm({
  enableReinitialize: true,
  form: 'EntriesFilterForm'
})(EntriesFilterForm);
