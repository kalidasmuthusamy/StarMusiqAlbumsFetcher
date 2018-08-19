import React from 'react';
import PropTypes from 'prop-types';

const CardHeader = ({ imageSource, customClassNames }) => (
  <div className={`view overlay hm-white-slight ${customClassNames}`}>
    <img src={imageSource} className='img-fluid center-image' />
    <a href='#!'>
      <div className='mask'></div>
    </a>
  </div>
);

CardHeader.propTypes = {
  imageSource: PropTypes.string.isRequired,
  customClassNames: '',
}

export default CardHeader;
