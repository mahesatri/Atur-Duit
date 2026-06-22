import React from "react";

interface InputFieldProps {
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  rightSlot?: React.ReactNode;
  defaultValue?: string;
}

export default function InputField({
  name, type = "text", placeholder, icon, error, rightSlot, defaultValue,
}: InputFieldProps) {
  return (
    <div>
      <div className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-card ${error ? "ring-1 ring-expense" : ""}`}>
        {icon && <span className="text-green shrink-0">{icon}</span>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="flex-1 bg-transparent outline-none text-textDark placeholder:text-textMuted text-sm"
        />
        {rightSlot}
      </div>
      {error && <p className="mt-1.5 ml-1 text-xs text-expenseDeep">{error}</p>}
    </div>
  );
}
