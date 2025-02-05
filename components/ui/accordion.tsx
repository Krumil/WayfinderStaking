'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ')
}

const Accordion = AccordionPrimitive.Root
const AccordionItem = AccordionPrimitive.Item

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 items-center justify-between py-4 px-5 font-medium transition-all duration-200 hover:bg-gray-100/10 rounded-lg',
				'data-[state=open]:bg-gray-100/5',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
				className
			)}
			{...props}
		>
			<span className="text-left transition-transform duration-200 ease-out data-[state=open]:text-primary">
				{children}
			</span>
			<ChevronDown
				className="h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out data-[state=open]:rotate-180 text-gray-400 group-hover:text-gray-300"
				aria-hidden="true"
			/>
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={cn(
			'overflow-hidden text-sm transition-all duration-300 ease-out',
			'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
			'data-[state=open]:pb-4 data-[state=closed]:pb-0',
			className
		)}
		{...props}
	>
		<div className="px-5 text-gray-300">
			{children}
		</div>
	</AccordionPrimitive.Content>
))
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } 