import EditForm from './EditForm';
import React from 'react';

const EntryEditModal = (props) => {
  return (
    <div className="p-4 min-h-200">
      <h1 className="text-blue-500 pb-2">{'Edit Entry'}</h1>
      <EditForm {...props} />
    </div>
  );
};

export default EntryEditModal;
