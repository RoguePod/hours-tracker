import NewForm from './NewForm';
import React from 'react';

const EntryNewModal = (props) => {
  return (
    <div className="p-4">
      <h1 className="text-blue pb-2">
        {'New Entry'}
      </h1>
      <NewForm {...props} />
    </div>
  );
};

export default EntryNewModal;
