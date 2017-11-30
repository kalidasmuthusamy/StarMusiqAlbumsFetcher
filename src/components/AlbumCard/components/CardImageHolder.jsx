import React, { Component } from 'react';

const CardHeader = ({imageSource}) => (
  <div className='view overlay hm-white-slight'>
    <img src={imageSource} className='img-fluid center-image' />
    <a href='#!'>
      <div className='mask'></div>
    </a>
  </div>
)

export default CardHeader;