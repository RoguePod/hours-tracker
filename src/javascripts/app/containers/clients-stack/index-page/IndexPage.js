import { Button, Pagination, Spinner } from "javascripts/shared/components";
import { fromQuery, toQuery } from "javascripts/globals";

import ClientRow from "./ClientRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import { Query } from "react-apollo";
import React from "react";
import SearchForm from "./SearchForm";
import _compact from "lodash/compact";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { history } from "javascripts/app/redux/store";
import { selectSearch } from "javascripts/app/redux/clients";
import { startEntry } from "javascripts/app/redux/running";

class ClientsIndexPage extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.client).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    pagination: PropTypes.pagination.isRequired,
    query: PropTypes.gqlQuery.isRequired,
    search: PropTypes.shape({
      page: PropTypes.number.isRequired,
      pageSize: PropTypes.number.isRequired,
      query: PropTypes.string
    }).isRequired
  };

  constructor(props) {
    super(props);

    this._handleClear = this._handleClear.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {
      admin,
      clients,
      query: { loading },
      pagination
    } = this.props;

    return (
      admin !== nextProps.admin ||
      loading !== nextProps.query.loading ||
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
    const {
      admin,
      clients,
      location,
      pagination,
      query: { loading },
      search
    } = this.props;

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
            initialValues={search}
            onSubmit={this._handleSubmit}
            render={this._renderForm}
          />
        </div>
        <div className="flex -mx-2 flex-wrap">{clientRows}</div>
        <Pagination pagination={pagination} />
        <Spinner page spinning={loading} text="Loading..." />
      </div>
    );
  }
}

const QUERY = gql`
  query ClientsIndex($page: Int, $pageSize: Int) {
    clientsIndex(page: $page, pageSize: $pageSize) {
      entries {
        active
        id
        name

        projects {
          active
          billable
          id
          name
        }
      }

      pageNumber
      pageSize
      totalEntries
      totalPages
    }

    userSession {
      id
      role
    }
  }
`;

const ClientsIndexQuery = props => {
  const { search } = props;

  return (
    <Query query={QUERY} variables={search}>
      {query => {
        const admin = _get(query, "data.userSession.role", "User") === "Admin";
        const clientsIndex = _get(query, "data.clientsIndex", {});
        const clients = _get(clientsIndex, "entries", []);
        const pagination = _pick(clientsIndex, [
          "pageNumber",
          "pageSize",
          "totalEntries",
          "totalPages"
        ]);

        return (
          <ClientsIndexPage
            {...props}
            admin={admin}
            clients={clients}
            pagination={pagination}
            query={query}
          />
        );
      }}
    </Query>
  );
};

ClientsIndexQuery.propTypes = {
  search: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    query: PropTypes.string
  }).isRequired
};

const props = state => {
  return {
    search: selectSearch(state)
  };
};

const actions = {
  onStartEntry: startEntry
};

export default connect(
  props,
  actions
)(ClientsIndexQuery);
