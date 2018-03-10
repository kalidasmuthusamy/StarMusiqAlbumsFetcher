import React from 'react';
import PropTypes from 'prop-types';

const ButtonLink = ({routeTo, className, children, linkRef}) => (
  <a
    className={`btn waves-effect ${className}`}
    href={routeTo}
    role='button'
    target='_blank'
    ref={(el) => linkRef(el)}
  >
    {children}
  </a>
);

ButtonLink.propTypes = {
  linkRef: PropTypes.func,
  routeTo: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ButtonLink.defaultProps = {
  linkRef: () => {}
};

export default ButtonLink;
