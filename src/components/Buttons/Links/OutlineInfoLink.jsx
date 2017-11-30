import React, { Component } from 'react';
import ButtonLink from './ButtonLink';

const OutlineInfoButtonLink = ({ className, routeTo, children }) => (
  <ButtonLink
    className={'btn-outline-info'}
    routeTo={routeTo}
  >
    {children}
  </ButtonLink>
)

export default OutlineInfoButtonLink;