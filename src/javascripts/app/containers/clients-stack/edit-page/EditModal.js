import EditForm from './EditForm';
import React from 'react';

const ClientEditModal = (props) => {
  return (
    <div className="p-4 min-h-200">
      <h1 className="text-blue pb-2">
        {'Edit Client'}
      </h1>
      <EditForm {...props} />
    </div>
  );
};

export default ClientEditModal;
