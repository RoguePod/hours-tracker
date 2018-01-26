import { FieldError, FieldWarning } from 'javascripts/shared/components';
import { Form, Search } from 'semantic-ui-react';
import {
  selectQueriedUsers, selectUsersByKey
} from 'javascripts/app/redux/users';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

class UserField extends React.Component {
  static propTypes = {
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
    label: null,
    userRef: null
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
    const { input: { onChange }, onUserChange } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onUserChange(data.result['data-user-ref']);
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
    const { input: { onChange }, onUserChange } = this.props;

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
      target.select();
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
  const formSelector = formValueSelector(ownProps.meta.form);
  const query        = formSelector(state, 'userName');

  return {
    ready: state.users.ready,
    results: selectQueriedUsers(state, query),
    userRef: formSelector(state, 'userRef'),
    users: selectUsersByKey(state)
  };
};

const actions = {};

export default connect(props, actions)(UserField);
