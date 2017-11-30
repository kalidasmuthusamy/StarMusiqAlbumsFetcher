import React, { Component } from 'react';
import ButtonLink from './ButtonLink';

const OutlinePrimaryButtonLink = ({ className, routeTo, children }) => (
  <ButtonLink
    className={'btn-outline-primary'}
    routeTo={routeTo}
  >
    {children}
  </ButtonLink>
)

export default OutlinePrimaryButtonLink;