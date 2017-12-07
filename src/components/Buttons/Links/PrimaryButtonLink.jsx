import React, { Component } from 'react';
import ButtonLink from './ButtonLink';

const PrimaryButtonLink = ({className, routeTo ,children, linkRef}) => (
  <ButtonLink
    className={'btn-primary'}
    linkRef={linkRef}
    routeTo={routeTo}
  >
    {children}
  </ButtonLink>
)

export default PrimaryButtonLink;