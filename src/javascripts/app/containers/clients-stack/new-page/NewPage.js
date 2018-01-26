import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';

import ClientForm from '../ClientForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createClient } from 'javascripts/app/redux/client';
import styles from './NewPage.scss';

const ClientNewPage = ({ fetching, onCreateClient }) => {
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
        {'New Client'}
      </Header>
      <Segment>
        <ClientForm
          initialValues={{ active: true }}
          onSaveClient={onCreateClient}
        />
      </Segment>
    </Segment>
  );
};

ClientNewPage.propTypes = {
  fetching: PropTypes.string,
  onCreateClient: PropTypes.func.isRequired
};

ClientNewPage.defaultProps = {
  fetching: null
};

const props = (state) => {
  return {
    fetching: state.client.fetching
  };
};

const actions = {
  onCreateClient: createClient
};

export default connect(props, actions)(ClientNewPage);
