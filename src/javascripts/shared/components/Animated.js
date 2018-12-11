import PropTypes from 'javascripts/prop-types';
import React from 'react';
import posed from 'react-pose';

class Animated extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    duration: PropTypes.number,
    show: PropTypes.bool
  };

  static defaultProps = {
    children: null,
    duration: 300,
    show: false
  }

  constructor(props) {
    super(props);

    this.state = {
      render: props.show
    };
  }

  componentDidUpdate(prevProps) {
    const { duration, show } = this.props;

    if (prevProps.show && !show) {
      this.timeout = setTimeout(() => {
        this.setState({ render: false })
      }, duration);
    } else if (!prevProps.show && show) {
      this.setState({ render: true });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const { children } = this.props;
    const { render } = this.state;

    if (render) {
      return children;
    }

    return null;
  }
}

export default Animated;
