import * as Yup from "yup";

import ForgotPasswordForm from "./ForgotPasswordForm";
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
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      email
    }
  }
`;

const ForgotPasswordPage = ({ onAddFlash }) => {
  const _handleSubmit = (onSubmit, variables, actions) => {
    onSubmit({ variables })
      .then(() => {
        onAddFlash("Reset Password Instructions sent!");
        history.push("/sign-in");
      })
      .catch(error => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid Email")
      .required("Email is Required")
  });

  const initialValues = {
    email: ""
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue pb-4">{"Forgot Password?"}</h2>

      <Mutation mutation={MUTATION}>
        {onSubmit => (
          <Formik
            initialValues={initialValues}
            onSubmit={(variables, actions) =>
              _handleSubmit(onSubmit, variables, actions)
            }
            render={ForgotPasswordForm}
            validationSchema={validationSchema}
          />
        )}
      </Mutation>
    </div>
  );
};

ForgotPasswordPage.propTypes = {
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
)(ForgotPasswordPage);
