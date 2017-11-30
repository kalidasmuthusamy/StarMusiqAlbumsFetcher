import React, { Component } from 'react';

const CardTitleHolder = ({albumName, musicDirector}) => (
  <div>
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
)

export default CardTitleHolder;