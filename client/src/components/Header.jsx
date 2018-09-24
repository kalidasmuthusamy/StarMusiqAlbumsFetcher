import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title }) => (
  <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary app-header">
    <a className="navbar-brand header-text" href="#">{title}</a>
    {/*
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
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <a className="nav-link waves-effect waves-light" href="#">Home <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
          <a className="nav-link waves-effect waves-light" href="#">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link waves-effect waves-light" href="#">Pricing</a>
        </li>
      </ul>
    </div>
    */}
  </nav>
);

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: 'New Tamil Albums',
};

export default Header;
