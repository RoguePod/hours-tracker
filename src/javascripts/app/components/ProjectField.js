import { Dropdown, FieldError, InputBase } from "javascripts/shared/components";
import { ONE_PX, isBlank } from "javascripts/globals";
import {
  fuseOptions,
  selectQueryableProjects
} from "javascripts/app/redux/clients";

import Fuse from "fuse.js";
import ProjectRow from "./ProjectRow";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _find from "lodash/find";
import _get from "lodash/get";
import _groupBy from "lodash/groupBy";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import styled from "styled-components";

const Divider = styled.div`
  height: ${ONE_PX};
`;

class ProjectField extends React.Component {
  static propTypes = {
    clientField: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    onChange: PropTypes.func,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        clientId: PropTypes.string.isRequired,
        clientName: PropTypes.string.isRequired,
        projectId: PropTypes.string.isRequired,
        projectName: PropTypes.string.isRequired
      })
    ).isRequired,
    ready: PropTypes.bool.isRequired
  };

  static defaultProps = {
    clientField: null,
    disabled: false,
    onChange: null
  };

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
    this._handleDropdownChange = this._handleDropdownChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._findValue = this._findValue.bind(this);

    this.state = {
      focused: false,
      value: this._findValue(props.field.value)
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const {
      field: { value },
      projects,
      ready
    } = this.props;

    if (
      !_isEqual(prevProps.field.value, value) ||
      !_isEqual(projects, prevProps.projects) ||
      ready !== prevProps.ready
    ) {
      this.setState({
        value: this._findValue(value)
      });
    }
  }

  changing = false;

  _handleChange({ target: { value } }) {
    this.setState({ value });
  }

  _handleDropdownChange(project) {
    this.changing = true;

    const {
      clientField,
      field,
      form: { setFieldTouched, setFieldValue },
      onChange
    } = this.props;

    if (_get(project, "projectId") !== _get(field, "value")) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, project.projectId);

      if (clientField) {
        setFieldTouched(clientField, true);
        setFieldValue(clientField, project.clientId);
      }

      if (onChange) {
        setTimeout(() => onChange(project.projectId), 1);
      }
    }

    this.setState({
      focused: false,
      value: this._findValue(project.projectId)
    });
  }

  _handleBlur() {
    const {
      clientField,
      field,
      form: { setFieldTouched, setFieldValue },
      onChange
    } = this.props;
    const { value } = this.state;

    if (this.changing) {
      return;
    }

    if (value.length === 0) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, null);

      if (clientField) {
        setFieldTouched(clientField, true);
        setFieldValue(clientField, null);
      }

      if (onChange) {
        setTimeout(() => onChange(null), 1);
      }

      this.setState({ focused: false, value: this._findValue(null) });
    } else {
      this.setState({ focused: false, value: this._findValue(field.value) });
    }
  }

  _handleFocus({ target }) {
    this.changing = false;
    const {
      field: { value }
    } = this.props;

    this.setState({ focused: true, value: this._findValue(value) }, () => {
      setTimeout(() => target.select(), 1);
    });
  }

  _findValue(projectId) {
    const { projects, ready } = this.props;

    if (!ready || isBlank(projectId)) {
      return "";
    }

    const foundProject = _find(projects, project => {
      return project.projectId === projectId;
    });

    if (foundProject) {
      return `${foundProject.clientName} - ${foundProject.projectName}`;
    }

    return "";
  }

  _findResults(value) {
    const { projects } = this.props;

    const options = {
      ...fuseOptions,
      keys: ["clientName", "projectName"]
    };

    let searchResults = projects;

    if (!isBlank(value)) {
      searchResults = new Fuse(projects, options).search(value);
    }

    const results = {};
    const groups = _groupBy(searchResults, "clientId");

    for (const clientId of Object.keys(groups)) {
      const group = groups[clientId];

      results[clientId] = {
        name: group[0].clientName,
        projects: group
      };
    }

    return results;
  }

  render() {
    const {
      clientField,
      disabled,
      field,
      form: { errors, isSubmitting, touched },
      ready,
      ...rest
    } = this.props;

    const { focused, value } = this.state;
    const hasError = errors[field.name] && touched[field.name];
    const clients = focused ? this._findResults(value) : {};

    const rows = Object.keys(clients).map(clientId => {
      const result = clients[clientId];
      const projects = result.projects.map(project => {
        return (
          <React.Fragment key={project.projectId}>
            <Divider className="bg-grey-lighter" />
            <ProjectRow
              onChange={this._handleDropdownChange}
              project={project}
            />
          </React.Fragment>
        );
      });

      return (
        <React.Fragment key={clientId}>
          <div className="bg-blue-light p-2 font-bold text-white">
            {result.name}
          </div>
          <ul className="list-reset">{projects}</ul>
        </React.Fragment>
      );
    });

    const noResultsClasses = "px-3 py-2 text-center font-bold text-sm";

    return (
      <div className="relative">
        <InputBase
          {...rest}
          disabled={!ready || disabled || isSubmitting}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          value={value}
        />
        <Dropdown error={hasError} maxHeight="18rem" open={focused}>
          {rows.length === 0 && (
            <div className={noResultsClasses}>{"No Results Found"}</div>
          )}
          {rows.length > 0 && rows}
        </Dropdown>
        <FieldError
          error={errors[field.name]}
          touched={Boolean(touched[field.name])}
        />
      </div>
    );
  }
}

const props = state => {
  return {
    projects: selectQueryableProjects(state),
    ready: state.clients.ready
  };
};

const actions = {};

export default connect(
  props,
  actions
)(ProjectField);
