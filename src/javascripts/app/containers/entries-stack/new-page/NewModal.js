import { Modal } from 'javascripts/shared/components';
import NewForm from './NewForm';
import React from 'react';
import { history } from 'javascripts/app/redux/store';

const EntryNewModal = (props) => {
  return (
    <Modal
      onClose={history.goBack}
      open
    >
      <div className="p-4">
        <h1 className="text-blue pb-2">
          {'New Entry'}
        </h1>
        <NewForm {...props} />
      </div>
    </Modal>
  );
};

export default EntryNewModal;
