import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ProjectRow extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    project: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);

    this._handleMouseDown = this._handleMouseDown.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleMouseDown() {
    const { onChange, project } = this.props;

    onChange(project);
  }

  render() {
    const { project } = this.props;
    const projectClasses =
      'hover:bg-blue-lighter cursor-pointer px-3 py-2 text-sm transition ' +
      'text-blue';

    return (
      <li
        className={projectClasses}
        onMouseDown={this._handleMouseDown}
      >
        {project.name}
      </li>
    );
  }
}

export default ProjectRow;
