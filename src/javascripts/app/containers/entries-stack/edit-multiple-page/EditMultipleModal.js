import EditMultipleForm from './EditMultipleForm';
import React from 'react';

const EntryEditMultipleModal = (props) => {
  return (
    <div className="p-4 min-h-200">
      <h1 className="text-blue pb-2">
        {'Edit Multiple Entries'}
      </h1>
      <EditMultipleForm {...props} />
    </div>
  );
};

export default EntryEditMultipleModal;
