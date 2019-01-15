import { FieldError, Label } from 'javascripts/shared/components';
import {
  selectQueriedUsers,
  selectUsersByKey
} from 'javascripts/app/redux/users';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UsersDropdown from './UsersDropdown';
import _get from 'lodash/get';
import _uniqueId from 'lodash/uniqueId';
import { connect } from 'react-redux';
import cx from 'classnames';

class UserField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    nameUser: PropTypes.string.isRequired,
    onUserChange: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired,
    required: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.user).isRequired,
    userRef: PropTypes.docRef,
    users: PropTypes.docRef.isRequired
  }

  static defaultProps = {
    className: null,
    disabled: false,
    id: null,
    label: null,
    required: false,
    userRef: null
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

  state = {
    focused: false
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

  _handleChange(user) {
    const {
      field: { name }, form: { setFieldValue }, onUserChange
    } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onUserChange(user.userRef);
    setFieldValue(name, '');
    this.setState({ focused: false });
  }

  _handleBlur() {
    const {
      field: { name, value }, form: { setFieldValue }, onUserChange
    } = this.props;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        onUserChange(null);
      }
      setFieldValue(name, '');
      this.setState({ focused: false });
    }, 250);
  }

  _handleFocus({ target }) {
    const { field: { name }, form: { setFieldValue } } = this.props;

    setFieldValue(name, this._findValue());

    this.setState({ focused: true }, () => {
      setTimeout(() => {
        target.select();
      }, 1);
    });
  }

  _findValue() {
    const { users, userRef, ready } = this.props;

    if (!ready) {
      return '';
    }

    const user = _get(users, _get(userRef, 'id'));

    if (user) {
      return user.name;
    }

    return '';
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className, disabled, field,
      form: { errors, isSubmitting, touched },
      label, nameUser, onUserChange, ready, required, results, userRef,
      users, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */
    const { focused, id } = this.state;

    const hasError = errors[field.name] && touched[field.name];

    let { value } = field;

    if (!focused) {
      value = this._findValue();
    }

    const inputClassName = cx(
      'appearance-none border w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !hasError,
        'border-red': hasError,
        'focus:border-blue-light': !hasError,
        'focus:border-red': hasError,
        'rounded': results.length === 0,
        'rounded-t': results.length > 0
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
        <UsersDropdown
          onUserClick={this._handleChange}
          users={results}
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
  const { field: { value }, form: { values }, nameUser } = ownProps;

  return {
    ready: state.users.ready,
    results: selectQueriedUsers(state, value),
    userRef: values[nameUser],
    users: selectUsersByKey(state)
  };
};

const actions = {};

export default connect(props, actions)(UserField);
