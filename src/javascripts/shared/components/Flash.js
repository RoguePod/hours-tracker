import { removeFlash, updateFlash } from 'javascripts/shared/redux/flashes';

import Alert from './Alert';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isNumber from 'lodash/isNumber';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

const DURATION = 3000;

const Container = styled.div`
  top: 100%;
  transition: all 300ms ease;
`;

const Flash = ({ flash }) => {
  const { id } = flash;
  const element = React.useRef(null);
  const [height, setHeight] = React.useState(0);
  const dispatch = useDispatch();

  const _handleRemove = React.useCallback(() => {
    dispatch(removeFlash(id));
  }, [dispatch, id]);

  React.useEffect(() => {
    const _handleResize = () => {
      const { height } = element.current.getBoundingClientRect();
      setHeight(height);
    };

    _handleResize();

    window.addEventListener('resize', _handleResize);

    const timeout = setTimeout(() => {
      _handleRemove();
    }, flash.duration || DURATION);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      window.removeEventListener('resize', _handleResize);
    };
  }, [_handleRemove, flash.duration]);

  React.useEffect(() => {
    dispatch(updateFlash(id, { height }));
  }, [dispatch, height, id]);

  const { bottom, message, ...rest } = flash;

  const containerClasses = 'fixed w-full pb-4 px-4 z-100';

  const containerStyles = {};

  if (_isNumber(bottom)) {
    containerStyles.transform = `translateY(-${bottom}px)`;
  }

  return (
    <Container
      className={containerClasses}
      onClick={_handleRemove}
      ref={element}
      style={containerStyles}
    >
      <Alert {...rest} className="max-w-sm mx-auto px-4 py-3 shadow-lg" remove>
        {message}
      </Alert>
    </Container>
  );
};

Flash.propTypes = {
  flash: PropTypes.flash.isRequired
};

export default Flash;
