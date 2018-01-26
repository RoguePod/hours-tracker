import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';

import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createProject } from 'javascripts/app/redux/project';
import { getClient } from 'javascripts/app/redux/client';
import styles from './NewPage.scss';

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
      return null;
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
        <Header
          as="h1"
          color="blue"
        >
          {'New Project'}
        </Header>
        <Segment>
          <ProjectForm
            client={client}
            initialValues={{ active: true, billable: true }}
            onSaveProject={onCreateProject}
          />
        </Segment>
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    client: state.client.client,
    fetching: state.project.fetching
  };
};

const actions = {
  onCreateProject: createProject,
  onGetClient: getClient
};

export default connect(props, actions)(ProjectNewPage);
