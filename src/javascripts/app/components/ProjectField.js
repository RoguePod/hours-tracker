import { FieldError, FieldWarning } from 'javascripts/shared/components';
import { Form, Search } from 'semantic-ui-react';
import {
  selectClientsByKey, selectQueriedProjects
} from 'javascripts/app/redux/clients';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

class ProjectField extends React.Component {
  static propTypes = {
    clientRef: PropTypes.docRef,
    clients: PropTypes.docRef.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string
    }).isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
      errpr: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired,
    nameClient: PropTypes.string.isRequired,
    nameProject: PropTypes.string.isRequired,
    onProjectChange: PropTypes.func.isRequired,
    projectRef: PropTypes.docRef,
    ready: PropTypes.bool.isRequired,
    results: PropTypes.shape({
      clientName: PropTypes.shape({ name: PropTypes.string })
    }).isRequired
  }

  static defaultProps = {
    clientRef: null,
    label: null,
    projectRef: null
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._handleSearchChange = this._handleSearchChange.bind(this);
    this._handleRenderResult = this._handleRenderResult.bind(this);
    this._findValue = this._findValue.bind(this);
  }

  state = {
    focused: false
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  timeout = null

  _handleChange(event, data) {
    const { input: { onChange }, onProjectChange } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onProjectChange(
      data.result['data-client-ref'],
      data.result['data-project-ref']
    );
    onChange('');
    this.setState({ focused: false });
  }

  _handleSearchChange(event, { value }) {
    const { input: { onChange } } = this.props;

    onChange(value);
  }

  _handleRenderResult({ name }) {
    return (
      <div>
        {name}
      </div>
    );
  }

  _handleBlur(event, { value }) {
    const { input: { onChange }, onProjectChange } = this.props;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        onProjectChange(null, null);
      }
      onChange('');
      this.setState({ focused: false });
    }, 250);
  }

  _handleFocus(event) {
    const { input: { onChange } } = this.props;

    const { target } = event;

    onChange(this._findValue());

    this.setState({ focused: true }, () => {
      setTimeout(() => {
        target.select();
      }, 1);
    });
  }

  _findValue() {
    const { clients, clientRef, projectRef, ready } = this.props;

    if (!ready) {
      return '';
    }

    const clientId  = _get(clientRef, 'id');
    const projectId = _get(projectRef, 'id');
    const client    = _get(clients, clientId);
    const project   = _get(clients, `${clientId}.projects.${projectId}`);

    if (client && project) {
      return `${client.name} - ${project.name}`;
    }

    return '';
  }

  render() {
    const { input, label, meta, ready, results } = this.props;
    const { focused } = this.state;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    let { value } = input;

    if (!focused) {
      value = this._findValue();
    }

    return (
      <Form.Field
        error={isError}
      >
        {label &&
          <label>
            {label}
          </label>}
        <Search
          {...input}
          category
          disabled={!ready}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          onResultSelect={this._handleChange}
          onSearchChange={this._handleSearchChange}
          resultRenderer={this._handleRenderResult}
          results={results}
          value={value}
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </Form.Field>
    );
  }
}

const props = (state, ownProps) => {
  const { input: { name }, meta: { form }, nameClient, nameProject } = ownProps;

  const formSelector = formValueSelector(form);
  const query        = formSelector(state, name);

  return {
    clientRef: formSelector(state, nameClient),
    clients: selectClientsByKey(state),
    projectRef: formSelector(state, nameProject),
    ready: state.clients.ready,
    results: selectQueriedProjects(state, query)
  };
};

const actions = {};

export default connect(props, actions)(ProjectField);
