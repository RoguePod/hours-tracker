/* eslint-disable max-lines */
import { Dropdown, FieldError, InputBase } from "javascripts/shared/components";
import { ONE_PX, isBlank } from "javascripts/globals";

import ProjectRow from "./ProjectRow";
import PropTypes from "javascripts/prop-types";
import { Query } from "react-apollo";
import React from "react";
import _get from "lodash/get";
import gql from "graphql-tag";
import styled from "styled-components";

const Divider = styled.div`
  height: ${ONE_PX};
`;

const PROJECTS_SHOW_QUERY = gql`
  query ProjectsShow($id: ID!) {
    projectsShow(id: $id) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;
const PROJECTS_INDEX_QUERY = gql`
  query ProjectsIndex($query: String!) {
    projectsIndex(query: $query) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

class ProjectField extends React.Component {
  static propTypes = {
    billableField: PropTypes.string,
    clientField: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    focused: PropTypes.bool.isRequired,
    form: PropTypes.form.isRequired,
    onChange: PropTypes.func,
    projectQuery: PropTypes.gqlQuery.isRequired,
    projects: PropTypes.arrayOf(PropTypes.project).isRequired,
    projectsQuery: PropTypes.gqlQuery.isRequired,
    query: PropTypes.string.isRequired,
    setFocused: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired
  };

  static defaultProps = {
    billableField: null,
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
  }

  shouldComponentUpdate() {
    return true;
  }

  changing = false;

  _handleChange({ target: { value } }) {
    const { setQuery } = this.props;

    setQuery(value);
  }

  _handleDropdownChange(project) {
    const { setFocused } = this.props;

    this.changing = true;

    const {
      billableField,
      clientField,
      field,
      form: { setFieldTouched, setFieldValue },
      onChange
    } = this.props;

    if (_get(project, "id") !== _get(field, "value")) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, project.id);

      if (clientField) {
        setFieldTouched(clientField, true);
        setFieldValue(clientField, project.client.id);
      }

      if (billableField) {
        setFieldTouched(billableField, true);
        setFieldValue(billableField, project.billable);
      }

      if (onChange) {
        setTimeout(() => onChange(project.id), 1);
      }
    }

    setFocused(false);
  }

  _handleBlur() {
    const {
      billableField,
      clientField,
      field,
      form: { setFieldTouched, setFieldValue },
      onChange,
      query,
      setFocused
    } = this.props;

    if (this.changing) {
      return;
    }

    if (query.length === 0) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, null);

      if (clientField) {
        setFieldTouched(clientField, true);
        setFieldValue(clientField, null);
      }

      if (billableField) {
        setFieldTouched(billableField, true);
        setFieldValue(billableField, false);
      }

      if (onChange) {
        setTimeout(() => onChange(null), 1);
      }
    }

    setFocused(false);
  }

  _handleFocus({ target }) {
    const { setFocused } = this.props;

    this.changing = false;

    setFocused(true);
    setTimeout(() => target.select(), 1);
  }

  render() {
    const {
      billableField,
      clientField,
      disabled,
      field,
      focused,
      form: { errors, isSubmitting, touched },
      projectQuery: { loading, networkStatus },
      projects,
      projectsQuery,
      query,
      ...rest
    } = this.props;

    const hasError = errors[field.name] && touched[field.name];

    const rows = projects.map((project, index) => {
      return (
        <React.Fragment key={project.id}>
          {index > 0 && <Divider className="bg-grey-lighter" />}
          <ProjectRow onChange={this._handleDropdownChange} project={project} />
        </React.Fragment>
      );
    });

    const noResultsClasses = "px-3 py-2 text-center font-bold text-sm";

    return (
      <div className="relative">
        <InputBase
          {...rest}
          disabled={networkStatus !== 7 || loading || disabled || isSubmitting}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          value={query}
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

const ProjectsSearchQuery = props => {
  const { project, projectQuery } = props;
  const [focused, setFocused] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!focused) {
      if (projectQuery.networkStatus === 7 && props.project) {
        setQuery(`${project.client.name} - ${project.name}`);
      } else {
        setQuery("");
      }
    }
  }, [focused, project, projectQuery.networkStatus]);

  return (
    <Query
      query={PROJECTS_INDEX_QUERY}
      skip={isBlank(query) || !focused}
      variables={{ query }}
    >
      {projectsQuery => {
        const projects = _get(projectsQuery, "data.projectsIndex", []);

        return (
          <ProjectField
            {...props}
            focused={focused}
            projects={projects}
            projectsQuery={projectsQuery}
            query={query}
            setFocused={setFocused}
            setQuery={setQuery}
          />
        );
      }}
    </Query>
  );
};

ProjectsSearchQuery.propTypes = {
  project: PropTypes.project,
  projectQuery: PropTypes.gqlQuery.isRequired
};

ProjectsSearchQuery.defaultProps = {
  project: null
};

const ProjectQuery = props => {
  const id = _get(props, "field.value");

  return (
    <Query query={PROJECTS_SHOW_QUERY} variables={{ id }}>
      {query => {
        const project = _get(query, "data.projectsShow");

        return (
          <ProjectsSearchQuery
            {...props}
            project={project}
            projectQuery={query}
          />
        );
      }}
    </Query>
  );
};

export default ProjectQuery;
