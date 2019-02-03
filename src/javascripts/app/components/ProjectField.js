import { FieldError, InputBase, Label } from 'javascripts/shared/components';
import { firestore, isBlank } from 'javascripts/globals';

import Fuse from 'fuse.js';
import ProjectsDropdown from './ProjectsDropdown';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _find from 'lodash/find';
import _groupBy from 'lodash/groupBy';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { selectQueryableProjects } from 'javascripts/app/redux/clients';

const fuseOptions = {
  distance: 100,
  keys: ['name', 'projects.name'],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  threshold: 0.1
};

class ProjectField extends React.Component {
  static propTypes = {
    clientField: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    label: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.shape({
      clientId: PropTypes.string.isRequired,
      clientName: PropTypes.string.isRequired,
      projectId: PropTypes.string.isRequired,
      projectName: PropTypes.string.isRequired
    })).isRequired,
    ready: PropTypes.bool.isRequired,
    required: PropTypes.bool
  }

  static defaultProps = {
    disabled: false,
    label: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.input = React.createRef();
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
      field: { name, value }, form: { touched }, projects, ready
    } = this.props;

    const isTouched = touched[name];
    if (!isTouched && (prevProps.field.value !== value ||
        !_isEqual(projects, prevProps.projects) || ready !== prevProps.ready)) {
      this.setState({
        value: this._findValue(value)
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  timeout = null

  _handleChange({ target: { value } }) {
    const { field: { name }, form: { setFieldTouched } } = this.props;

    setFieldTouched(name, true);
    this.setState({ value });
  }

  _handleDropdownChange(project) {
    const {
      clientField, field: { name }, form: { setFieldTouched, setFieldValue }
    } = this.props;

    setFieldTouched(name, true);
    setFieldValue(name, project.projectRef);
    setFieldValue(clientField, project.clientRef);
    this.setState({
      focused: false, value: this._findValue(project.projectRef)
    });

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  _handleBlur() {
    const {
      clientField, field, form: { setFieldValue }
    } = this.props;
    const { value } = this.state;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        setFieldValue(field.name, null);
        setFieldValue(clientField, null);
        this.setState({ focused: false, value: this._findValue(null) });
      } else {
        this.setState({ focused: false, value: this._findValue(field.value) });
      }
    }, 300);
  }

  _handleFocus({ target }) {
    const { field: { value } } = this.props;

    this.setState({ focused: true, value: this._findValue(value) }, () => {
      setTimeout(() => {
        target.select();
      }, 1);
    });
  }

  _findValue(projectRef) {
    const { projects, ready } = this.props;

    if (!ready || isBlank(projectRef)) {
      return '';
    }

    const foundProject = _find(projects, (project) => {
      return project.projectId === projectRef.id;
    });

    if (foundProject) {
      return `${foundProject.clientName} - ${foundProject.projectName}`;
    }

    return '';
  }

  _findResults(value) {
    const { projects } = this.props;

    if (projects.length === 0 || isBlank(value)) {
      return {};
    }

    const options = {
      ...fuseOptions,
      keys: ['clientName', 'projectName']
    };

    const searchResults = new Fuse(projects, options).search(value);
    const results       = {};
    const groups        = _groupBy(searchResults, 'clientId');

    for (const clientId of Object.keys(groups)) {
      const group = groups[clientId];

      results[clientId] = {
        name: group[0].clientName,
        projects: group.map((result) => {
          const projectRef = firestore
            .doc(`clients/${result.clientId}/projects/${result.projectId}`);

          return {
            clientRef: firestore.doc(`clients/${result.clientId}`),
            id: result.projectId,
            name: result.projectName,
            projectRef
          };
        })
      };
    }

    return results;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      clientField, disabled, field, form: { errors, isSubmitting, touched },
      label, ready, required, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const { focused, value } = this.state;
    const hasError = errors[field.name] && touched[field.name];
    const results = focused ? this._findResults(value) : {};

    return (
      <div className="relative">
        {label && label.length > 0 &&
          <Label
            error={hasError}
            htmlFor={this.input?.current?.id()}
            required={required}
          >
            {label}
          </Label>}
        <InputBase
          {...rest}
          disabled={!ready || disabled || isSubmitting}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          ref={this.input}
          value={value}
        />
        <ProjectsDropdown
          clients={results}
          error={hasError}
          focused={focused}
          onProjectClick={this._handleDropdownChange}
        />
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </div>
    );
  }
}

const props = (state) => {
  return {
    projects: selectQueryableProjects(state),
    ready: state.clients.ready
  };
};

const actions = {};

export default connect(props, actions)(ProjectField);
