import { Button } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitFormChart from './SplitFormChart';
import SplitFormEntry from './SplitFormEntry';

class SplitFormEntries extends React.Component {
  static propTypes = {
    currentValues: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    hours: PropTypes.number.isRequired,
    meta: PropTypes.shape({
      submitting: PropTypes.bool
    }).isRequired,
    onParseDate: PropTypes.func.isRequired,
    timezone: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleAdd = this._handleAdd.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleAdd() {
    const {
      currentValues, fields, onParseDate, timezone
    } = this.props;

    const stoppedAt = onParseDate(currentValues.stoppedAt);

    fields.push({
      clientRef: null,
      description: '',
      hours: '0.0',
      percent: '0.0',
      projectRef: null,
      startedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
      stoppedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
      timezone
    });
  }

  _renderRows() {
    const { currentValues, fields, meta, ...rest } = this.props;

    return fields.map((member, index) => {
      return (
        <SplitFormEntry
          {...meta}
          {...rest}
          currentValues={currentValues}
          fields={fields}
          index={index}
          key={index}
          member={member}
        />
      );
    });
  }

  render() {
    const { currentValues } = this.props;

    const rows = this._renderRows();

    return (
      <div>
        <div className="flex items-center mb-4">
          <h2 className="text-blue flex-1">
            {'Entries'}
          </h2>
          <Button
            color="blue"
            onClick={this._handleAdd}
            type="button"
          >
            <FontAwesomeIcon
              icon="plus"
            />
            {' '}
            {'Add Entry'}
          </Button>
        </div>
        {rows}
        <h3 className="text-blue">
          {'Chart'}
        </h3>
        <SplitFormChart
          entries={currentValues.entries || []}
        />
      </div>
    );
  }
}

export default SplitFormEntries;
