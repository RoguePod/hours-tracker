import NewForm from './NewForm';
import React from 'react';

const ClientNewModal = (props) => {
  return (
    <div className="p-4 min-h-200">
      <h1 className="text-blue pb-2">{'New Client'}</h1>
      <NewForm {...props} />
    </div>
  );
};

export default ClientNewModal;
