import { App, SignedInStack, SignedOutStack } from 'javascripts/app/containers';
import { Provider, useSelector } from 'react-redux';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBars,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faDollarSign,
  faDownload,
  faEllipsisH,
  faExchangeAlt,
  faExclamationCircle,
  faFilter,
  faLayerGroup,
  faList,
  faPencilAlt,
  faPlay,
  faPlus,
  faSpinner,
  faStop,
  faSyncAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';

import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import history from 'javascripts/history';
import { library } from '@fortawesome/fontawesome-svg-core';
import moment from 'moment-timezone';
import registerServiceWorker from './registerServiceWorker';
import store from 'javascripts/app/redux/store';

library.add(
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBars,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faCheckSquare,
  faDollarSign,
  faDownload,
  faEllipsisH,
  faExchangeAlt,
  faExclamationCircle,
  faFilter,
  faLayerGroup,
  faList,
  faPencilAlt,
  faPlay,
  faPlus,
  faSpinner,
  faSquare,
  faStop,
  faSyncAlt,
  faTimes
);

moment.locale('en');

const AppRoutes = () => {
  const token = useSelector((state) => state.app.token);

  return token ? <SignedInStack /> : <SignedOutStack />;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <AppRoutes />
      </App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);

registerServiceWorker();
