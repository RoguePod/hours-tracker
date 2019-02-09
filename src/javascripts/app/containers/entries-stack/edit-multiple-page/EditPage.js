import EditForm from './EditForm';
import React from 'react';

const EntryEditPage = (props) => {
  return (
    <div className="relative p-4">
      <h1 className="text-blue">
        {'Edit Entry'}
      </h1>
      <div className="shadow rounded border p-4">
        <EditForm
          {...props}
          page
        />
      </div>
    </div>
  );
};

export default EntryEditPage;
