import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import posed from 'react-pose';
import styled from 'styled-components';

const duration = 250;

const FadeIn = posed.div({
  enter: { opacity: 1, transition: { duration } },
  exit: { opacity: 0, transition: { duration } }
});

const Page = styled(FadeIn)`
  bottom: 0;
  left: 16rem;
  right: 0;
  top: 62px;

  @media (max-width: 768px) {
    left: 0;
  }
`;

class Spinner extends React.PureComponent {
  static propTypes = {
    page: PropTypes.bool,
    spinning: PropTypes.bool,
    text: PropTypes.string
  }

  static defaultProps = {
    page: false,
    spinning: false,
    text: null
  }

  constructor(props) {
    super(props);

    this.state = {
      open: props.spinning,
      show: props.spinning,
      text: props.text
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { spinning, text } = nextProps;
    const { open } = prevState;

    if (spinning && !open) {
      return { open: true, show: true, text };
    } else if (!spinning && open) {
      return { open: false };
    }

    return null;
  }

  componentDidUpdate(_prevProps, nextState) {
    const { open } = this.state;

    if (open !== nextState.open) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.setState({ show: false });
      }, duration);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = null;
  }

  render() {
    const { page } = this.props;
    const { open, show, text } = this.state;

    if (!show) {
      return false;
    }

    const shadeClassName =
      'pin z-10 overflow-hidden bg-smoke flex items-center ' +
      'justify-center text-white flex-col';

    const children = (
      <React.Fragment>
        <div className="flex flex-row items-center">
          <FontAwesomeIcon
            icon="clock"
            pulse
            size="3x"
          />
        </div>
        {text && text.length > 0 &&
          <div className="pt-4 px-4 text-center">
            {text}
          </div>}
      </React.Fragment>
    );

    if (page) {
      return (
        <Portal>
          <Page
            className={cx(shadeClassName, 'fixed')}
            pose={open ? 'enter' : 'exit'}
          >
            {children}
          </Page>
        </Portal>
      );
    }

    return (
      <FadeIn
        className={cx(shadeClassName, 'absolute')}
        pose={open ? 'enter' : 'exit'}
      >
        {children}
      </FadeIn>
    );
  }
}

export default Spinner;
