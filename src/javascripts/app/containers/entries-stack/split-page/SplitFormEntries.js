import { Button } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitFormChart from './SplitFormChart';
import SplitFormEntry from './SplitFormEntry';

class SplitFormEntries extends React.Component {
  static propTypes = {
    helpers: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    onParseDate: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
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
      helpers, onParseDate, values
    } = this.props;

    const stoppedAt = onParseDate(values.stoppedAt);

    helpers.push({
      clientRef: null,
      description: '',
      hours: '0.0',
      percent: '0.0',
      projectRef: null,
      startedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
      stoppedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
      timezone: values.timezone
    });
  }

  _renderRows() {
    const { helpers, values: { entries } } = this.props;

    return entries.map((entry, index) => {
      return (
        <SplitFormEntry
          {...this.props}
          entry={entry}
          helpers={helpers}
          index={index}
          key={index}
        />
      );
    });
  }

  render() {
    const { values } = this.props;

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
          entries={values.entries || []}
        />
      </div>
    );
  }
}

export default SplitFormEntries;
