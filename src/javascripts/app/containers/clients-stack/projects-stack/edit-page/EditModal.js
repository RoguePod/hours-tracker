import EditForm from './EditForm';
import React from 'react';

const ProjectEditModal = (props) => {
  return (
    <div className="p-4 min-h-200">
      <h1 className="text-blue pb-2">
        {'Edit Project'}
      </h1>
      <EditForm {...props} />
    </div>
  );
};

export default ProjectEditModal;
