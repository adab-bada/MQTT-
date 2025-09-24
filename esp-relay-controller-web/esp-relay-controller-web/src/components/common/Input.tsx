import React from 'react';

// Menggabungkan props dari elemen input HTML standar
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
};

/**
 * @description Komponen Input yang dapat digunakan kembali dengan label dan ikon opsional.
 */
const Input: React.FC<InputProps> = ({ label, icon, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full p-2 border rounded-md bg-light-bg dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary transition-colors
            ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
};

export default Input;
