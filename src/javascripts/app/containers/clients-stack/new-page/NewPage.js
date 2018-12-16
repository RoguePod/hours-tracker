import ClientForm from '../ClientForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createClient } from 'javascripts/app/redux/client';

const ClientNewPage = ({ onCreateClient }) => {
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
    </div>
  );
};

ClientNewPage.propTypes = {
  onCreateClient: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onCreateClient: createClient
};

export default connect(props, actions)(ClientNewPage);
