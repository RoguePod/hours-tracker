import { Mutation as ApolloMutation } from "react-apollo";
import PropTypes from "javascripts/prop-types";
import React from "react";

const Mutation = ({ children, mutation }) => {
  return (
    <ApolloMutation mutation={mutation}>
      {(onSubmit, data) => {
        return React.Children.map(children, child =>
          React.cloneElement(child, { mutation: data, onSubmit })
        );
      }}
    </ApolloMutation>
  );
};

Mutation.propTypes = {
  children: PropTypes.node.isRequired,
  mutation: PropTypes.gqlMutation.isRequired
};

export default Mutation;
