import React from 'react';
import _get from 'lodash/get';
import update from 'immutability-helper';

const path = 'hours-tracker/shared/hooks/useModalRoute';

const MODAL_LOCATION_SET = `${path}/MODAL_LOCATION_SET`;
const OPEN_SET = `${path}/OPEN_SET`;
const PAGE_LOCATION_SET = `${path}/PAGE_LOCATION_SET`;

const reducer = (state, action) => {
  switch (action.type) {
    case MODAL_LOCATION_SET:
      return update(state, {
        modalLocation: { $set: action.modalLocation },
        open: { $set: action.open }
      });

    case OPEN_SET:
      return update(state, { open: { $set: action.open } });

    case PAGE_LOCATION_SET:
      return update(state, {
        open: { $set: action.open },
        pageLocation: { $set: action.pageLocation }
      });

    default:
      throw new Error();
  }
};

const useModalRoute = (history, location) => {
  const { action } = history;
  const mounted = React.useRef(false);
  const modal = _get(location, 'state.modal', false);

  const [state, dispatch] = React.useReducer(reducer, {
    pageLocation: location,
    open: false,
    modalLocation: location
  });

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      if (modal) {
        history.replace({ ...location, state: null });
      }

      return;
    }

    if (modal) {
      if (action !== 'POP') {
        dispatch({
          modalLocation: location,
          open: true,
          type: MODAL_LOCATION_SET
        });
      } else {
        dispatch({ open: false, type: OPEN_SET });
      }
    } else {
      dispatch({
        open: false,
        pageLocation: location,
        type: PAGE_LOCATION_SET
      });
    }
  }, [action, history, location, modal]);

  return state;
};

export default useModalRoute;
