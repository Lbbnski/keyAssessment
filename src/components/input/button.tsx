import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string
  disabled?: boolean
  loading?: boolean
};

const Button: React.FC<ButtonProps> = ({title, disabled, loading = false, onClick, ...props}: ButtonProps) => {
  return <button
    disabled={disabled}
    onClick={onClick}
    {...props}>
    {title}
    {loading && (
      <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>)}
  </button>
}

export default Button;