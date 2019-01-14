import { FieldError, Label } from 'javascripts/shared/components';
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

class ProjectField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    clientRef: PropTypes.docRef,
    clients: PropTypes.docRef.isRequired,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    nameClient: PropTypes.string.isRequired,
    nameProject: PropTypes.string.isRequired,
    onProjectChange: PropTypes.func.isRequired,
    projectRef: PropTypes.docRef,
    ready: PropTypes.bool.isRequired,
    required: PropTypes.bool,
    results: PropTypes.shape({
      clientName: PropTypes.shape({ name: PropTypes.string })
    }).isRequired
  }

  static defaultProps = {
    className: null,
    clientRef: null,
    disabled: false,
    id: null,
    label: null,
    projectRef: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      id: props.id || _uniqueId('input_')
    };

    this._handleChange = this._handleChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._findValue = this._findValue.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      if (id) {
        this.setState({ id });
      } else if (!id && prevProps.id) {
        this.setState({ id: _uniqueId('input_') });
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  timeout = null

  _handleChange(project) {
    const {
      field: { name }, form: { setFieldValue }, onProjectChange
    } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onProjectChange(project.clientRef, project.projectRef);
    setFieldValue(name, '');
    this.setState({ focused: false });
  }

  _handleBlur() {
    const {
      field: { name, value }, form: { setFieldValue }, onProjectChange
    } = this.props;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        onProjectChange(null, null);
      }
      setFieldValue(name, '');
      this.setState({ focused: false });
    }, 250);
  }

  _handleFocus(event) {
    const { field: { name }, form: { setFieldValue } } = this.props;

    const { target } = event;

    setFieldValue(name, this._findValue());

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
    /* eslint-disable no-unused-vars */
    const {
      className, clients, clientRef, disabled, field,
      form: { errors, isSubmitting, touched },
      label, nameClient, nameProject, onProjectChange, projectRef, ready,
      required, results, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */
    const { focused, id } = this.state;

    const hasError = errors[field.name] && touched[field.name];

    let { value } = field;

    if (!focused) {
      value = this._findValue();
    }

    const keys = Object.keys(results);

    const inputClassName = cx(
      'appearance-none border w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !hasError,
        'border-red': hasError,
        'focus:border-blue-light': !hasError,
        'focus:border-red': hasError,
        'rounded': keys.length === 0,
        'rounded-t': keys.length > 0
      },
      className
    );

    return (
      <div className="relative">
        {label && label.length > 0 &&
          <Label
            error={hasError}
            htmlFor={id}
            required={required}
          >
            {label}
          </Label>}
        <input
          {...field}
          {...rest}
          className={inputClassName}
          disabled={!ready || disabled || isSubmitting}
          id={id}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          value={value}
        />
        <ProjectsDropdown
          clients={results}
          onProjectClick={this._handleChange}
        />
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </div>
    );
  }
}

const props = (state, ownProps) => {
  const {
    field: { value }, form: { values }, nameClient, nameProject
  } = ownProps;

  return {
    clientRef: values[nameClient],
    clients: selectClientsByKey(state),
    projectRef: values[nameProject],
    ready: state.clients.ready,
    results: selectQueriedProjects(state, value)
  };
};

const actions = {};

export default connect(props, actions)(ProjectField);
