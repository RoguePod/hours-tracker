import {
  getEntry,
  reset,
  selectEntryForForm,
  updateEntry
} from 'javascripts/app/redux/entry';

import EntryForm from '../EntryForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntryEditPage extends React.Component {
  static propTypes = {
    entry: PropTypes.entryForm.isRequired,
    fetching: PropTypes.string,
    form: PropTypes.string.isRequired,
    isRunning: PropTypes.bool.isRequired,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null,
    page: false
  }

  componentDidMount() {
    const { match, onGetEntry } = this.props;

    onGetEntry(match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, isRunning, timezone } = this.props;

    return (
      fetching !== nextProps.fetching ||
      isRunning !== nextProps.isRunning ||
      timezone !== nextProps.timezone ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  render() {
    const {
      entry, fetching, form, isRunning, onUpdateEntry, page, timezone
    } = this.props;

    return (
      <>
        <EntryForm
          enableReinitialize
          form={form}
          initialValues={entry}
          isRunning={isRunning}
          key={form}
          onSubmit={onUpdateEntry}
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
  const { entry, isRunning } = selectEntryForForm(state);
  const form = `EntryForm-${entry ? entry.id : 'new'}`;

  const timezone =
    formValueSelector(form)(state, 'timezone') || selectTimezone(state);

  return {
    entry,
    fetching: state.entry.fetching,
    form,
    isRunning,
    timezone
  };
};

const actions = {
  onGetEntry: getEntry,
  onReset: reset,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(EntryEditPage);
