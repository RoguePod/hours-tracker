import EntryForm from '../EntryForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import { connect } from 'react-redux';
import { createEntry } from 'javascripts/app/redux/entry';
import { formValueSelector } from 'redux-form';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntryNewForm extends React.Component {
  static propTypes = {
    fetching: PropTypes.string,
    isRunning: PropTypes.bool.isRequired,
    onCreateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null,
    page: false
  }

  shouldComponentUpdate(nextProps) {
    const { fetching, isRunning, timezone } = this.props;

    return (
      fetching !== nextProps.fetching ||
      isRunning !== nextProps.isRunning ||
      timezone !== nextProps.timezone
    );
  }

  render() {
    const { fetching, onCreateEntry, page, isRunning, timezone } = this.props;

    return (
      <>
        <EntryForm
          initialValues={{ timezone }}
          isRunning={isRunning}
          onSaveEntry={onCreateEntry}
          timezone={timezone}
        />
        <Spinner
          page={page}
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </>
    );
  }
}

const props = (state) => {
  const timezone =
    formValueSelector('EntryForm')(state, 'timezone') || selectTimezone(state);

  return {
    fetching: state.entry.fetching,
    isRunning: Boolean(state.running.entry),
    timezone
  };
};

const actions = {
  onCreateEntry: createEntry
};

export default connect(props, actions)(EntryNewForm);
