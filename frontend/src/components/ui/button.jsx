import React from "react";

export function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-3 bg-secondary text-white rounded-md hover:bg-secondary/90 transition ${className}`}
    >
      {children}
    </button>
  );
}
