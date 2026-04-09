interface QuantityStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg
          hover:bg-gray-100 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="w-10 text-center text-base font-semibold text-gray-900 select-none">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg
          hover:bg-gray-100 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
