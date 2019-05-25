/* global window */

import {
  cloudFunctionsUrl,
  convertEntryParamIdsToRefs,
  isBlank,
  toQuery
} from 'javascripts/globals';

import { ConfirmAction } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const TextOverflow = styled.div`
  text-overflow: ellipsis;
`;

class ExportEntriesButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    func: PropTypes.string.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    className: ''
  };

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
    const newQuery = { ...query, timezone };

    let warning = true;

    for (const value of Object.values(query)) {
      if (!isBlank(value)) {
        warning = false;
        break;
      }
    }

    const titleClassName = cx(
      'cursor-pointer whitespace-no-wrap w-100 overflow-hidden text-center'
    );

    const children = (
      <TextOverflow className={titleClassName}>{title}</TextOverflow>
    );

    const containerClassName = cx(
      className,
      'p-2 hover:bg-blue-300 text-blue-500 block'
    );

    if (warning) {
      const message =
        "You've requested to get all entries, without filters, " +
        'which can take a long time and may not even finish.';

      return (
        <ConfirmAction message={message} onClick={this._handleOpen}>
          <div className={containerClassName}>{children}</div>
        </ConfirmAction>
      );
    }

    const finalQuery = toQuery(convertEntryParamIdsToRefs(newQuery, true));
    const url = `${cloudFunctionsUrl}/${func}?${finalQuery}`;

    return (
      <a
        className={containerClassName}
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
