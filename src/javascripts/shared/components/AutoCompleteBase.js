/* eslint-disable max-lines */
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import Dropdown from './Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputBase from './InputBase';
import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Spinner from './Spinner';
import Transition from './Transition';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';
import { useId } from 'javascripts/shared/hooks';

const Button = styled.button`
  transition: border 300ms ease;
`;

const Scroll = styled.div`
  max-height: 18rem;
`;

const AutoCompleteBase = (props) => {
  const {
    buttonClassName,
    defaultPath,
    defaultQuery,
    defaultParams,
    disabled,
    error: fieldError,
    label,
    onChange,
    otherParams,
    pathLabel,
    pathValue,
    placeholder,
    remove,
    renderLabel,
    renderRow,
    required,
    searchPath,
    searchQuery,
    touched,
    value,
    ...rest
  } = props;

  const id = useId(rest.id);
  const node = React.useRef(null);
  const input = React.useRef(null);
  const timer = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState(value);
  const [defaultLabel, setDefaultLabel] = React.useState('');
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const client = useApolloClient();

  const _handleDefaultQuery = () => {
    if (defaultQuery && defaultPath) {
      setDefaultLoading(true);

      client
        .query({
          query: defaultQuery,
          variables: { id: value }
        })
        .then(({ data: defaultData }) => {
          const data = _get(defaultData, `${defaultPath}`);
          setDefaultLabel(
            renderLabel ? renderLabel(data) : _get(data, pathLabel, '')
          );
          setDefaultLoading(false);
          setDefaultValue(value);
        })
        .catch(() => {
          setDefaultLabel('');
          setDefaultLoading(false);
          setDefaultValue(null);
        });
    }
  };

  // Mount and Unmount only

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (!isBlank(value)) {
      _handleDefaultQuery();
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (value !== defaultValue) {
      if (isBlank(value)) {
        setDefaultLabel('');
        setDefaultValue(value);
      } else {
        _handleDefaultQuery();
      }
    }
  }, [value]);
  /* eslint-enable react-hooks/exhaustive-deps */

  React.useEffect(() => {
    if (open && input.current) {
      setTimeout(() => input.current.focus(), 1);
    }
  }, [open]);

  const _handleInputChange = (event) => {
    const newSearchValue = event.target.value;
    setInputValue(newSearchValue);

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    timer.current = setTimeout(() => {
      setSearchValue(newSearchValue);
    }, 500);
  };

  const _handleDropdownChange = (row) => {
    const newValue = _get(row, pathValue);
    const label = _get(row, pathLabel);

    if (!_isEqual(value, newValue)) {
      setDefaultValue(newValue);

      if (onChange) {
        onChange(newValue);
      }
    }

    setDefaultLabel(renderLabel ? renderLabel(row) : label);
    setOpen(false);
  };

  const _handleClear = () => {
    setDefaultValue('');

    if (onChange) {
      onChange('');
    }

    setDefaultLabel('');
    setOpen(false);
  };

  const { data, error, loading } = useQuery(searchQuery, {
    skip: isBlank(searchValue),
    variables: {
      params: { ...defaultParams, ...otherParams, search: searchValue }
    }
  });

  const searchRows = (_get(data, `${searchPath}.results`, []) || []).map(
    (row, index) => {
      const rowClasses = 'hover:bg-gray-200 cursor-pointer px-3 py-2 text-sm';

      const rowValue = _get(row, pathValue);
      const rowLabel = _get(row, pathLabel);

      return (
        <React.Fragment key={rowValue}>
          {index > 0 && <hr className="bg-gray-300 m-0" />}
          <Transition
            className={rowClasses}
            onMouseDown={() => _handleDropdownChange(row)}
            role="button"
            tabIndex="-1"
          >
            {renderRow ? renderRow(row) : rowLabel}
          </Transition>
        </React.Fragment>
      );
    }
  );

  const searchError =
    error || (_get(data, `${searchPath}.errors`, []) || []).length > 0;
  const searching = searchValue.length > 0;

  const hasError = Boolean(fieldError && touched);

  const containerClassName = cx('relative', {
    'z-10': !open,
    'z-20': open
  });

  return (
    <>
      {!isBlank(label) && (
        <Label error={error} htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <div className={containerClassName} ref={node}>
        <InputBase
          className={cx('text-left', buttonClassName)}
          disabled={disabled || defaultLoading}
          error={hasError}
          label={null}
          onClick={() => setOpen(!open)}
          required={required}
          tag={Button}
          type="button"
        >
          <div className="flex justify-between items-center pr-1">
            {!(placeholder && !defaultLabel) && <div>{defaultLabel}&nbsp;</div>}
            {placeholder && !defaultLabel && (
              <div className="text-gray-400 text-left">{placeholder}</div>
            )}
          </div>
        </InputBase>
        <div className="flex items-center absolute right-0 inset-y-0 mr-2">
          {defaultLoading && (
            <FontAwesomeIcon className="text-teal-500" icon="spinner" spin />
          )}
          {!defaultLoading && (
            <>
              {defaultLabel && remove && (
                <button className="mr-4" onClick={_handleClear} type="button">
                  <FontAwesomeIcon icon="times" />
                </button>
              )}
              <button onClick={() => setOpen(!open)} type="button">
                <FontAwesomeIcon icon="caret-down" />
              </button>
            </>
          )}
        </div>
        <Dropdown
          className="inset-x-0 bg-white shadow-lg border rounded"
          error={hasError}
          onClose={() => setOpen(false)}
          open={open}
          target={node}
        >
          <div className="p-2">
            <InputBase
              {...rest}
              autoFocus
              disabled={disabled || defaultLoading}
              label={null}
              onChange={_handleInputChange}
              placeholder={'Type to Search'}
              ref={input}
              value={inputValue}
            />
          </div>
          <div className="relative">
            <Scroll className="overflow-y-auto">
              {!searchError && searchRows.length === 0 && searching && (
                <div className="py-4 text-center font-bold text-sm">
                  {loading ? 'Searching' : 'No Results Found'}
                </div>
              )}
              {!searchError && searchRows.length > 0 && searchRows}
              {searchError && (
                <div className="py-4 text-center font-bold text-sm text-red-500">
                  {'Sorry, An Error Occurred'}
                </div>
              )}
            </Scroll>
            <Spinner size="2x" spinning={loading} />
          </div>
        </Dropdown>
      </div>
    </>
  );
};

AutoCompleteBase.propTypes = {
  buttonClassName: PropTypes.string,
  defaultParams: PropTypes.shape({
    page: PropTypes.number,
    per: PropTypes.number
  }),
  defaultPath: PropTypes.string,
  defaultQuery: PropTypes.gqlQuery,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  otherParams: PropTypes.object,
  pathLabel: PropTypes.string,
  pathValue: PropTypes.string,
  placeholder: PropTypes.string,
  remove: PropTypes.bool,
  renderLabel: PropTypes.func,
  renderRow: PropTypes.func,
  required: PropTypes.bool,
  searchPath: PropTypes.string.isRequired,
  searchQuery: PropTypes.gqlQuery.isRequired,
  touched: PropTypes.bool,
  value: PropTypes.string
};

AutoCompleteBase.defaultProps = {
  buttonClassName: null,
  defaultParams: { page: 1, per: 10 },
  defaultPath: null,
  defaultQuery: null,
  disabled: false,
  error: null,
  label: null,
  onChange: null,
  otherParams: {},
  pathLabel: 'name',
  pathValue: 'id',
  placeholder: null,
  remove: true,
  renderLabel: null,
  renderRow: null,
  required: false,
  touched: false,
  value: ''
};

export default AutoCompleteBase;
