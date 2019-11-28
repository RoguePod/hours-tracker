import * as Yup from 'yup';

import ClientForm from '../ClientForm';
import { Formik } from 'formik';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { addFlash } from 'javascripts/shared/redux/flashes';
import gql from 'graphql-tag';
import { serverErrors } from 'javascripts/globals';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

const MUTATION = gql`
  mutation ClientsUpdate($active: Boolean!, $id: ID!, $name: String!) {
    clientsUpdate(active: $active, id: $id, name: $name) {
      active
      id
      name
    }
  }
`;

const ClientNewForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [onSubmit] = useMutation(MUTATION);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required')
  });

  const _handleSubmit = (variables, actions) => {
    return onSubmit({ variables })
      .then(() => {
        dispatch(addFlash('Client has been created'));
        actions.setSubmitting(false);
        actions.resetForm();

        if (history.action === 'POP') {
          history.push('/clients');
        } else {
          history.goBack();
        }
      })
      .catch((error) => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  return (
    <Formik
      component={ClientForm}
      initialValues={{ active: true, name: '' }}
      onSubmit={_handleSubmit}
      validationSchema={validationSchema}
    />
  );
};

ClientNewForm.propTypes = {};

export default React.memo(ClientNewForm);
