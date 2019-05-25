/* global window */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isNumber from 'lodash/isNumber';
import styled from 'styled-components';

const DURATION = 3000;

const Container = styled.div`
  top: 100%;
  transition: all 300ms ease;
`;

const Flash = ({ flash, onRemoveFlash, onUpdateFlash }) => {
  let timeout = null;
  const { id } = flash;
  const element = React.useRef(null);

  const handleRemove = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    onRemoveFlash(id);
  };

  const handleResize = () => {
    const { height } = element.current.getBoundingClientRect();

    onUpdateFlash(id, { height });
  };

  React.useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    timeout = setTimeout(() => {
      handleRemove();
    }, DURATION);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      window.removeEventListener('resize', handleResize);
    };
  }, [id]);

  const { bottom } = flash;
  const color = flash.color || 'green';
  const icon = flash.icon || 'exclamation-circle';

  const containerClasses = 'fixed w-full pb-4 px-4';
  const alertClasses =
    `bg-${color}-200 border-${color}-500 rounded text-${color}-600 ` +
    'border-t-4 px-4 py-3 shadow-lg flex max-w-sm mx-auto';

  const containerStyles = {};

  if (_isNumber(bottom)) {
    containerStyles.transform = `translateY(-${bottom}px)`;
  }

  return (
    <Container
      className={containerClasses}
      onClick={handleRemove}
      ref={element}
      style={containerStyles}
    >
      <div className={alertClasses}>
        <div className="p-2">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="flex-1 self-center">{flash.message}</div>
        <div className="p-2 cursor-pointer">
          <FontAwesomeIcon icon="times" />
        </div>
      </div>
    </Container>
  );
};

Flash.propTypes = {
  flash: PropTypes.flash.isRequired,
  onRemoveFlash: PropTypes.func.isRequired,
  onUpdateFlash: PropTypes.func.isRequired
};

export default Flash;
