import { getClient, updateClient } from 'javascripts/app/redux/client';

import ClientForm from '../ClientForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

class ClientEditPage extends React.Component {
  static propTypes = {
    client: PropTypes.client,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetClient: PropTypes.func.isRequired,
    onUpdateClient: PropTypes.func.isRequired
  }

  static defaultProps = {
    client: null,
    fetching: null
  }

  componentDidMount() {
    const { match, onGetClient } = this.props;

    onGetClient(match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { client, fetching } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(client, nextProps.client)
    );
  }

  render() {
    const { client, fetching, onUpdateClient } = this.props;

    if (!client) {
      return (
        <Spinner
          page
          spinning={Boolean(fetching)}
          text={fetching}
        />
      );
    }

    const initialValues = {
      active: client.active,
      name: client.name
    };

    return (
      <div className="p-4">
        <h1 className="text-blue mb-2">
          {'Edit Client'}
        </h1>
        <div className="border rounded shadow mb-4 p-4">
          <ClientForm
            initialValues={initialValues}
            onSaveClient={onUpdateClient}
          />
        </div>
      </div>
    );
  }
}

const props = (state) => {
  return {
    client: state.client.client,
    fetching: state.client.fetching
  };
};

const actions = {
  onGetClient: getClient,
  onUpdateClient: updateClient
};

export default connect(props, actions)(ClientEditPage);
