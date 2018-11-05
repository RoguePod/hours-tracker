import { Field, reduxForm } from 'redux-form';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class EntryForm extends React.Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    error: PropTypes.string,
    onUpdateEntry: PropTypes.func.isRequired
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
    this._handleDescriptionChange = this._handleDescriptionChange.bind(this);
  }

  timeout = null

  _handleProjectChange(clientRef, projectRef) {
    const { change, onUpdateEntry } = this.props;

    change('clientRef', clientRef);
    change('projectRef', projectRef);

    onUpdateEntry({ clientRef, projectRef });
  }

  _handleDescriptionChange({ target: { value } }) {
    const { onUpdateEntry } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      onUpdateEntry({ description: value });
    }, 250);
  }

  render() {
    const { error } = this.props;

    return (
      <form
        noValidate
      >
        <FormError error={error} />
        <Field
          component={ProjectField}
          id="projectRef"
          label="Project"
          name="projectName"
          nameClient="clientRef"
          nameProject="projectRef"
          onProjectChange={this._handleProjectChange}
        />
        <Field
          autoCapitalize="sentences"
          autoCorrect="on"
          component={TextAreaField}
          id="description"
          label="Description"
          name="description"
          onChange={this._handleDescriptionChange}
          rows={1}
        />
      </form>
    );
  }
}

export default reduxForm({
  form: 'StopWatchEntryForm'
})(EntryForm);
