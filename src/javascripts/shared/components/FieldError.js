import PropTypes from 'javascripts/prop-types';
import React from 'react';
import posed from 'react-pose';

const DURATION = 250;

const FadeIn = posed.div({
  enter: { height: 'auto', opacity: 1, transition: { duration: DURATION } },
  exit: { height: 0, opacity: 0, transition: { duration: DURATION } }
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
      open: props.error && props.touched,
      show: props.error && props.touched
    };
  }

  componentDidUpdate() {
    const { error, touched } = this.props;
    const { error: stateError, open: stateOpen, show } = this.state;

    if (error && error !== stateError) {
      this.setState({ error });
    }

    const open = Boolean(touched && error);

    if (!stateOpen && open) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = null;

      this.setState({ open: true, show: false });
      this.timeout = setTimeout(() => {
        this.setState({ open: true, show: true });
      }, 1);
    } else if (show && !open) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = null;
      this.setState({ open: true, show: false });

      this.timeout = setTimeout(() => {
        this.setState({ error: null, open: false, show: false });
      }, DURATION);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const { error, open, show } = this.state;

    if (!open) {
      return null;
    }

    return (
      <FadeIn
        className="text-red text-sm pt-1 overflow-hidden"
        pose={show ? 'enter' : 'exit'}
      >
        {error}
      </FadeIn>
    );
  }
}

export default FieldError;
