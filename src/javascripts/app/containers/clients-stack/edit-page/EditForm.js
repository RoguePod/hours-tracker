import * as Yup from "yup";

import { Mutation, Query } from "react-apollo";

import ClientForm from "../ClientForm";
import { Formik } from "formik";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Spinner } from "javascripts/shared/components";
import _get from "lodash/get";
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

const ClientEditForm = ({ client, onAddFlash, query: { loading } }) => {
  if (!client) {
    if (loading) {
      return <Spinner page spinning={loading} text="Loading Client..." />;
    }

    return <h1 className="text-center text-blue">{"Client Not Found"}</h1>;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required")
  });

  const _handleSubmit = (onSubmit, variables, actions) => {
    onSubmit({ variables })
      .then(() => {
        onAddFlash("Client has been updated");
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
          initialValues={client}
          key={client ? client.id : "empty"}
          onSubmit={(variables, actions) =>
            _handleSubmit(onSubmit, variables, actions)
          }
          validationSchema={validationSchema}
        />
      )}
    </Mutation>
  );
};

ClientEditForm.propTypes = {
  client: PropTypes.client,
  onAddFlash: PropTypes.func.isRequired,
  query: PropTypes.gqlQuery.isRequired
};

ClientEditForm.defaultProps = {
  client: null
};

const QUERY = gql`
  query ClientsShow($id: ID!) {
    clientsShow(id: $id) {
      active
      id
      name
    }
  }
`;

const ClientQuery = props => {
  const id = _get(props, "match.params.id");

  return (
    <Query query={QUERY} variables={{ id }}>
      {query => {
        const client = _get(query, "data.clientsShow");
        return <ClientEditForm {...props} client={client} query={query} />;
      }}
    </Query>
  );
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
)(ClientQuery);
