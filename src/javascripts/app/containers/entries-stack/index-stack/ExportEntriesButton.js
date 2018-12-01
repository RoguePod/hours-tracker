/* global window */

import { cloudFunctionsUrl, isBlank, toQuery } from 'javascripts/globals';

import { ConfirmAction } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ExportEntriesButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    func: PropTypes.string.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: ''
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

    window.open(url, '_blank');
  }

  render() {
    const { className, func, query, timezone, title } = this.props;
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

    const children = (
      <React.Fragment>
        <FontAwesomeIcon
          icon="download"
        />
        {' '}
        {title}
      </React.Fragment>
    );

    if (warning) {
      const message = "You've requested to get all entries, without filters, " +
        'which can take a long time and may not even finish.';

      return (
        <ConfirmAction
          message={message}
          onClick={this._handleOpen}
        >
          <div className={className}>
            {children}
          </div>
        </ConfirmAction>
      );
    }

    const url = `${cloudFunctionsUrl}/${func}?${toQuery(newQuery)}`;

    return (
      <a
        className={className}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }
}

export default ExportEntriesButton;
