import { getProject, updateProject } from 'javascripts/app/redux/project';

import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

class ProjectEditPage extends React.Component {
  static propTypes = {
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetProject: PropTypes.func.isRequired,
    onUpdateProject: PropTypes.func.isRequired,
    project: PropTypes.project
  }

  static defaultProps = {
    fetching: null,
    project: null
  }

  componentDidMount() {
    const { match, onGetProject } = this.props;

    onGetProject(match.params.clientId, match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { project, fetching } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(project, nextProps.project)
    );
  }

  render() {
    const { project, fetching, onUpdateProject } = this.props;

    if (!project) {
      return (
        <Spinner
          page
          spinning={Boolean(fetching)}
          text={fetching}
        />
      );
    }

    const initialValues = {
      active: project.active,
      billable: project.billable,
      name: project.name
    };

    return (
      <div className="p-4">
        <h1 className="text-blue mb-2">
          {'Edit Project'}
        </h1>
        <div className="border rounded shadow mb-4 p-4">
          <ProjectForm
            initialValues={initialValues}
            onSaveProject={onUpdateProject}
          />
        </div>
      </div>
    );
  }
}

const props = (state) => {
  return {
    fetching: state.project.fetching,
    project: state.project.project
  };
};

const actions = {
  onGetProject: getProject,
  onUpdateProject: updateProject
};

export default connect(props, actions)(ProjectEditPage);
