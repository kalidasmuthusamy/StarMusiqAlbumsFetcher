import React from 'react';
import PropTypes from 'prop-types';

const CardTitleHolder = ({ albumName, musicDirector, customClassNames }) => (
  <div className={customClassNames}>
    <h4 
      className='card-title indigo-text'
    >
      <strong>
        {albumName}
      </strong>
    </h4>
    <h5 className=''>
      <strong>
        {musicDirector}
        {'                    '}
        <i className='fa fa-music' aria-hidden="true"></i>
      </strong>
    </h5>
  </div>
);

CardTitleHolder.propTypes = {
  albumName: PropTypes.string.isRequired,
  musicDirector: PropTypes.string.isRequired,
  customClassNames:'',
};

export default CardTitleHolder;
