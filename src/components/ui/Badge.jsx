import * as React from "react"
import { cn } from "../../utils/cn"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-[#0E4B32] text-white hover:bg-[#0E4B32]/80",
    secondary: "border-transparent bg-[#F5F0E6] text-[#0E4B32] hover:bg-[#F5F0E6]/80",
    destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80",
    outline: "text-gray-950 border-gray-200",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E4B32] focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
