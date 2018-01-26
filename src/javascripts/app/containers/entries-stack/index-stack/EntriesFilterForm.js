import { Button, Form, Grid } from 'semantic-ui-react';
import {
  ClientField, ProjectField, UserField
} from 'javascripts/app/components';
import { DateField, FormError } from 'javascripts/shared/components';
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
          search: `?${toQuery(Object.assign({}, query, search))}`
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

  render() {
    const { error, handleSubmit, showAdmin } = this.props;

    return (
      <Form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <Grid
          columns="equal"
          stackable
        >
          <Grid.Row>
            <Grid.Column>
              <Field
                component={DateField}
                label="Start Date"
                name="startDate"
                time={false}
              />
            </Grid.Column>
            <Grid.Column>
              <Field
                component={DateField}
                label="End Date"
                name="endDate"
                time={false}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Field
                component={ClientField}
                label="Client"
                name="clientName"
                onClientChange={this._handleClientChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Field
                component={ProjectField}
                label="Project"
                name="projectName"
                nameClient="clientRef"
                nameProject="projectRef"
                onProjectChange={this._handleProjectChange}
              />
            </Grid.Column>
          </Grid.Row>
          {showAdmin &&
            <Grid.Row>
              <Grid.Column>
                <Field
                  component={UserField}
                  label="User"
                  name="userName"
                  onUserChange={this._handleUserChange}
                />
              </Grid.Column>
            </Grid.Row>}
          <Grid.Row>
            <Grid.Column>
              <Form.Button
                color="blue"
                fluid
                size="big"
              >
                {'Filter'}
              </Form.Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                fluid
                onClick={this._handleClear}
                size="big"
              >
                {'Clear'}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'EntriesFilterForm'
})(EntriesFilterForm);
