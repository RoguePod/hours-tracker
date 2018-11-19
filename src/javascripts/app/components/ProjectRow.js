import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ProjectRow extends React.Component {
  static propTypes = {
    onProjectClick: PropTypes.func.isRequired,
    project: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleClick() {
    const { onProjectClick, project } = this.props;

    onProjectClick(project);
  }

  render() {
    const { project } = this.props;
    const projectClasses =
      'hover:bg-yellow-light cursor-pointer px-3 py-2 text-sm transition';

    return (
      <li
        className={projectClasses}
        onClick={this._handleClick}
      >
        {project.name}
      </li>
    );
  }
}

export default ProjectRow;
