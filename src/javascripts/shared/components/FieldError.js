import posed, { PoseGroup } from 'react-pose';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FadeIn = posed.div({
  enter: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 }
});

class FieldError extends React.Component {
  state = {
    error: null,
    show: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { touched, error } = this.props;
    const { error: stateError, show } = this.state;

    return (
      nextProps.touched !== touched ||
      nextProps.error !== error ||
      nextState.error !== stateError ||
      nextState.show !== show
    );
  }

  componentDidUpdate() {
    const { error, touched } = this.props;
    const { error: stateError } = this.state;

    /* eslint-disable react/no-did-update-set-state */
    if (touched) {
      if (error && error !== stateError) {
        this.setState({ error, show: true });
      } else if (!error && stateError) {
        this.setState({ show: false });
        setTimeout(() => {
          this.setState({ error: null });
        }, 300);
      }
    }
    /* eslint-enable react/no-did-update-set-state */
  }

  render() {
    const { error, show } = this.state;

    return (
      <PoseGroup>
        {show &&
          <FadeIn
            className="text-red text-sm pt-1 overflow-hidden"
            key="fadeIn"
          >
            {error}
          </FadeIn>}
      </PoseGroup>
    );
  }
}

FieldError.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool
};

FieldError.defaultProps = {
  error: null,
  touched: false
};

export default FieldError;
