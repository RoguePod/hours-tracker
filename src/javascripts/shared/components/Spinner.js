import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import posed from 'react-pose';
import styled from 'styled-components';

const DURATION = 250;

const FadeIn = posed.div({
  enter: { opacity: 1, transition: { duration: DURATION } },
  exit: { opacity: 0, transition: { duration: DURATION } }
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

  componentDidUpdate(prevProps) {
    const { spinning, text } = this.props;

    if (spinning !== prevProps.spinning) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = null;

      if (spinning && !prevProps.spinning) {
        this.setState({ open: true, show: false, text });
        this.timeout = setTimeout(() => {
          this.setState({ open: true, show: true });
        }, 1);
      } else if (!spinning && prevProps.spinning) {
        this.setState({ open: true, show: false });

        this.timeout = setTimeout(() => {
          this.setState({ open: false, show: false, text: null });
        }, DURATION);
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  render() {
    const { page } = this.props;
    const { open, show, text } = this.state;

    if (!open) {
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
            pose={show ? 'enter' : 'exit'}
          >
            {children}
          </Page>
        </Portal>
      );
    }

    return (
      <FadeIn
        className={cx(shadeClassName, 'absolute')}
        pose={show ? 'enter' : 'exit'}
      >
        {children}
      </FadeIn>
    );
  }
}

export default Spinner;
