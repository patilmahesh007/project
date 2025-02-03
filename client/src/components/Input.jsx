import React from 'react';
function Input({ label, placeholder, name, type, value, onChange,autoComplete }) {
 
  return (
    <div className="mb-4 ">
      <label htmlFor={name} className="block text-gray-600 font-medium mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-300"
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default Input;
