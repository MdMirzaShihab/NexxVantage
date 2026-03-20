"use client";

import { forwardRef, useState } from "react";

/* Explicit neumorphic styles to guarantee they aren't overridden by Tailwind preflight */
const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontFamily: "var(--nv-font-body)",
  fontSize: "var(--nv-text-base)",
  color: "var(--nv-input-text)",
  background: "var(--nv-input-bg)",
  border: "1px solid var(--nv-input-border)",
  borderRadius: "var(--nv-radius-md)",
  boxShadow: "var(--nv-neu-inset-sm)",
  transition: "all var(--nv-duration) var(--nv-ease)",
  outline: "none",
};

const fieldFocusStyle: React.CSSProperties = {
  ...fieldStyle,
  borderColor: "var(--nv-input-focus-border)",
  boxShadow: "var(--nv-neu-inset), 0 0 0 3px var(--nv-input-focus-ring)",
};

function useFieldFocus() {
  const [focused, setFocused] = useState(false);
  return {
    style: focused ? fieldFocusStyle : fieldStyle,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, required, ...props }, ref) => {
    const field = useFieldFocus();
    return (
      <div>
        <label htmlFor={id} className="nv-label">
          {label}
          {required && <span style={{ color: "var(--nv-gold)", marginLeft: "0.25rem" }}>*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          required={required}
          style={field.style}
          onFocus={field.onFocus}
          onBlur={field.onBlur}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, required, ...props }, ref) => {
    const field = useFieldFocus();
    return (
      <div>
        <label htmlFor={id} className="nv-label">
          {label}
          {required && <span style={{ color: "var(--nv-gold)", marginLeft: "0.25rem" }}>*</span>}
        </label>
        <textarea
          ref={ref}
          id={id}
          required={required}
          rows={5}
          style={{ ...field.style, resize: "none" as const }}
          onFocus={field.onFocus}
          onBlur={field.onBlur}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly { readonly value: string; readonly label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, required, options, ...props }, ref) => {
    const field = useFieldFocus();
    return (
      <div>
        <label htmlFor={id} className="nv-label">
          {label}
          {required && <span style={{ color: "var(--nv-gold)", marginLeft: "0.25rem" }}>*</span>}
        </label>
        <select
          ref={ref}
          id={id}
          required={required}
          style={field.style}
          onFocus={field.onFocus}
          onBlur={field.onBlur}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "var(--nv-input-bg)" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
