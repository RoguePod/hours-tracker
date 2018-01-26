import { Icon, Menu } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styles from './Header.scss';

class SignedInHeader extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired,
    running: PropTypes.entry,
    user: PropTypes.user.isRequired,
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    running: null
  }

  shouldComponentUpdate(nextProps) {
    const { location, running, user, width } = this.props;

    return (
      location.pathname !== nextProps.location.pathname ||
      location.hash !== nextProps.location.hash ||
      running !== nextProps.running ||
      user.name !== nextProps.user.name ||
      width !== nextProps.width
    );
  }

  render() {
    const { location, running, user, width } = this.props;
    const { pathname } = location;

    const isHome     = pathname === '/' || pathname.length === 0;
    const isEntries  = pathname.startsWith('/entries');
    const isProjects = pathname.startsWith('/projects');
    const isProfile  = pathname.startsWith('/profile');

    return (
      <header className={styles.container}>
        {width >= 768 &&
          <Menu
            color="blue"
            inverted
            secondary
          >
            <Menu.Item
              as={Link}
              to="/"
            >
              <span
                className={styles.logo}
              >
                {'Hours Tracker'}
              </span>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                {user.name}
              </Menu.Item>
              <Link
                className={cx('item', { active: isHome })}
                to="/"
              >
                {'Home'}
              </Link>
              <Link
                className={cx('item', { active: isEntries })}
                to="/entries"
              >
                {'Entries'}
              </Link>
              <Link
                className={cx('item', { active: isProjects })}
                to="/clients"
              >
                {'Clients/Projects'}
              </Link>
              <Link
                className={cx('item', { active: isProfile })}
                to="/profile"
              >
                {'Profile'}
              </Link>
              <Link
                className="item"
                to="/sign-out"
              >
                {'Sign Out'}
              </Link>
            </Menu.Menu>
          </Menu>}
        {width < 768 &&
          <Menu
            color="blue"
            inverted
            secondary
          >
            <Menu.Item>
              <Link
                to={{ ...location, hash: 'stopwatch' }}
              >
                <Icon.Group size="big">
                  <Icon
                    className={styles.icon}
                    name="clock"
                  />
                  {running &&
                    <Icon
                      color="green"
                      corner
                      name="play"
                    />}
                  {!running &&
                    <Icon
                      color="red"
                      corner
                      name="stop"
                    />}
                </Icon.Group>
              </Link>
              <Link
                className={styles.logo}
                to="/"
              >
                {'Hours Tracker'}
              </Link>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item
                as={Link}
                to={{ ...location, hash: 'sidebar' }}
              >
                <Icon
                  className={styles.icon}
                  name="sidebar"
                  size="big"
                />
              </Menu.Item>
            </Menu.Menu>
          </Menu>}
      </header>
    );
  }
}

export default SignedInHeader;
