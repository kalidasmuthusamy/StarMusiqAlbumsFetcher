import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title, onSearchStringChange }) => (
  <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary app-header">
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
      <div className="md-form">
        <input type="text" id="form1" className="form-control" onChange={(event) => onSearchStringChange(event)} />
        <label htmlFor="form1" >Search - Album, Composer, Actors</label>
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
