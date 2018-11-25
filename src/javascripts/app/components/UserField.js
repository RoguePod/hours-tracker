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
import { formValueSelector } from 'redux-form';

class UserField extends React.Component {
  static propTypes = {
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
    onUserChange: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(PropTypes.user).isRequired,
    userRef: PropTypes.docRef,
    users: PropTypes.docRef.isRequired
  }

  static defaultProps = {
    id: null,
    label: null,
    userRef: null
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

  _handleChange(user) {
    const { input: { onChange }, onUserChange } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onUserChange(user.userRef);
    onChange('');
    this.setState({ focused: false });
  }

  _handleBlur() {
    const { input: { onChange, value }, onUserChange } = this.props;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        onUserChange(null);
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
      'appearance-none border w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !isError,
        'border-red': isError,
        'focus:border-blue-light': !isError,
        'focus:border-red': isError,
        'rounded': results.length === 0,
        'rounded-t': results.length > 0
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
        <UsersDropdown
          onUserClick={this._handleChange}
          users={results}
        />
        <FieldError {...meta} />
      </div>
    );
  }
}

const props = (state, ownProps) => {
  const { input: { name }, meta: { form }, nameUser } = ownProps;

  const formSelector = formValueSelector(form);
  const query        = formSelector(state, name);

  return {
    ready: state.users.ready,
    results: selectQueriedUsers(state, query),
    userRef: formSelector(state, nameUser),
    users: selectUsersByKey(state)
  };
};

const actions = {};

export default connect(props, actions)(UserField);
