import { Button } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitFormChart from './SplitFormChart';
import SplitFormEntry from './SplitFormEntry';

class SplitFormEntries extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      values: PropTypes.object.isRequired
    }).isRequired,
    push: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this._handleAdd = this._handleAdd.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleAdd() {
    const {
      form: { values },
      push
    } = this.props;

    push({
      clientId: null,
      description: '',
      hours: '0.0',
      percent: '0.0',
      projectId: null,
      startedAt: values.stoppedAt,
      stoppedAt: values.stoppedAt,
      timezone: values.timezone,
      userId: values.userId
    });
  }

  _renderRows() {
    const {
      form: {
        values: { entries }
      }
    } = this.props;

    return entries.map((entry, index) => {
      return (
        <SplitFormEntry
          {...this.props}
          entry={entry}
          index={index}
          key={index}
        />
      );
    });
  }

  render() {
    const {
      form: {
        isSubmitting,
        values: { entries }
      }
    } = this.props;

    const rows = this._renderRows();

    return (
      <div>
        <div className="flex items-center mb-4">
          <h2 className="text-blue-500 flex-1">{'Entries'}</h2>
          <Button
            color="blue"
            disabled={isSubmitting}
            onClick={this._handleAdd}
            type="button"
          >
            <FontAwesomeIcon icon="plus" /> {'Add Entry'}
          </Button>
        </div>
        {rows}
        <h3 className="text-blue-500">{'Chart'}</h3>
        <SplitFormChart entries={entries || []} />
      </div>
    );
  }
}

export default SplitFormEntries;
