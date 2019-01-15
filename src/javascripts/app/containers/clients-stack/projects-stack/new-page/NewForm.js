import * as Yup from 'yup';

import { Formik } from 'formik';
import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createProject } from 'javascripts/app/redux/projects';
import { selectClient } from 'javascripts/app/redux/clients';

class ProjectNewForm extends React.PureComponent {
  static propTypes = {
    client: PropTypes.client,
    onCreateProject: PropTypes.func.isRequired
  }

  static defaultProps = {
    client: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(data, actions) {
    const { client, onCreateProject } = this.props;

    onCreateProject(client, data, actions);
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

    return (
      <Formik
        component={ProjectForm}
        enableReinitialize
        initialValues={{ active: true, billable: true, name: '' }}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
      />
    );
  }
}

const props = (state, ownProps) => {
  return {
    client: selectClient(state, ownProps.match.params.clientId)
  };
};

const actions = {
  onCreateProject: createProject
};

export default connect(props, actions)(ProjectNewForm);
