// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { signOutUser } from 'javascripts/shared/redux/app';
import { useDispatch } from 'react-redux';

const SignOutPage = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(signOutUser());
  }, [dispatch]);

  return null;
};

export default SignOutPage;
