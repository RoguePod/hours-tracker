import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { getClient, updateClient } from 'javascripts/app/redux/client';

import ClientForm from '../ClientForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import styles from './EditPage.scss';

class ClientEditPage extends React.Component {
  static propTypes = {
    client: PropTypes.client,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetClient: PropTypes.func.isRequired,
    onUpdateClient: PropTypes.func.isRequired
  }

  static defaultProps = {
    client: null,
    fetching: null
  }

  componentDidMount() {
    const { match, onGetClient } = this.props;

    onGetClient(match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { client, fetching } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(client, nextProps.client)
    );
  }

  render() {
    const { client, fetching, onUpdateClient } = this.props;

    let initialValues = {};

    if (client) {
      initialValues = {
        active: client.active,
        name: client.name
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
        {client &&
          <div>
            <Header
              as="h1"
              color="blue"
            >
              {'Edit Client'}
            </Header>
            <Segment>
              <ClientForm
                initialValues={initialValues}
                onSaveClient={onUpdateClient}
              />
            </Segment>
          </div>}
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    client: state.client.client,
    fetching: state.client.fetching
  };
};

const actions = {
  onGetClient: getClient,
  onUpdateClient: updateClient
};

export default connect(props, actions)(ClientEditPage);
