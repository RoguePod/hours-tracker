import { Icon, Menu } from 'semantic-ui-react';

import PaginationLink from './PaginationLink';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _range from 'lodash/range';

const Pagination = ({ onPage, pagination: { page, totalPages }, range }) => {
  if (totalPages <= 1) {
    return null;
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
        key={number}
        onPage={onPage}
        page={number}
      >
        {number}
      </PaginationLink>
    );
  });

  return (
    <Menu
      pagination
    >
      <PaginationLink
        disabled={page === 1}
        onPage={onPage}
        page={1}
      >
        <Icon name="angle double left" />
      </PaginationLink>
      <PaginationLink
        disabled={page === 1}
        onPage={onPage}
        page={page - 1}
      >
        <Icon name="angle left" />
      </PaginationLink>
      {prevMore &&
        <PaginationLink
          disabled
          onPage={onPage}
        >
          <Icon name="ellipsis horizontal" />
        </PaginationLink>}
      {links}
      {nextMore &&
        <PaginationLink
          disabled
          onPage={onPage}
        >
          <Icon name="ellipsis horizontal" />
        </PaginationLink>}
      <PaginationLink
        disabled={page === totalPages}
        onPage={onPage}
        page={page + 1}
      >
        <Icon name="angle right" />
      </PaginationLink>
      <PaginationLink
        disabled={page === totalPages}
        onPage={onPage}
        page={totalPages}
      >
        <Icon name="angle double right" />
      </PaginationLink>
    </Menu>
  );
};

Pagination.propTypes = {
  onPage: PropTypes.func.isRequired,
  pagination: PropTypes.pagination.isRequired,
  range: PropTypes.number
};

Pagination.defaultProps = {
  range: 5
};

export default Pagination;
