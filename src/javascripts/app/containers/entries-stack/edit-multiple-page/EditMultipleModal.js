import * as Yup from 'yup';

import EditMultipleForm from './EditMultipleForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import { connect } from 'react-redux';
import { selectTimezone } from 'javascripts/app/redux/app';
import { updateEntries } from 'javascripts/app/redux/entries';

/* eslint-disable react/jsx-no-bind */
const EntryEditMultipleModal = ({ fetching, onUpdateEntries, timezone }) => {
  const initialSchema = {
    clientId: null,
    description: '',
    projectId: null,
    startedAt: null,
    stoppedAt: null,
    timezone: '',
    update: {
      description: false,
      projectId: false,
      startedAt: false,
      stoppedAt: false,
      timezone: false
    }
  };

  const validationSchema = Yup.object().shape({
    startedAt: Yup.number()
      .when('update.startedAt', {
        is: true,
        otherwise: Yup.number().nullable(),
        then: Yup.number()
          .parsedTime('Started is not a valid date/time')
          .required('Started is Required')
      }),
    stoppedAt: Yup.number()
      .when('update.stoppedAt', {
        is: true,
        otherwise: Yup.number().nullable(),
        then: Yup.number()
          .parsedTime('Stopped is not a valid date/time')
          .required('Stopped is Required')
      })
      .when(['update.startedAt', 'update.stoppedAt'], {
        is: true,
        otherwise: Yup.number().nullable(),
        then: Yup.number().moreThan(
          Yup.ref('startedAt'), 'Must occur after Started'
        )
      }),
    timezone: Yup.string()
      .when('update.timezone', {
        is: true,
        otherwise: Yup.string().nullable(),
        then: Yup.string().required('Timezone is Required')
      })
  });

  const renderForm = (formProps) => {
    return (
      <EditMultipleForm
        {...formProps}
        timezone={timezone}
      />
    );
  };

  return (
    <div className="p-4 min-h-200">
      <h1 className="text-blue pb-2">
        {'Edit Multiple Entries'}
      </h1>
      <Formik
        enableReinitialize
        initialSchema={initialSchema}
        onSubmit={onUpdateEntries}
        render={renderForm}
        validationSchema={validationSchema}
      />
      <Spinner
        spinning={Boolean(fetching)}
        text={fetching}
      />
    </div>
  );
};
/* eslint-enable react/jsx-no-bind */

EntryEditMultipleModal.propTypes = {
  fetching: PropTypes.string,
  onUpdateEntries: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired
};

EntryEditMultipleModal.defaultProps = {
  fetching: null
};

const props = (state) => {
  return {
    fetching: state.entry.fetching,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onUpdateEntries: updateEntries
};

export default connect(props, actions)(EntryEditMultipleModal);
