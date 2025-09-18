import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min, max, step = 1, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={cn(
          "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer",
          "slider-thumb-blue",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }