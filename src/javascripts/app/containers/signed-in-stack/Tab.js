import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const Container = styled(Link)`
  transition: all 300ms ease;
`;

const Tab = ({ children, selected, to }) => {
  const baseClasses = 'inline-block rounded py-1 px-3';
  const unselectedClasses = 'hover:bg-blue-light';
  const selectedTabClasses = 'bg-blue-dark';

  const tabClasses = cx(baseClasses, {
    [selectedTabClasses]: selected,
    [unselectedClasses]: !selected
  });

  return (
    <Container className={tabClasses} to={to}>
      {children}
    </Container>
  );
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
  to: PropTypes.string.isRequired
};

Tab.defaultProps = {
  selected: false
};

export default Tab;
