import { CSSTransition } from 'react-transition-group';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styled from 'styled-components';

const DURATION = 300;

const FadeIn = styled.div`
  &.fade-enter {
    opacity: 0.01;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0.01;
    transition: opacity ${DURATION}ms ease;
  }
`;

const TopArrow = styled.div`
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
`;

const RightArrow = styled.div`
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
`;

const BottomArrow = styled.div`
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
`;

const LeftArrow = styled.div`
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
`;

const getPositionStyles = (elementRect, position) => {
  switch (position) {
    case 'left':
      return {
        arrow: <LeftArrow className="w-0 h-0 border-l-8 border-black" />,
        iconStyles: {
          right: '-8px',
          top: '50%',
          transform: 'translateY(-50%)'
        },
        tooltipStyles: {
          left: elementRect.left - 10,
          top: elementRect.top + elementRect.height / 2,
          transform: 'translate(-100%, -50%)'
        }
      };
    case 'right':
      return {
        arrow: <RightArrow className="w-0 h-0 border-r-8 border-black" />,
        iconStyles: {
          left: '-8px',
          top: '50%',
          transform: 'translateY(-50%)'
        },
        tooltipStyles: {
          left: elementRect.left + elementRect.width + 10,
          top: elementRect.top + elementRect.height / 2,
          transform: 'translate(0%, -50%)'
        }
      };
    case 'bottom':
      return {
        arrow: <BottomArrow className="w-0 h-0 border-b-8 border-black" />,
        iconStyles: {
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)'
        },
        tooltipStyles: {
          left: elementRect.left + elementRect.width / 2,
          top: elementRect.top + elementRect.height + 10,
          transform: 'translate(-50%, 0%)'
        }
      };
    default:
      return {
        arrow: <TopArrow className="w-0 h-0 border-t-8 border-black" />,
        iconStyles: {
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)'
        },
        tooltipStyles: {
          left: elementRect.left + elementRect.width / 2,
          top: elementRect.top - 10,
          transform: 'translate(-50%, -100%)'
        }
      };
  }
};

const preserveRef = (ref, node) => {
  if (ref) {
    if (typeof ref === 'function') {
      ref(node);
    }
    if ({}.hasOwnProperty.call(ref, 'current')) {
      ref.current = node;
    }
  }
};

const Tooltip = ({ children, position: initialPosition, title, ...rest }) => {
  const [hover, setHover] = React.useState(false);
  const [position, setPosition] = React.useState(initialPosition);
  const triggerRef = React.useRef();

  const _handleScroll = () => {
    setHover(false);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', _handleScroll);

    return () => {
      window.removeEventListener('scroll', _handleScroll);
    };
  }, []);

  const _handleMouseEnter = (event, child) => {
    setHover(true);

    if (child.onMouseEnter) {
      child.onMouseEnter(event);
    }
  };

  const _handleMouseLeave = (event, child) => {
    setHover(false);

    if (child.onMouseLeave) {
      child.onMouseLeave(event);
    }
  };

  let options = {
    iconStyles: {},
    tooltipStyles: {}
  };

  if (triggerRef.current) {
    options = getPositionStyles(
      triggerRef.current.getBoundingClientRect(),
      position
    );
  }

  const child = React.Children.only(children);
  const trigger = React.cloneElement(child, {
    ...rest,
    ...child.props,
    onMouseEnter: (event) => _handleMouseEnter(event, child),
    onMouseLeave: (event) => _handleMouseLeave(event, child),
    ref: (node) => {
      triggerRef.current = node;
      preserveRef(child.ref, node);
    }
  });

  const _handleEnter = (tooltipElement) => {
    const { bottom, left, right, top } = tooltipElement.getBoundingClientRect();

    if (position === 'top' && top < 0) {
      setPosition('bottom');
    } else if (position === 'bottom' && bottom > window.innerHeight) {
      setPosition('top');
    } else if (position === 'right' && right > window.innerWidth) {
      setPosition('left');
    } else if (position === 'left' && left < 0) {
      setPosition('right');
    }
  };

  const _handleExited = () => {
    setPosition(initialPosition);
  };

  const bubbleClasses =
    'bg-black max-w-sm p-2 rounded text-center text-white text-xs w-full';

  return (
    <>
      {trigger}
      {triggerRef.current && (
        <Portal>
          <CSSTransition
            classNames="fade"
            in={hover}
            mountOnEnter
            onEnter={_handleEnter}
            onExited={_handleExited}
            timeout={DURATION}
            unmountOnExit
          >
            <FadeIn className="fixed z-80" style={options.tooltipStyles}>
              <div
                className={bubbleClasses}
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <div className="absolute" style={options.iconStyles}>
                {options.arrow}
              </div>
            </FadeIn>
          </CSSTransition>
        </Portal>
      )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.string,
  title: PropTypes.string.isRequired
};

Tooltip.defaultProps = {
  position: 'top'
};

export default Tooltip;
