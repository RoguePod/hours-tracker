import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';
import styled from 'styled-components';

const Input = styled.input`
  &:disabled {
    background-color: #dae1e7;
    cursor: not-allowed;
  }
`;

class InputBase extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    error: PropTypes.bool,
    id: PropTypes.string,
    type: PropTypes.string
  }

  static defaultProps = {
    className: null,
    error: false,
    id: null,
    type: 'text'
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
    const { className, error, ...rest } = this.props;
    const { id } = this.state;

    const inputClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !error,
        'border-red': error,
        'focus:border-blue-light': !error,
        'focus:border-red': error
      },
      className
    );

    return (
      <Input
        {...rest}
        className={inputClassName}
        id={id}
      />
    );
  }
}

export default InputBase;
