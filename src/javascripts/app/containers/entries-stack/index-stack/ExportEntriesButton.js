import { isBlank, toQuery } from 'javascripts/globals';

import { ConfirmAction } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const TextOverflow = styled.div`
  text-overflow: ellipsis;
`;

const ExportEntriesButton = ({ className, func, query, timezone, title }) => {
  const _handleOpen = () => {
    const newQuery = {
      ...query,
      timezone
    };

    // const url = `${cloudFunctionsUrl}/${func}?${toQuery(newQuery)}`;
    const url = `${func}?${toQuery(newQuery)}`;

    window.open(url, '_blank');
  };

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
    'p-2 hover:bg-blue-lighter text-blue block'
  );

  if (warning) {
    const message =
      "You've requested to get all entries, without filters, " +
      'which can take a long time and may not even finish.';

    return (
      <ConfirmAction message={message} onClick={_handleOpen}>
        <div className={containerClassName}>{children}</div>
      </ConfirmAction>
    );
  }

  // const url = `${cloudFunctionsUrl}/${func}?${toQuery(newQuery)}`;
  const url = `${func}?${toQuery(newQuery)}`;

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
};

ExportEntriesButton.propTypes = {
  className: PropTypes.string,
  func: PropTypes.string.isRequired,
  query: PropTypes.entriesQuery.isRequired,
  timezone: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

ExportEntriesButton.defaultProps = {
  className: ''
};

export default ExportEntriesButton;
