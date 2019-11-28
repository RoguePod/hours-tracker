import Flash from './Flash';
import Portal from './Portal';
import React from 'react';
import { useSelector } from 'react-redux';

const Flashes = () => {
  const { flashes } = useSelector((state) => ({
    flashes: state.flashes.flashes
  }));

  const flashChildren = flashes.map((flash) => {
    return <Flash flash={flash} key={flash.id} />;
  });

  return <Portal>{flashChildren}</Portal>;
};

export default Flashes;
