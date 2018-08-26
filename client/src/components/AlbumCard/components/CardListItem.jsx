import React from 'react';
import PropTypes from 'prop-types';

const CardListItem = ({ children }) => (
  <li className='list-group-item'>
    {children}
  </li>
);

CardListItem.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CardListItem;
