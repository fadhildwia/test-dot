import React from 'react';
import { ButtonInterface } from './Button.type';

const Button: React.FC<ButtonInterface> = ({ children, variant = 'primary', onClick, disabled, type = 'button' }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button; 