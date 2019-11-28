import * as Yup from 'yup';

import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import ClientForm from '../ClientForm';
import { Formik } from 'formik';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _get from 'lodash/get';
import { addFlash } from 'javascripts/shared/redux/flashes';
import gql from 'graphql-tag';
import { serverErrors } from 'javascripts/globals';
import { useDispatch } from 'react-redux';

const QUERY = gql`
  query ClientsShow($id: ID!) {
    clientsShow(id: $id) {
      active
      id
      name
    }
  }
`;

const MUTATION = gql`
  mutation ClientsUpdate($active: Boolean!, $id: ID!, $name: String!) {
    clientsUpdate(active: $active, id: $id, name: $name) {
      active
      id
      name
    }
  }
`;

const ClientEditForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [onSubmit] = useMutation(MUTATION);
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const client = _get(data, 'clientsShow');

  if (!client) {
    if (loading) {
      return <Spinner page spinning={loading} text="Loading Client..." />;
    }

    return <h1 className="text-center text-blue">{'Client Not Found'}</h1>;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required')
  });

  const _handleSubmit = (variables, actions) => {
    return onSubmit({ variables })
      .then(() => {
        dispatch(addFlash('Client has been updated'));
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
      initialValues={client}
      key={client ? client.id : 'empty'}
      onSubmit={_handleSubmit}
      validationSchema={validationSchema}
    />
  );
};

ClientEditForm.propTypes = {};

ClientEditForm.defaultProps = {};

export default React.memo(ClientEditForm);
