import * as Yup from 'yup';

import { selectClient, updateClient } from 'javascripts/app/redux/clients';

import ClientForm from '../ClientForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';

class ClientEditForm extends React.PureComponent {
  static propTypes = {
    client: PropTypes.client,
    onUpdateClient: PropTypes.func.isRequired
  }

  static defaultProps = {
    client: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(data, actions) {
    const { client, onUpdateClient } = this.props;

    onUpdateClient(client, data, actions);
  }

  render() {
    const { client } = this.props;

    if (!client) {
      return (
        <h1 className="text-center text-blue">
          {'Client Not Found'}
        </h1>
      );
    }

    const validationSchema = Yup.object().shape({
      name: Yup.string().required('Name is Required')
    });

    const initialValues = {
      active: client.active,
      name: client.name
    };

    return (
      <Formik
        component={ClientForm}
        enableReinitialize
        initialValues={initialValues}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
      />
    );
  }
}

const props = (state, ownProps) => {
  return {
    client: selectClient(state, ownProps.match.params.id)
  };
};

const actions = {
  onUpdateClient: updateClient
};

export default connect(props, actions)(ClientEditForm);
