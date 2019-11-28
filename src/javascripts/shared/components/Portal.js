import PropTypes from 'javascripts/prop-types';
import ReactDOM from 'react-dom';

const Portal = ({ element, children }) => {
  return ReactDOM.createPortal(children, document.getElementById(element));
};

Portal.propTypes = {
  children: PropTypes.node,
  element: PropTypes.string
};

Portal.defaultProps = {
  children: null,
  element: 'portal'
};

export default Portal;
