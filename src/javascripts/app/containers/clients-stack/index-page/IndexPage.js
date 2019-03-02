import { Button, Pagination, Spinner } from "javascripts/shared/components";
import { fromQuery, toQuery } from "javascripts/globals";
import {
  selectPaginatedClients,
  selectQuery
} from "javascripts/app/redux/clients";

import ClientRow from "./ClientRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import SearchForm from "./SearchForm";
import _compact from "lodash/compact";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { history } from "javascripts/app/redux/store";
import { selectAdmin } from "javascripts/app/redux/app";
import { selectRecents } from "javascripts/app/redux/recents";
import { startEntry } from "javascripts/app/redux/running";

class ClientsIndexPage extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.client).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    pagination: PropTypes.pagination.isRequired,
    query: PropTypes.shape({
      page: PropTypes.number.isRequired,
      search: PropTypes.string
    }).isRequired,
    ready: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this._handleClear = this._handleClear.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { admin, clients, pagination, query, ready } = this.props;

    return (
      admin !== nextProps.admin ||
      ready !== nextProps.ready ||
      !_isEqual(query, nextProps.query) ||
      !_isEqual(clients, nextProps.clients) ||
      !_isEqual(pagination, nextProps.pagination)
    );
  }

  _handleSubmit(data, actions) {
    const { location } = this.props;
    const { search } = location;

    const values = _compact(Object.values(data));

    if (values.length > 0) {
      const route = {
        ...location,
        search: toQuery({ ...fromQuery(search), ...data, page: 1 })
      };

      history.push(route);
    } else {
      this._handleClear();
    }

    actions.setSubmitting(false);
  }

  _handleClear() {
    const {
      location: { search, ...rest }
    } = this.props;

    history.replace(rest);
  }

  _renderForm(props) {
    return <SearchForm {...props} onClear={this._handleClear} />;
  }

  render() {
    const { admin, clients, location, pagination, query, ready } = this.props;

    const clientRows = clients.map(client => {
      return (
        <div className="flex w-full xl:w-1/2 px-2" key={client.id}>
          <ClientRow {...this.props} client={client} />
        </div>
      );
    });

    return (
      <div className="p-4">
        <div className="text-blue flex items-center pb-4">
          <h1 className="flex-1 text-blue">{"Clients"}</h1>
          {admin && (
            <Button
              as={Link}
              color="blue"
              to={{
                ...location,
                pathname: "/clients/new",
                state: { modal: true }
              }}
            >
              <FontAwesomeIcon icon="plus" /> {"New Client"}
            </Button>
          )}
        </div>
        <div className="border rounded p-4 mb-4">
          <Formik
            enableReinitialize
            initialValues={query}
            onSubmit={this._handleSubmit}
            render={this._renderForm}
          />
        </div>
        <div className="flex -mx-2 flex-wrap">{clientRows}</div>
        <Pagination pagination={pagination} />
        <Spinner page spinning={!ready} text="Loading..." />
      </div>
    );
  }
}

const props = state => {
  const { clients, pagination } = selectPaginatedClients(state);

  return {
    admin: selectAdmin(state),
    clients,
    pagination,
    query: selectQuery(state),
    ready: state.recents.ready,
    recents: selectRecents(state),
    user: state.app.user
  };
};

const actions = {
  onStartEntry: startEntry
};

export default connect(
  props,
  actions
)(ClientsIndexPage);
