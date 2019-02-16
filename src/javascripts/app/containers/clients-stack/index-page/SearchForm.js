import { Button, FormError, InputField } from "javascripts/shared/components";
import { Field, Form } from "formik";

import PropTypes from "javascripts/prop-types";
import React from "react";

const ClientsSearchForm = ({ isSubmitting, onClear, status }) => {
  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="mb-4">
        <Field
          autoCapitalize="sentences"
          autoCorrect="on"
          autoFocus
          component={InputField}
          label="Search"
          name="search"
          placeholder="Client/Project Name..."
        />
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 md:mb-0 mb-4">
          <Button
            className="py-2 w-full"
            color="green"
            disabled={isSubmitting}
            type="submit"
          >
            {"Filter"}
          </Button>
        </div>
        <div className="w-full md:w-1/2 px-2">
          <Button
            className="py-2 w-full"
            disabled={isSubmitting}
            onClick={onClear}
            type="button"
          >
            {"Clear"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

ClientsSearchForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  onClear: PropTypes.func.isRequired,
  status: PropTypes.string
};

ClientsSearchForm.defaultProps = {
  status: null
};

export default ClientsSearchForm;
