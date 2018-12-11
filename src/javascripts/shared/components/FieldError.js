import PropTypes from 'javascripts/prop-types';
import React from 'react';
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

class FieldError extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    touched: PropTypes.bool
  };

  static defaultProps = {
    error: null,
    touched: false
  }

  constructor(props) {
    super(props);

    this.state = {
      error: props.error,
      show: props.error && props.touched
    };

    this._handlePoseComplete = this._handlePoseComplete.bind(this);
  }

  componentDidUpdate() {
    const { error, touched } = this.props;
    const { error: stateError, show } = this.state;

    if (error && error !== stateError) {
      this.setState({ error });
    }

    const open = Boolean(touched && error);

    if (open && !show) {
      this.setState({ show: true });
    }
  }

  _handlePoseComplete() {
    const { error, touched } = this.props;
    const show = Boolean(touched && error);

    this.setState({ show });
  }

  render() {
    const { error, touched } = this.props;
    const { error: stateError, show } = this.state;

    if (!show) {
      return null;
    }

    const open = Boolean(touched && error);

    return (
      <FadeIn
        className="text-red text-sm pt-1 overflow-hidden"
        initialPose="exit"
        onPoseComplete={this._handlePoseComplete}
        pose={open ? 'enter' : 'exit'}
      >
        {stateError}
      </FadeIn>
    );
  }
}

export default FieldError;
