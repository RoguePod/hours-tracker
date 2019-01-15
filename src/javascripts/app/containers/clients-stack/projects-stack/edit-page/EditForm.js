import * as Yup from 'yup';

import { Formik } from 'formik';
import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { selectProject } from 'javascripts/app/redux/clients';
import { updateProject } from 'javascripts/app/redux/projects';

class ProjectEditForm extends React.PureComponent {
  static propTypes = {
    onUpdateProject: PropTypes.func.isRequired,
    project: PropTypes.project
  }

  static defaultProps = {
    project: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(data, actions) {
    const { onUpdateProject, project } = this.props;

    onUpdateProject(project, data, actions);
  }

  render() {
    const { project } = this.props;

    if (!project) {
      return (
        <h1 className="text-center text-blue">
          {'Project Not Found'}
        </h1>
      );
    }

    const validationSchema = Yup.object().shape({
      name: Yup.string().required('Name is Required')
    });

    const initialValues = {
      active: project.active,
      billable: project.billable,
      name: project.name
    };

    return (
      <Formik
        component={ProjectForm}
        enableReinitialize
        initialValues={initialValues}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
      />
    );
  }
}

const props = (state, ownProps) => {
  const { match } = ownProps;

  return {
    project: selectProject(state, match.params.clientId, match.params.id)
  };
};

const actions = {
  onUpdateProject: updateProject
};

export default connect(props, actions)(ProjectEditForm);
