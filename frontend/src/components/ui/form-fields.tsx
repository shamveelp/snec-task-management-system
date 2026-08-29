/**
 * Reusable form components for the FlowTask app.
 * These ensure consistent styling (light theme, dark text on light bg)
 * across all pages regardless of OS dark-mode setting.
 */
import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

// ─── AppInput ────────────────────────────────────────────────────────────────
interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function AppInput({ label, icon, error, className = "", ...props }: AppInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          style={{ colorScheme: "light" }}
          className={[
            "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900",
            "placeholder:text-gray-400 outline-none transition-all",
            "focus:border-[#7C68EE] focus:ring-2 focus:ring-[#7C68EE]/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            icon ? "pl-9" : "",
            error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── AppSelect ───────────────────────────────────────────────────────────────
interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

export function AppSelect({ label, icon, error, className = "", children, ...props }: AppSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {icon}
          </span>
        )}
        <select
          {...props}
          style={{ colorScheme: "light" }}
          className={[
            "w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 font-medium",
            "outline-none transition-all cursor-pointer",
            "focus:border-[#7C68EE] focus:ring-2 focus:ring-[#7C68EE]/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            icon ? "pl-9" : "",
            error ? "border-red-400" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── AppDatePicker ────────────────────────────────────────────────────────────
interface AppDatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  error?: string;
  className?: string;
}

export function AppDatePicker({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  min,
  error,
  className = "",
}: AppDatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (inputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  const displayValue = value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div
        className={[
          "relative flex items-center w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5",
          "cursor-pointer transition-all hover:border-[#7C68EE]",
          "focus-within:border-[#7C68EE] focus-within:ring-2 focus-within:ring-[#7C68EE]/20",
          error ? "border-red-400" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={openPicker}
      >
        <CalendarIcon className="h-4 w-4 text-[#7C68EE] mr-2.5 flex-shrink-0" />
        <span className={`text-sm flex-1 ${displayValue ? "text-gray-900 font-medium" : "text-gray-400"}`}>
          {displayValue || placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
        {/* Hidden native date input */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          style={{ colorScheme: "light" }}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          tabIndex={-1}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
