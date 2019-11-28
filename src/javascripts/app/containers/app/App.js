import { useDispatch, useSelector } from 'react-redux';

import { ApolloProvider } from '@apollo/react-common';
import { Flashes } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import { updateWindow } from 'javascripts/shared/redux/app';
import { useLocation } from 'react-router-dom';

const App = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;

  const { apolloClient } = useSelector((state) => ({
    apolloClient: state.app.apolloClient,
    token: state.app.token,
    width: state.app.width
  }));

  const modal = _get(location, 'state.modal', false);

  // On Mount
  const timer = React.useRef(null);
  React.useEffect(() => {
    const _handleUpdateWindow = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      const element = document.documentElement;

      timer.current = setTimeout(() => {
        dispatch(updateWindow(element.clientWidth, element.clientHeight));
      }, 500);
    };

    window.addEventListener('resize', _handleUpdateWindow);

    return () => {
      window.removeEventListener('resize', _handleUpdateWindow);
    };
  }, [dispatch]);

  // On Page Change
  React.useEffect(() => {
    if (!modal) {
      window.scrollTo(0, 0);
    }
  }, [modal, pathname]);

  return (
    <ApolloProvider client={apolloClient.client} key={apolloClient.id}>
      {children}
      <Flashes />
    </ApolloProvider>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired
};

// componentDidMount() {
//   const { onLoadApp } = this.props;

//   onLoadApp();

//   window.addEventListener('resize', this._handleUpdateWindow);

//   this._handleSetBackground();
// }

// componentDidUpdate(prevProps) {
//   const { location, token } = this.props;
//   const { hash, pathname } = location;

//   const modal = _get(location, 'state.modal', false);
//   const prevModal = _get(prevProps, 'location.state.modal', false);

//   if (!modal && !prevModal && pathname !== prevProps.location.pathname) {
//     window.scrollTo(0, 0);
//   }

//   if (hash.match(/sidebar/u) || hash.match(/stopwatch/u)) {
//     document.addEventListener('keydown', this._handleKeyPress);
//   } else {
//     document.removeEventListener('keydown', this._handleKeyPress);
//   }

//   if (token !== prevProps.token) {
//     this._handleSetBackground();
//   }
// }

// componentWillUnmount() {
//   if (this.timeout) {
//     clearTimeout(this.timeout);
//   }

//   window.removeEventListener('resize', this._handleUpdateWindow);
// }

// _handleSetBackground() {
//   const { token } = this.props;

//   const htmlClasses = cx('antialiased h-full', {
//     'bg-blue-lightest': !token,
//     'bg-white': Boolean(token)
//   });

//   document.documentElement.className = htmlClasses;
// }

// _handleKeyPress(event) {
//   const { location } = this.props;

//   const sidebar =
//     location.hash.match(/sidebar/u) || location.hash.match(/stopwatch/u);

//   if (event.keyCode === 27 && sidebar) {
//     history.push({ ...location, hash: null, replace: true });
//   }
// }
export default React.memo(App);
