import React, { Component } from 'react';
import ButtonLink from './ButtonLink';

const OutlinePrimaryButtonLink = ({ className, routeTo, children, linkRef }) => (
  <ButtonLink
    className={"btn-outline-primary"}
    linkRef={linkRef}
    routeTo={routeTo}
  >
    {children}
  </ButtonLink>
);

export default OutlinePrimaryButtonLink;