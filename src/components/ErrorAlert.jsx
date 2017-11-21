import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Modal-Content will be coming soon
const ErrorAlert = ({
  message,
  ...restProps,
}) => (
    <div className='alert alert-danger alert-dismissible fade show' role='alert'>
      <button type='button' className='close' data-dismiss='alert' aria-label='Close'>
        <span aria-hidden='true'>&times;</span>
      </button>
      <strong>{message}</strong>
    </div>
  );

ErrorAlert.propTypes = {
  message: PropTypes.string,
};

ErrorAlert.defaultProps = {
  message: 'Error',
};



export default ErrorAlert;
