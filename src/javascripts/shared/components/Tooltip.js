import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import posed from 'react-pose';
import styled from 'styled-components';

const FadeIn = posed.div({
  hide: {
    opacity: 0,
    transition: { duration: 250 }
  },
  show: {
    opacity: 1,
    transition: { duration: 250 }
  }
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
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleMouseOut = this._handleMouseOut.bind(this);
    this._handleMouseOver = this._handleMouseOver.bind(this);

    this.element = React.createRef();
  }

  state = {
    hover: false,
    show: false
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleMouseOut() {
    this.setState({ hover: false });

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.setState({ show: false });
    }, 250);
  }

  _handleMouseOver() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.setState({ hover: true, show: true });
  }

  render() {
    const { children, title } = this.props;
    const { hover, show } = this.state;

    const titleClasses = cx(
      'fixed bg-black text-white p-2 rounded text-sm z-20 shadow-md',
      { hidden: !show }
    );

    let tooltipStyles = {};
    if (show && this.element) {
      const rect = this.element.current.getBoundingClientRect();

      tooltipStyles = {
        left: rect.left + (rect.width / 2),
        top: rect.top - 10
      };
    }

    return (
      <React.Fragment>
        <Portal>
          {show &&
            <Title
              className={titleClasses}
              pose={hover ? 'show' : 'hide'}
              style={tooltipStyles}
            >
              {title}
            </Title>}
        </Portal>
        <div
          onMouseOut={this._handleMouseOut}
          onMouseOver={this._handleMouseOver}
          ref={this.element}
        >
          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default Tooltip;
