import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick} className={`btn ${this.props.className}`} disabled={this.props.disabled}>{this.props.value}</button>
    );
  }
}

Button.defaultProps = {
  value: '',
  onClick: PropTypes.func,
  className: 'btn'
};


Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
