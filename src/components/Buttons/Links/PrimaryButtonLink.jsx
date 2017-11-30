import React, { Component } from 'react';
import ButtonLink from './ButtonLink';

const PrimaryButtonLink = ({className, routeTo ,children}) => (
  <ButtonLink
    className={'btn-primary'}
    routeTo={routeTo}
  >
    {children}
  </ButtonLink>
)

export default PrimaryButtonLink;