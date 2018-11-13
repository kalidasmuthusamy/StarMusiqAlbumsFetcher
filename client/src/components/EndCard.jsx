import React from 'react';
import PropTypes from 'prop-types';

const EndCard = ({ endTitle, className }) => (
  <div style={{textAlign: 'center'}} className="">
    <span className={className}>
      {endTitle}
    </span>
  </div>
);

EndCard.propTypes = {
  endTitle: PropTypes.string,
  className: PropTypes.string,
};

EndCard.defaultProps = {
  endTitle: 'The End',
  className: 'btn btn-primary waves-effect',
};

export default EndCard;
