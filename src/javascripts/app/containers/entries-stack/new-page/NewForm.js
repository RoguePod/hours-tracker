import * as Yup from 'yup';

import EntryForm from '../EntryForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import { connect } from 'react-redux';

const EntryNewForm = ({
  admin,
  fetching,
  onCreateEntry,
  page,
  running,
  timezone,
  user
}) => {
  const _renderForm = (props) => {
    return <EntryForm {...props} admin={admin} />;
  };

  const validationRules = {
    startedAt: Yup.number()
      .parsedTime('Started is not a valid date/time')
      .required('Started is Required'),
    stoppedAt: Yup.number()
      .parsedTime('Stopped is not a valid date/time')
      .moreThan(Yup.ref('startedAt'), 'Must occur after Started'),
    timezone: Yup.string().required('Timezone is Required')
  };

  if (running) {
    validationRules.stoppedAt = validationRules.stoppedAt.required(
      'Stopped is Required'
    );
  }

  const validationSchema = Yup.object().shape(validationRules);

  const initialValues = {
    timezone
  };

  if (admin) {
    initialValues.userId = user.id;
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onCreateEntry}
        render={_renderForm}
        validationSchema={validationSchema}
      />
      <Spinner page={page} spinning={Boolean(fetching)} text={fetching} />
    </>
  );
};

EntryNewForm.propTypes = {
  admin: PropTypes.bool.isRequired,
  fetching: PropTypes.string,
  onCreateEntry: PropTypes.func.isRequired,
  page: PropTypes.bool,
  running: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
  user: PropTypes.user.isRequired
};

EntryNewForm.defaultProps = {
  fetching: null,
  page: false
};

const props = (state) => {
  return {
    // admin: selectAdmin(state),
    // fetching: state.entry.fetching,
    // running: Boolean(state.running.entry),
    // timezone: selectTimezone(state),
    // user: state.app.user
  };
};

const actions = {};

export default connect(props, actions)(EntryNewForm);
