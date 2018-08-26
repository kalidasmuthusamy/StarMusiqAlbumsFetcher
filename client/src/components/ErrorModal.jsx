import React from 'react';
import PropTypes from 'prop-types';

// Modal-Content will be coming soon
const ErrorModal = ({
  message,
}) => (
    <div className='modal' id='exampleModal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-sm modal-notify modal-danger' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='exampleModalLabel'>{message}</h5>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

ErrorModal.propTypes = {
  message: PropTypes.string,
};

ErrorModal.defaultProps = {
  message: 'Error',
};

export default ErrorModal;
