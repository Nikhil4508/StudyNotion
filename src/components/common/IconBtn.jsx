import React from "react";

export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  customClasses,
  type,
  textClasses,
}) {
  return (
    <button
      className={`flex items-center gap-2 rounded-md p-2 cursor-pointer ${customClasses}`}
      disabled={disabled}
      onClick={onclick}
      type={type}
    >
      {children ? (
        <>
          <span className={textClasses}>{text}</span>
          {children}
        </>
      ) : (
        <span className={textClasses}>{text}</span>
      )}
    </button>
  );
}
