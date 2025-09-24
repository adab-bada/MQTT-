import React from 'react';

// Menggabungkan props dari elemen button HTML standar
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
};

/**
 * @description Komponen Button yang dapat digunakan kembali dengan varian dan status loading.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  ...props
}) => {
  const baseClasses = "w-full p-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card";

  const variantClasses = {
    primary: 'bg-light-primary text-white hover:bg-blue-600 focus:ring-light-primary',
    secondary: 'bg-gray-200 text-light-text-secondary dark:bg-gray-700 dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
