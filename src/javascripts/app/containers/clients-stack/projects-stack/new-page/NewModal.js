import NewForm from './NewForm';
import React from 'react';

const ProjectNewModal = (props) => {
  return (
    <div className="p-4">
      <h1 className="text-blue-500 pb-2">{'New Project'}</h1>
      <NewForm {...props} />
    </div>
  );
};

export default ProjectNewModal;
