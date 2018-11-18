import { FieldError, FieldWarning, Label } from 'javascripts/shared/components';
import {
  selectClientsByKey,
  selectQueriedProjects
} from 'javascripts/app/redux/clients';

import ProjectsDropdown from './ProjectsDropdown';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _uniqueId from 'lodash/uniqueId';
import { connect } from 'react-redux';
import cx from 'classnames';
import { formValueSelector } from 'redux-form';

class ProjectField extends React.Component {
  static propTypes = {
    clientRef: PropTypes.docRef,
    clients: PropTypes.docRef.isRequired,
    id: PropTypes.string,
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
    id: null,
    label: null,
    projectRef: null
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
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

  _handleChange(project) {
    const { input: { onChange }, onProjectChange } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onProjectChange(project.clientRef, project.projectRef);
    onChange('');
    this.setState({ focused: false });
  }

  _handleBlur() {
    const { input: { onChange, value }, onProjectChange } = this.props;

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
    const { className, id, input, label, meta, ready, results } = this.props;
    const { focused } = this.state;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    let { value } = input;

    if (!focused) {
      value = this._findValue();
    }

    const inputClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none',
      {
        'border-grey-light': !isError,
        'border-red': isError,
        'focus:border-blue-light': !isError,
        'focus:border-red': isError
      },
      className
    );

    const inputId = id ? id : _uniqueId('input_');

    return (
      <div className="relative">
        {label &&
          <Label
            error={isError}
            htmlFor={inputId}
          >
            {label}
          </Label>}
        <input
          {...input}
          className={inputClassName}
          disabled={!ready}
          id={inputId}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          value={value}
        />
        <ProjectsDropdown
          clients={results}
          onProjectClick={this._handleChange}
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </div>
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
