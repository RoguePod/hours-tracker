import { createBrowserHistory } from 'history';

const parts = window.location.pathname.split('/');
let basename = '';

if (parts[1] === 'admin') {
  basename = '/admin';
}

const history = createBrowserHistory({ basename });

export default history;
