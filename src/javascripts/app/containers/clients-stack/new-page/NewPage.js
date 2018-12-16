import ClientForm from '../ClientForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import { connect } from 'react-redux';
import { createClient } from 'javascripts/app/redux/client';

const ClientNewPage = ({ fetching, onCreateClient }) => {
  return (
    <div className="p-4">
      <h1 className="text-blue mb-2">
        {'New Client'}
      </h1>
      <div className="border rounded shadow mb-4 p-4">
        <ClientForm
          initialValues={{ active: true }}
          onSaveClient={onCreateClient}
        />
      </div>
      <Spinner
        page
        spinning={Boolean(fetching)}
        text={fetching}
      />
    </div>
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
