import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import posed from 'react-pose';

const DURATION = 300;

const FadeIn = posed.div({
  enter: {
    height: 'auto',
    opacity: 1,
    transition: { duration: DURATION }
  },
  exit: {
    applyAtStart: { position: 'static' },
    height: 0,
    opacity: 0,
    transition: { duration: DURATION }
  }
});

class FieldHelper extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    open: PropTypes.bool
  }

  static defaultProps = {
    className: null,
    message: null,
    open: false
  }

  constructor(props) {
    super(props);

    this.state = {
      message: props.message,
      show: props.open
    };

    this._handlePoseComplete = this._handlePoseComplete.bind(this);
  }

  componentDidUpdate() {
    const { message, open } = this.props;
    const { message: stateMessage, show } = this.state;

    if (message && message !== stateMessage) {
      this.setState({ message });
    }

    if (open && !show) {
      this.setState({ show: true });
    }
  }

  _handlePoseComplete() {
    const { open } = this.props;

    this.setState({ show: open });
  }

  render() {
    const { className, open } = this.props;
    const { message: stateMessage, show } = this.state;

    if (!show) {
      return null;
    }

    const fadeInClasses = cx('text-sm pt-1 overflow-hidden', className);

    return (
      <FadeIn
        className={fadeInClasses}
        initialPose="exit"
        onPoseComplete={this._handlePoseComplete}
        pose={open ? 'enter' : 'exit'}
      >
        {stateMessage}
      </FadeIn>
    );
  }
}

export default FieldHelper;
