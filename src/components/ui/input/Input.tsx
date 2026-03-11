import { Eye, EyeOff } from "lucide-react";
import React, { useState, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  autoComplete?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      icon,
      autoComplete,
      className,
      placeholder,
      required,
      error,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

    // Giữ nguyên style gốc của bạn
    const baseClass =
      "w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal transition-all";

    const errorStyles = error
      ? "ring-1 ring-red-500 bg-red-50"
      : "focus:bg-[#e2e2e2]";

    return (
      <div className="input-box relative my-[30px]">
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            autoComplete={autoComplete}
            className={`${baseClass} ${errorStyles} ${className || ""}`}
            placeholder={placeholder}
            required={required}
            {...rest}
          />

          {/* Logic hiển thị Icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center">
            {isPasswordType ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xl text-[#888] hover:text-[#333] focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            ) : (
              icon && <span className="text-xl text-[#888]">{icon}</span>
            )}
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-left text-red-500 absolute -bottom-5 left-1 font-medium italic">{error}</p>
        )}
      </div>
    );
  }
);

export default Input;