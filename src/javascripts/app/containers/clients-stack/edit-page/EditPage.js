import EditForm from "./EditForm";
import React from "react";

const ClientEditPage = props => {
  return (
    <div className="relative p-4">
      <h1 className="text-blue">{"Edit Client"}</h1>
      <div className="shadow rounded border p-4">
        <EditForm {...props} page />
      </div>
    </div>
  );
};

export default ClientEditPage;
