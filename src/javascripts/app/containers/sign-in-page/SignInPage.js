import * as Yup from "yup";

import { Formik } from "formik";
import { Mutation } from "react-apollo";
import PropTypes from "javascripts/prop-types";
import React from "react";
import SignInForm from "./SignInForm";
import { addFlash } from "javascripts/shared/redux/flashes";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { serverErrors } from "javascripts/globals";
import { signInUser } from "javascripts/app/redux/app";

const MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        email
        name
        role
        timezone
      }
    }
  }
`;

const SignInPage = ({ onAddFlash, onSignInUser }) => {
  const _handleSubmit = (onSubmit, variables, actions) => {
    onSubmit({ variables })
      .then(({ data: { signIn: { user, token } } }) => {
        onSignInUser(user, token);
        onAddFlash("Sign In Successful!");
      })
      .catch(error => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  const initialValues = {
    email: "",
    password: ""
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid Email")
      .required("Email is Required"),
    password: Yup.string().required("Password is Required")
  });

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue pb-4">{"Sign In"}</h2>

      <Mutation mutation={MUTATION}>
        {onSubmit => (
          <Formik
            initialValues={initialValues}
            onSubmit={(variables, actions) =>
              _handleSubmit(onSubmit, variables, actions)
            }
            render={SignInForm}
            validationSchema={validationSchema}
          />
        )}
      </Mutation>
    </div>
  );
};

SignInPage.propTypes = {
  onAddFlash: PropTypes.func.isRequired,
  onSignInUser: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onAddFlash: addFlash,
  onSignInUser: signInUser
};

export default connect(
  props,
  actions
)(SignInPage);
