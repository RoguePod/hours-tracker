import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';
import styled from 'styled-components';

const Select = styled.select`
  &:disabled {
    background-color: #dae1e7;
    cursor: not-allowed;
  }
`;

class SelectBase extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    error: PropTypes.bool,
    id: PropTypes.string
  }

  static defaultProps = {
    children: null,
    className: null,
    error: false,
    id: null
  }

  constructor(props) {
    super(props);

    this.state = {
      id: props.id || _uniqueId('input_')
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      if (id) {
        this.setState({ id });
      } else if (!id && prevProps.id) {
        this.setState({ id: _uniqueId('input_') });
      }
    }
  }

  id() {
    const { id } = this.state;
    return id;
  }

  render() {
    const { children, className, error, ...rest } = this.props;
    const { id } = this.state;

    const inputClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none bg-white cursor-pointer h-full ' +
      'transition',
      {
        'border-grey-light': !error,
        'border-red': error,
        'focus:border-blue-light': !error,
        'focus:border-red': error
      },
      className
    );

    const arrowClasses =
      'pointer-events-none absolute pin-y pin-r flex items-center px-4';

    return (
      <div className="relative">
        <Select
          {...rest}
          className={inputClassName}
          id={id}
        >
          {children}
        </Select>
        <div className={arrowClasses}>
          <FontAwesomeIcon
            icon="caret-down"
          />
        </div>
      </div>
    );
  }
}

export default SelectBase;
