import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { getProject, updateProject } from 'javascripts/app/redux/project';

import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import styles from './EditPage.scss';

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

    let initialValues = {};

    if (project) {
      initialValues = {
        active: project.active,
        billable: project.billable,
        name: project.name
      };
    }

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Dimmer
          active={Boolean(fetching)}
          inverted
        >
          <Loader>
            {fetching}
          </Loader>
        </Dimmer>
        {project &&
          <div>
            <Header
              as="h1"
              color="blue"
            >
              {'Edit Project'}
            </Header>
            <Segment>
              <ProjectForm
                initialValues={initialValues}
                onSaveProject={onUpdateProject}
              />
            </Segment>
          </div>}
      </Segment>
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
