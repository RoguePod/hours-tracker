import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import { connect } from 'react-redux';
import { createProject } from 'javascripts/app/redux/project';
import { getClient } from 'javascripts/app/redux/client';

class ProjectNewPage extends React.PureComponent {
  static propTypes = {
    client: PropTypes.client,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onCreateProject: PropTypes.func.isRequired,
    onGetClient: PropTypes.func.isRequired
  }

  static defaultProps = {
    client: null,
    fetching: null
  }

  componentDidMount() {
    const { match, onGetClient } = this.props;

    onGetClient(match.params.clientId);
  }

  render() {
    const { client, fetching, onCreateProject } = this.props;

    if (!client) {
      return (
        <Spinner
          page
          spinning
          text={fetching}
        />
      );
    }

    return (
      <div className="p-4">
        <h1 className="text-blue mb-2">
          {'New Project'}
        </h1>
        <div className="border rounded shadow mb-4 p-4">
          <ProjectForm
            client={client}
            initialValues={{ active: true, billable: true }}
            onSaveProject={onCreateProject}
          />
        </div>
      </div>
    );
  }
}

const props = (state) => {
  return {
    client: state.client.client,
    fetching: state.client.fetching || state.project.fetching
  };
};

const actions = {
  onCreateProject: createProject,
  onGetClient: getClient
};

export default connect(props, actions)(ProjectNewPage);
