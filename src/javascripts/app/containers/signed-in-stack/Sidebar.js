import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import styles from './Sidebar.scss';

class Sidebar extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired
  }

  constructor(props) {
    super(props);

    this._handleClose = this._handleClose.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { location } = this.props;

    return (
      !_isEqual(location, nextProps.location)
    );
  }

  _handleClose() {
    const { location } = this.props;

    history.push({ ...location, hash: null });
  }

  /* eslint-disable max-lines-per-function */
  _renderMenu(pathname) {
    const isHome     = pathname === '/' || pathname.length === 0;
    const isEntries  = pathname.startsWith('/entries');
    const isProfile  = pathname.startsWith('/profile');
    const isProjects = pathname.startsWith('/projects');

    return (
      <Menu
        fluid
        secondary
        style={{ margin: 0 }}
        vertical
      >
        <Menu.Item
          active={isHome}
          as={Link}
          className={styles.link}
          to="/"
        >
          {'Home'}
        </Menu.Item>
        <Menu.Item
          active={isEntries}
          as={Link}
          className={styles.link}
          to="/entries"
        >
          {'Entries'}
        </Menu.Item>
        <Menu.Item
          active={isProjects}
          as={Link}
          className={styles.link}
          to="/projects"
        >
          {'Projects'}
        </Menu.Item>
        <Menu.Item
          active={isProfile}
          as={Link}
          className={styles.link}
          to="/profile"
        >
          {'Profile'}
        </Menu.Item>
        <Menu.Item
          as={Link}
          className={styles.link}
          to="/sign-out"
        >
          {'Sign Out'}
        </Menu.Item>
      </Menu>
    );
  }
  /* eslint-enable max-lines-per-function */

  render() {
    const { location } = this.props;

    const { pathname, hash } = location;

    const overlayClasses = cx(
      styles.overlay, { [styles.overlayOpen]: hash.match(/sidebar/u) }
    );

    const sliderClasses = cx(
      styles.slider, { [styles.sliderOpen]: hash.match(/sidebar/u) }
    );

    return (
      <menu className={styles.container}>
        <div
          className={overlayClasses}
          onClick={this._handleClose}
        />
        <div className={sliderClasses}>
          <div
            className={styles.header}
          >
            <Link
              className={styles.logo}
              to="/"
            >
              {'Hours Tracker'}
            </Link>
          </div>
          <div className={styles.inner}>
            {this._renderMenu(pathname)}
          </div>
        </div>
      </menu>
    );
  }
}

export default Sidebar;
