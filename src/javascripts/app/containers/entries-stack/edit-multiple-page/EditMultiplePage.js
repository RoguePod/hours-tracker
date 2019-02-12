import React from 'react';
import { Redirect } from 'react-router-dom';

const EntryEditMultiplePage = () => {
  return (
    <Redirect
      replace
      to="/entries"
    />
  );
};

export default EntryEditMultiplePage;
