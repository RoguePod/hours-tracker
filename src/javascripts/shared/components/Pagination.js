import { fromQuery, toQuery } from 'javascripts/globals';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PaginationLink from './PaginationLink';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _range from 'lodash/range';
import { withRouter } from 'react-router-dom';

const toPage = (page, location) => {
  const { search } = location;
  return { ...location, search: toQuery({ ...fromQuery(search), page }) };
};

const Pagination = (props) => {
  const {
    count,
    location,
    pagination: { pageNumber, totalEntries, totalPages },
    range
  } = props;

  const countElement = (
    <div className="text-sm text-blue">{`${totalEntries} Total Records`}</div>
  );

  if (totalPages <= 1) {
    return count && countElement;
  }

  let prevMore = false;
  let start = pageNumber - range;

  if (start <= 1) {
    start = 1;
  } else {
    prevMore = true;
  }

  let end = start + range * 2;

  if (end > totalPages) {
    end = totalPages;
  }
  const nextMore = end < totalPages;

  const links = _range(start, end + 1).map((number) => {
    return (
      <PaginationLink
        active={number === pageNumber}
        className="border-l"
        key={number}
        to={toPage(number, location)}
      >
        {number}
      </PaginationLink>
    );
  });

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex">
        <div className="flex border rounded overflow-hidden">
          <PaginationLink disabled={pageNumber === 1} to={toPage(1, location)}>
            <FontAwesomeIcon icon="angle-double-left" />
          </PaginationLink>
          <PaginationLink
            className="border-l"
            disabled={pageNumber === 1}
            to={toPage(pageNumber - 1, location)}
          >
            <FontAwesomeIcon icon="angle-left" />
          </PaginationLink>
          {prevMore && (
            <PaginationLink className="border-l" disabled>
              <FontAwesomeIcon icon="ellipsis-h" />
            </PaginationLink>
          )}
          {links}
          {nextMore && (
            <PaginationLink className="border-l" disabled>
              <FontAwesomeIcon icon="ellipsis-h" />
            </PaginationLink>
          )}
          <PaginationLink
            className="border-l"
            disabled={pageNumber === totalPages}
            to={toPage(pageNumber + 1, location)}
          >
            <FontAwesomeIcon icon="angle-right" />
          </PaginationLink>
          <PaginationLink
            className="border-l"
            disabled={pageNumber === totalPages}
            to={toPage(totalPages, location)}
          >
            <FontAwesomeIcon icon="angle-double-right" />
          </PaginationLink>
        </div>
      </div>
      {count && <div className="pt-1">{countElement}</div>}
    </div>
  );
};

Pagination.propTypes = {
  count: PropTypes.bool,
  location: PropTypes.routerLocation.isRequired,
  pagination: PropTypes.pagination.isRequired,
  range: PropTypes.number
};

Pagination.defaultProps = {
  count: true,
  range: 2
};

export default withRouter(Pagination);
