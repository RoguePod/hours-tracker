import { Button, Grid, Header } from 'semantic-ui-react';

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
      <Grid
        columns="equal"
        stackable
      >
        <Grid.Row>
          <Grid.Column>
            <Header
              as="h3"
              color="blue"
            >
              {'Entries'}
            </Header>
          </Grid.Column>
        </Grid.Row>
        {rows}
        <Grid.Row>
          <Grid.Column>
            <Header
              as="h3"
              color="blue"
            >
              {'Chart'}
            </Header>
            <SplitFormChart
              entries={currentValues.entries || []}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button
              color="blue"
              content="Add Entry"
              fluid
              icon="exchange"
              onClick={this._handleAdd}
              type="button"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SplitFormEntries;
