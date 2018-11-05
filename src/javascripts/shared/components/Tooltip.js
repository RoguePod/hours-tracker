import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import posed from 'react-pose';
import styled from 'styled-components';

const FadeIn = posed.div({
  hide: { opacity: 0, transition: { duration: 250 } },
  show: { opacity: 1, transition: { duration: 250 } }
});

const Title = styled(FadeIn)`
  bottom: 100%;
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
      'absolute bg-black text-white p-2 rounded text-sm z-10', { hidden: !show }
    );

    return (
      <div
        className="relative"
        onMouseOut={this._handleMouseOut}
        onMouseOver={this._handleMouseOver}
      >
        <Title
          className={titleClasses}
          pose={hover ? 'show' : 'hide'}
        >
          {title}
        </Title>
        {children}
      </div>
    );
  }
}

export default Tooltip;
