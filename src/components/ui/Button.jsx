import * as React from "react"
import { cn } from "../../utils/cn"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  
  const variants = {
    default: "bg-[#0E4B32] text-white hover:bg-[#0E4B32]/90 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-500/90 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-[#F5F0E6] hover:text-[#0E4B32] text-gray-900",
    secondary: "bg-[#F5F0E6] text-[#0E4B32] hover:bg-[#DDE7D8]",
    ghost: "hover:bg-[#F5F0E6] hover:text-[#0E4B32] text-gray-600",
    link: "text-[#0E4B32] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "w-full min-h-[50px] px-4 py-3",
    sm: "w-full min-h-[44px] rounded-xl px-3",
    lg: "w-full min-h-[56px] rounded-xl px-6",
    icon: "h-10 w-10",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4B32] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
