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
    count, location, pagination: { page, totalCount, totalPages }, range
  } = props;

  const countElement = (
    <div className="text-sm text-blue">
      {`${totalCount} Total Records`}
    </div>
  );

  if (totalPages <= 1) {
    return count && countElement;
  }

  let prevMore = false;
  let start = page - range;

  if (start <= 1) {
    start = 1;
  } else {
    prevMore = true;
  }

  let end = start + (range * 2);

  if (end > totalPages) {
    end = totalPages;
  }
  const nextMore = end < totalPages;

  const links = _range(start, end + 1).map((number) => {
    return (
      <PaginationLink
        active={number === page}
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
          <PaginationLink
            disabled={page === 1}
            to={toPage(1, location)}
          >
            <FontAwesomeIcon icon="angle-double-left" />
          </PaginationLink>
          <PaginationLink
            className="border-l"
            disabled={page === 1}
            to={toPage(page - 1, location)}
          >
            <FontAwesomeIcon icon="angle-left" />
          </PaginationLink>
          {prevMore &&
            <PaginationLink
              className="border-l"
              disabled
            >
              <FontAwesomeIcon icon="ellipsis-h" />
            </PaginationLink>}
          {links}
          {nextMore &&
            <PaginationLink
              className="border-l"
              disabled
            >
              <FontAwesomeIcon icon="ellipsis-h" />
            </PaginationLink>}
          <PaginationLink
            className="border-l"
            disabled={page === totalPages}
            to={toPage(page + 1, location)}
          >
            <FontAwesomeIcon icon="angle-right" />
          </PaginationLink>
          <PaginationLink
            className="border-l"
            disabled={page === totalPages}
            to={toPage(totalPages, location)}
          >
            <FontAwesomeIcon icon="angle-double-right" />
          </PaginationLink>
        </div>
      </div>
      {count &&
        <div className="pt-1">
          {countElement}
        </div>}
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
