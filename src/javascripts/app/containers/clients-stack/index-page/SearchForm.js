import {
  Button,
  FormError,
  InputField
} from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';
import { fromQuery, toQuery } from 'javascripts/globals';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _compact from 'lodash/compact';
import { history } from 'javascripts/app/redux/store';

class ClientsSearchForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    location: PropTypes.routerLocation.isRequired,
    submitting: PropTypes.bool.isRequired
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleClear = this._handleClear.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleSubmit(data) {
    const { location } = this.props;
    const { search } = location;

    const values = _compact(Object.values(data));

    return new Promise((resolve) => {
      if (values.length > 0) {
        const route = {
          ...location,
          search: toQuery({ ...fromQuery(search), ...data, page: 1 })
        };

        history.push(route);
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

  render() {
    const { error, handleSubmit, submitting } = this.props;

    return (
      <form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <div className="mb-4">
          <Field
            autoCapitalize="sentences"
            autoCorrect="on"
            autoFocus
            component={InputField}
            disabled={submitting}
            label="Search"
            name="search"
            placeholder="Client/Project Name..."
          />
        </div>
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
}

export default reduxForm({
  form: 'ClientsSearchForm'
})(ClientsSearchForm);
