import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-hampton-200 text-hampton-950 shadow hover:bg-hampton-300/40",
				destructive:
					"bg-red-600 text-white shadow-sm hover:bg-red-700/90",
				outline:
					"border border-judge-gray-300 bg-background shadow-sm hover:bg-judge-gray-100/80 hover:text-judge-gray-900",
				secondary:
					"bg-judge-gray-200 text-judge-gray-900 shadow-sm hover:bg-judge-gray-300/80",
				ghost: "hover:bg-judge-gray-100/70 hover:text-judge-gray-900",
				link: "text-hampton-600 underline-offset-4 hover:underline hover:text-hampton-700/90",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button"
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = "Button"

export { Button, buttonVariants }
