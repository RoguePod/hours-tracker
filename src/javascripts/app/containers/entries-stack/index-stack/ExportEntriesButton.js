import { cloudFunctionsUrl, isBlank, toQuery } from 'javascripts/globals';

import { ConfirmAction } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ExportEntriesButton extends React.Component {
  static propTypes = {
    func: PropTypes.string.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleOpen = this._handleOpen.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleOpen() {
    const { func, query, timezone } = this.props;
    const newQuery = {
      ...query,
      timezone
    };

    const url = `${cloudFunctionsUrl}/${func}?${toQuery(newQuery)}`;

    /* eslint-disable no-undef */
    window.open(url, '_blank');
    /* eslint-enable no-undef */
  }

  render() {
    const { func, query, timezone, title } = this.props;
    const newQuery = {
      ...query,
      timezone
    };

    let warning = true;

    for (const value of Object.values(query)) {
      if (!isBlank(value)) {
        warning = false;
        break;
      }
    }

    if (warning) {
      const message = "You've requested to get all entries, without filters, " +
        'which can take a long time and may not even finish.';

      return (
        <ConfirmAction
          message={message}
          onClick={this._handleOpen}
        >
          <div className="item">
            {title}
          </div>
        </ConfirmAction>
      );
    }

    const url = `${cloudFunctionsUrl}/${func}?${toQuery(newQuery)}`;

    return (
      <a
        className="item"
        href={url}
        target="_blank"
      >
        {title}
      </a>
    );
  }
}

export default ExportEntriesButton;
