import React, { Component } from 'react';

const ButtonLink = ({routeTo, className, children}) => (
  <a
    className={`btn waves-effect ${className}`}
    href={routeTo}
    role='button'
    target='_blank'
  >
    {children}
  </a>
)

export default ButtonLink;