import EntryForm from '../EntryForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { createEntry } from 'javascripts/app/redux/entry';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntryNewForm extends React.Component {
  static propTypes = {
    fetching: PropTypes.string,
    onCreateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    running: PropTypes.entry,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null,
    page: false,
    running: null
  }

  shouldComponentUpdate(nextProps) {
    const { fetching, running } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(running, nextProps.running)
    );
  }

  render() {
    const { fetching, onCreateEntry, page, running, timezone } = this.props;

    return (
      <React.Fragment>
        <EntryForm
          initialValues={{ timezone }}
          onSaveEntry={onCreateEntry}
          running={running}
          timezone={timezone}
        />
        <Spinner
          page={page}
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </React.Fragment>
    );
  }
}

const props = (state) => {
  return {
    fetching: state.entry.fetching,
    running: state.running.entry,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onCreateEntry: createEntry
};

export default connect(props, actions)(EntryNewForm);
