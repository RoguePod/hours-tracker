import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import _isElement from 'lodash/isElement';
import cx from 'classnames';
import posed from 'react-pose';
import styled from 'styled-components';

const FadeIn = posed.div({
  hide: { opacity: 0, transition: { duration: 250 } },
  show: { opacity: 1, transition: { duration: 250 } }
});

const Title = styled(FadeIn)`
  transform: translate(-50%, -100%) !important;

  &::after {
    border: solid transparent;
    border-color: rgba(136, 183, 213, 0);
    border-top-color: #22292f;
    border-width: 10px;
    content: ' ';
    height: 0;
    left: 50%;
    margin-left: -10px;
    pointer-events: none;
    position: absolute;
    top: 95%;
    width: 0;
  }
`;

class Tooltip extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    title: PropTypes.string.isRequired
  }

  static defaultProps = {
    onMouseEnter: null,
    onMouseLeave: null
  }

  constructor(props) {
    super(props);

    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
    this._handlePoseComplete = this._handlePoseComplete.bind(this);
  }

  state = {
    hover: false,
    show: false
  }

  shouldComponentUpdate() {
    return true;
  }

  _element = null

  _handleMouseEnter(event) {
    const { onMouseEnter } = this.props;

    this.setState({ hover: true, show: true });

    if (onMouseEnter) {
      onMouseEnter(event);
    }
  }

  _handleMouseLeave(event) {
    const { onMouseLeave } = this.props;

    this.setState({ hover: false });

    if (onMouseLeave) {
      onMouseLeave(event);
    }
  }

  _handlePoseComplete() {
    const { hover } = this.state;

    this.setState({ show: hover });
  }

  render() {
    const { children, title, ...rest } = this.props;
    const { hover, show } = this.state;

    const titleClasses = cx(
      'fixed bg-black text-white p-2 rounded text-sm z-20 shadow-md',
      'text-center',
      { hidden: !show }
    );

    let tooltipStyles = {};
    if (show && this._element) {
      const rect = this._element.getBoundingClientRect();

      tooltipStyles = {
        left: rect.left + (rect.width / 2),
        top: rect.top - 10
      };
    }

    const child = React.Children.only(children);
    const trigger = React.cloneElement(child, {
      ...rest,
      onMouseEnter: this._handleMouseEnter,
      onMouseLeave: this._handleMouseLeave,
      ref: (node) => {
        // Keep your own reference
        if (_isElement(node)) {
          this._element = node;
        } else {
          /* eslint-disable react/no-find-dom-node */
          this._element = ReactDOM.findDOMNode(node);
          /* eslint-enable react/no-find-dom-node */
        }

        // Call the original ref, if any
        const { ref } = child;

        if (typeof ref === 'function') {
          ref(node);
        }
      }
    });

    return (
      <>
        {trigger}
        {show && this._element &&
          <Portal>
            <Title
              className={titleClasses}
              initialPose="hide"
              onPoseComplete={this._handlePoseComplete}
              pose={hover ? 'show' : 'hide'}
              style={tooltipStyles}
            >
              {title}
            </Title>
          </Portal>}
      </>
    );
  }
}

export default Tooltip;
