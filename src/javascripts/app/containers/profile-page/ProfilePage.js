import * as Yup from "yup";

import { Mutation, Query } from "react-apollo";

import { Formik } from "formik";
import PasswordForm from "./PasswordForm";
import ProfileForm from "./ProfileForm";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _get from "lodash/get";
import _omit from "lodash/omit";
import { addFlash } from "javascripts/shared/redux/flashes";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { serverErrors } from "javascripts/globals";

const QUERY = gql`
  query User {
    userSession {
      autoloadLastDescription
      id
      name
      recentProjectsListSize
      recentProjectsSort
      timezone
    }
  }
`;

/* eslint-disable prettier/prettier */
const PROFILE_MUTATION = gql`
  mutation UserUpdate(
    $autoloadLastDescription: Boolean!
    $name: String!
    $recentProjectsListSize: Int!
    $recentProjectsSort: String!
    $timezone: String!
  ) {
    userUpdate(
      autoloadLastDescription: $autoloadLastDescription
      name: $name
      recentProjectsListSize: $recentProjectsListSize
      recentProjectsSort: $recentProjectsSort
      timezone: $timezone
    ) {
      autoloadLastDescription
      id
      name
      recentProjectsListSize
      recentProjectsSort
      timezone
    }
  }
`;

const PASSWORD_MUTATION = gql`
  mutation UserPassword($password: String!) {
    userPassword(password: $password) {
      id
    }
  }
`;
/* eslint-enable prettier/prettier */

const ProfilePage = ({ onAddFlash, query }) => {
  const user = _get(query, "data.userSession");
  const id = _get(user, "id");

  const initialValues = _omit(user, "id");

  const profileValidationSchema = Yup.object().shape({
    autoloadLastDescription: Yup.boolean(),
    name: Yup.string().required("Name is Required"),
    recentProjectsListSize: Yup.number().required(
      "Recent Projects List Size is Required"
    ),
    recentProjectsSort: Yup.string().required(
      "Recent Projects Sort is Required"
    ),
    timezone: Yup.string().required("Timezone is Required")
  });

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string().required("Password is Required")
  });

  const _handleProfileSubmit = (onSubmit, variables, actions) => {
    onSubmit({ variables })
      .then(() => {
        onAddFlash("Profile has been updated");
        actions.setSubmitting(false);
      })
      .catch(error => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  const _handlePasswordSubmit = (onSubmit, variables, actions) => {
    onSubmit({ variables })
      .then(() => {
        onAddFlash("Password has been updated");
        actions.setSubmitting(false);
        actions.resetForm();
      })
      .catch(error => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-blue mb-2">{"Profile"}</h1>
      <div className="border rounded mb-4 p-4">
        <h3 className="text-blue mb-2">{"Settings"}</h3>
        <Mutation mutation={PROFILE_MUTATION}>
          {onSubmit => (
            <Formik
              component={ProfileForm}
              initialValues={initialValues}
              key={id || "LOADING"}
              onSubmit={(variables, actions) =>
                _handleProfileSubmit(onSubmit, variables, actions)
              }
              validationSchema={profileValidationSchema}
            />
          )}
        </Mutation>
      </div>
      <div className="border rounded p-4">
        <h3 className="text-blue mb-2">{"Password"}</h3>
        <Mutation mutation={PASSWORD_MUTATION}>
          {onSubmit => (
            <Formik
              component={PasswordForm}
              initialValues={{ password: "" }}
              key={id || "LOADING"}
              onSubmit={(variables, actions) =>
                _handlePasswordSubmit(onSubmit, variables, actions)
              }
              validationSchema={passwordValidationSchema}
            />
          )}
        </Mutation>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  onAddFlash: PropTypes.func.isRequired,
  query: PropTypes.query.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onAddFlash: addFlash
};

const ProfilePageComponent = connect(
  props,
  actions
)(ProfilePage);

const ProfilePageQuery = props => {
  return (
    <Query query={QUERY}>
      {query => {
        return <ProfilePageComponent {...props} query={query} />;
      }}
    </Query>
  );
};

export default ProfilePageQuery;
