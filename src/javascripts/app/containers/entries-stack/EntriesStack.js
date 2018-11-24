import { Route, Switch } from 'react-router-dom';

import EditModal from './edit-page/EditModal';
import EditPage from './edit-page/EditPage';
import IndexStack from './index-stack/IndexStack';
import NewModal from './new-page/NewModal';
import NewPage from './new-page/NewPage';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitPage from './split-page/SplitPage';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

class EntriesStack extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
      open: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { history: { action } } = nextProps;
    const modal = _get(nextProps, 'location.state.modal', false);

    if (action !== 'POP' && modal) {
      return {
        open: true
      };
    } else if (action === 'POP' && prevState.open) {
      return {
        open: false
      };
    }

    return null;
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { open } = this.state;

    if (!open && !_isEqual(prevProps.location, location)) {
      this.setState({ location });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  render() {
    const { location, match } = this.props;
    const { open, location: previousLocation } = this.state;

    return (
      <React.Fragment>
        <Switch
          location={open ? previousLocation : location}
        >
          <Route
            component={NewPage}
            path={`${match.url}/new`}
          />
          <Route
            component={EditPage}
            path={`${match.url}/:id/edit`}
          />
          <Route
            component={SplitPage}
            path={`${match.url}/:id/split`}
          />
          <Route
            component={IndexStack}
            path={match.url}
          />
        </Switch>

        {open &&
          <Switch>
            <Route
              component={NewModal}
              path={`${match.url}/new`}
            />
            <Route
              component={EditModal}
              path={`${match.url}/:id/edit`}
            />
          </Switch>}
      </React.Fragment>
    );
  }
}

EntriesStack.propTypes = {
  history: PropTypes.routerAction.isRequired,
  location: PropTypes.routerLocation.isRequired,
  match: PropTypes.routerMatch.isRequired
};

export default EntriesStack;
