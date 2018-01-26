import { Header, Segment } from 'semantic-ui-react';

import PasswordForm from './PasswordForm';
import ProfileForm from './ProfileForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import styles from './ProfilePage.scss';
import { updatePassword } from 'javascripts/app/redux/passwords';
import { updateUser } from 'javascripts/app/redux/user';

class ProfilePage extends React.Component {
  static propTypes = {
    onUpdatePassword: PropTypes.func.isRequired,
    onUpdateUser: PropTypes.func.isRequired,
    user: PropTypes.user.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { user } = this.props;

    return (
      !_isEqual(user, nextProps.user)
    );
  }

  render() {
    const { onUpdatePassword, onUpdateUser, user } = this.props;

    const {
      autoloadLastDescription, name, entriesTab,
      recentProjectsListSize, recentProjectsSort, timezone
    } = user;

    const initialValues = {
      autoloadLastDescription,
      entriesTab,
      name,
      recentProjectsListSize,
      recentProjectsSort,
      timezone
    };

    return (
      <div className={styles.container}>
        <Header
          as="h1"
          color="blue"
        >
          {'Profile'}
        </Header>
        <Segment>
          <Header
            as="h3"
            color="blue"
          >
            {'Settings'}
          </Header>
          <ProfileForm
            initialValues={initialValues}
            onUpdateUser={onUpdateUser}
          />
        </Segment>
        <Segment>
          <Header
            as="h3"
            color="blue"
          >
            {'Password'}
          </Header>
          <PasswordForm
            onUpdatePassword={onUpdatePassword}
          />
        </Segment>
      </div>
    );
  }
}

const props = (state) => {
  return {
    user: state.app.user
  };
};

const actions = {
  onUpdatePassword: updatePassword,
  onUpdateUser: updateUser
};

export default connect(props, actions)(ProfilePage);
