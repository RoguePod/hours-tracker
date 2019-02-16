import PropTypes from "javascripts/prop-types";
import React from "react";
import { Transition } from "javascripts/shared/components";

class ProjectRow extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    project: PropTypes.shape({
      projectName: PropTypes.string.isRequired
    }).isRequired
  };

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
      "hover:bg-blue-lighter cursor-pointer px-3 py-2 text-sm text-blue";

    return (
      <li>
        <Transition
          className={projectClasses}
          onMouseDown={this._handleMouseDown}
          role="button"
          tabIndex="-1"
        >
          {project.projectName}
        </Transition>
      </li>
    );
  }
}

export default ProjectRow;
