import React, { Component } from 'react';
import ButtonLink from './ButtonLink';

const OutlineInfoButtonLink = ({ className, routeTo, children, linkRef }) => (
  <ButtonLink
    className={'btn-outline-info'}
    linkRef={linkRef}
    routeTo={routeTo}
  >
    {children}
  </ButtonLink>
)

export default OutlineInfoButtonLink;