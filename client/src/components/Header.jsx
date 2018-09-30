import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title, onSearchStringChange }) => (
  <nav className="sticky-top navbar navbar-expand-lg navbar-dark bg-primary header-nav app-header">
    <a className="navbar-brand header-text" href="#">{title}</a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <div className="md-form ml-auto">
        <input
          placeholder="Search - Album, Composer, Casts"
          type="text"
          id="inputPlaceholderEx"
          className="searchBox"
          onChange={
            (event) => onSearchStringChange(event)
          }
        />
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  title: PropTypes.string,
  onSearchStringChange: PropTypes.func.isRequired,
};

Header.defaultProps = {
  title: 'New Tamil Albums',
};

export default Header;
