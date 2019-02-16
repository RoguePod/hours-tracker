import NewForm from "./NewForm";
import React from "react";

const ProjectNewPage = props => {
  return (
    <div className="relative p-4">
      <h1 className="text-blue">{"New Project"}</h1>
      <div className="shadow rounded border p-4">
        <NewForm {...props} page />
      </div>
    </div>
  );
};

export default ProjectNewPage;
