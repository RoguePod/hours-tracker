import PasswordForm from './PasswordForm';
import ProfileForm from './ProfileForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
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

  _getInitialValues(user) {
    const {
      autoloadLastDescription, name, entriesTab,
      recentProjectsListSize, recentProjectsSort, timezone
    } = user;

    return {
      autoloadLastDescription,
      entriesTab,
      name,
      recentProjectsListSize,
      recentProjectsSort,
      timezone
    };
  }

  render() {
    const { onUpdatePassword, onUpdateUser, user } = this.props;

    return (
      <div>
        <h1 className="text-blue mb-2">
          {'Profile'}
        </h1>
        <div className="border rounded shadow mb-4 p-4">
          <h3 className="text-blue mb-2">
            {'Settings'}
          </h3>
          <ProfileForm
            initialValues={this._getInitialValues(user)}
            onUpdateUser={onUpdateUser}
          />
        </div>
        <div className="border rounded shadow p-4">
          <h3 className="text-blue mb-2">
            {'Password'}
          </h3>
          <PasswordForm
            onUpdatePassword={onUpdatePassword}
          />
        </div>
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
