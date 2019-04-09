import * as Yup from "yup";

import ClientForm from "../ClientForm";
import { Formik } from "formik";
import { Mutation } from "react-apollo";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { addFlash } from "javascripts/shared/redux/flashes";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { history } from "javascripts/app/redux/store";
import { serverErrors } from "javascripts/globals";

const MUTATION = gql`
  mutation ClientsUpdate($active: Boolean!, $id: ID!, $name: String!) {
    clientsUpdate(active: $active, id: $id, name: $name) {
      active
      id
      name
    }
  }
`;

const ClientNewForm = ({ onAddFlash }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required")
  });

  const _handleSubmit = (onSubmit, variables, actions) => {
    onSubmit({ variables })
      .then(() => {
        onAddFlash("Client has been created");
        actions.setSubmitting(false);
        actions.resetForm();

        if (history.action === "POP") {
          history.push("/clients");
        } else {
          history.goBack();
        }
      })
      .catch(error => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  return (
    <Mutation mutation={MUTATION}>
      {onSubmit => (
        <Formik
          component={ClientForm}
          initialValues={{ active: true, name: "" }}
          onSubmit={(variables, actions) =>
            _handleSubmit(onSubmit, variables, actions)
          }
          validationSchema={validationSchema}
        />
      )}
    </Mutation>
  );
};

ClientNewForm.propTypes = {
  onAddFlash: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onAddFlash: addFlash
};

export default connect(
  props,
  actions
)(ClientNewForm);
