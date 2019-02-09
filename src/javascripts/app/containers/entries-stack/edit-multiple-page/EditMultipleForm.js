import * as Yup from 'yup';

import EntryForm from '../EntryForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import { connect } from 'react-redux';
import { updateEntries } from 'javascripts/app/redux/entries';

const EntryEditMultipleForm = ({ fetching, onUpdateEntries, page }) => {
  const validationSchema = Yup.object().shape({
    startedAt: Yup.number()
      .parsedTime('Started is not a valid date/time')
      .positive('Started is Required'),
    stoppedAt: Yup.number()
      .parsedTime('Started is not a valid date/time')
      .positive('Stopped is Required'),
    timezone: Yup.string().required('Timezone is Required')
  });

  return (
    <>
      <Formik
        component={EntryForm}
        enableReinitialize
        onSubmit={onUpdateEntries}
        validationSchema={validationSchema}
      />
      <Spinner
        page={page}
        spinning={Boolean(fetching)}
        text={fetching}
      />
    </>
  );
};

EntryEditMultipleForm.propTypes = {
  fetching: PropTypes.string,
  onUpdateEntries: PropTypes.func.isRequired,
  page: PropTypes.bool
};

EntryEditMultipleForm.defaultProps = {
  fetching: null,
  page: false
};

const props = (state) => {
  return {
    fetching: state.entries.fetching
  };
};

const actions = {
  onUpdateEntries: updateEntries
};

export default connect(props, actions)(EntryEditMultipleForm);
