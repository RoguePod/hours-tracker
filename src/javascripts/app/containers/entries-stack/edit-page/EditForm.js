import * as Yup from 'yup';

import EntryForm from '../EntryForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

const QUERY = gql`
  mutation UserSignIn($email: String!, $password: String!) {
    userSignIn(email: $email, password: $password) {
      token
    }
  }
`;

const EntryEditForm = ({ page }) => {
  const { admin, running } = useSelector((_state) => ({
    admin: true,
    running: true
  }));
  const { id } = useParams();
  const { data, loading } = useQuery(QUERY, { variables: { id } });

  const _renderForm = (formikProps) => (
    <EntryForm {...formikProps} admin={admin} />
  );

  const validationRules = {
    startedAt: Yup.number()
      .parsedTime('Started is not a valid date/time')
      .required('Started is Required'),
    stoppedAt: Yup.number()
      .parsedTime('Stopped is not a valid date/time')
      .moreThan(Yup.ref('startedAt'), 'Must occur after Started'),
    timezone: Yup.string().required('Timezone is Required')
  };

  if (running && running.id !== id) {
    validationRules.stoppedAt = validationRules.stoppedAt.required(
      'Stopped is Required'
    );
  }

  const validationSchema = Yup.object().shape(validationRules);

  return (
    <>
      <Formik
        initialValues={data}
        key={id || 'empty'}
        // onSubmit={onUpdateEntry}
        render={_renderForm}
        validationSchema={validationSchema}
      />
      <Spinner page={page} spinning={loading} />
    </>
  );
};

EntryEditForm.propTypes = {
  page: PropTypes.bool.isRequired
};

EntryEditForm.defaultProps = {};

export default React.memo(EntryEditForm);
