import { forwardRef } from "react";

const fieldBase =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-gray transition-colors focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, required, ...props }, ref) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-brand-primary">*</span>}
      </label>
      <input ref={ref} id={id} required={required} className={fieldBase} {...props} />
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, required, ...props }, ref) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-brand-primary">*</span>}
      </label>
      <textarea
        ref={ref}
        id={id}
        required={required}
        rows={5}
        className={`${fieldBase} resize-none`}
        {...props}
      />
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly { readonly value: string; readonly label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, required, options, ...props }, ref) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-brand-primary">*</span>}
      </label>
      <select ref={ref} id={id} required={required} className={fieldBase} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-brand-slate">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
);
Select.displayName = "Select";
