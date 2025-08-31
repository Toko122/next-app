import * as React from "react";

function Input({ className = "", type, onChange, name, placeholder, ...props }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className={
        `outline-none border border-gray-300 rounded-lg py-2 px-3 w-full transition
         focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ` + className
      }
      {...props}
    />
  );
}

export { Input };
