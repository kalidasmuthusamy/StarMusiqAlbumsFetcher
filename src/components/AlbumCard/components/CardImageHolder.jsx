import React from 'react';
import PropTypes from 'prop-types';

const CardHeader = ({ imageSource }) => (
  <div className='view overlay hm-white-slight'>
    <img src={imageSource} className='img-fluid center-image' />
    <a href='#!'>
      <div className='mask'></div>
    </a>
  </div>
);

CardHeader.propTypes = {
  imageSource: PropTypes.string.isRequired,
}

export default CardHeader;
