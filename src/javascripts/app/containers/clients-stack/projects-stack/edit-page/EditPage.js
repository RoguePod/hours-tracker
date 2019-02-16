import EditForm from "./EditForm";
import React from "react";

const ProjectEditPage = props => {
  return (
    <div className="relative p-4">
      <h1 className="text-blue">{"Edit Project"}</h1>
      <div className="shadow rounded border p-4">
        <EditForm {...props} page />
      </div>
    </div>
  );
};

export default ProjectEditPage;
