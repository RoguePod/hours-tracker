import EditForm from './EditForm';
import { Modal } from 'javascripts/shared/components';
import React from 'react';
import { history } from 'javascripts/app/redux/store';

const EntryEditModal = (props) => {
  return (
    <Modal
      onClose={history.goBack}
      open
    >
      <div className="p-4 min-h-300">
        <h1 className="text-blue pb-2">
          {'Edit Entry'}
        </h1>
        <EditForm {...props} />
      </div>
    </Modal>
  );
};

export default EntryEditModal;
