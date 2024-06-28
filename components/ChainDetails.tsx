"use client";

import Image from "next/image";
import { createContext, useContext } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	DynamicContainer,
	DynamicDescription,
	DynamicDiv,
	DynamicIsland,
	DynamicTitle,
	DynamicIslandProvider,
	useDynamicIslandSize
} from "@/components/ui/DynamicBlob";

const blobStates = ["default", "medium"];

interface ChainProps {
	title: string;
	primeScore: number;
	communityScore: number;
	initializationScore: number;
	imagePath: string;
}

const DynamicAction = ({ title, primeScore, communityScore, initializationScore, imagePath }: ChainProps) => {
	const { state: blobState, setSize } = useDynamicIslandSize();

	const cycleBlobStates = () => {
		const currentIndex = blobStates.indexOf(blobState.size);
		const nextIndex = (currentIndex + 1) % blobStates.length;
		// @ts-ignore
		setSize(blobStates[nextIndex]);
	};

	// Provide dynamic detail in such a beautiful small place :)
	const renderCompactState = () => (
		<div onClick={cycleBlobStates} className='h-full w-full'>
			<DynamicContainer className='flex  h-full w-full'>
				<DynamicTitle className='text-xl font-bold flex gap-2 align-items'>
					<Image src={imagePath} alt='chain' width={20} height={20} />
					{title}
				</DynamicTitle>
			</DynamicContainer>
		</div>
	);

	const renderMediumState = () => (
		<div onClick={cycleBlobStates} className='h-full w-full'>
			<DynamicContainer className='flex flex-col justify-between px-2 pt-4 text-left text-white h-full'>
				<DynamicTitle className='text-xl font-bold flex gap-2 align-items'>
					<Image src={imagePath} alt='chain' width={20} height={20} />
					{title}
				</DynamicTitle>
				<DynamicDescription className='leading-5 text-white pl-3'>
					<div>
						<div className='text-lg font-medium'>
							Prime Score: <span className='text-white'>{primeScore.toFixed(2)}</span>
						</div>
						<div className='text-lg font-medium'>
							Community Score: <span className='text-white'>{communityScore.toFixed(2)}</span>
						</div>
						<div className='text-lg font-medium'>
							Initialization Score: <span className='text-white'>{initializationScore.toFixed(2)}</span>
						</div>
					</div>
				</DynamicDescription>
			</DynamicContainer>
		</div>
	);

	// Main render logic based on size
	function renderState() {
		switch (blobState.size) {
			case "medium":
				return renderMediumState();
			default:
				return renderCompactState();
		}
	}

	return (
		<div className=' h-full'>
			<div className='flex flex-col gap-4  h-full'>
				<div className='absolute top-4 right-2'>
					{/* {!blobState.isAnimating ? ( */}
					{/* ) : null} */}
				</div>
				<div className='absolute top-1 right-2'>
					<div></div>
				</div>

				<DynamicIsland id='dynamic-blob'>{renderState()}</DynamicIsland>
			</div>
		</div>
	);
};

export function ChainDetails({ title, primeScore, communityScore, initializationScore, imagePath }: ChainProps) {
	return (
		<DynamicIslandProvider initialSize={"default"}>
			<div className='grow'>
				<DynamicAction
					title={title}
					primeScore={primeScore}
					communityScore={communityScore}
					initializationScore={initializationScore}
					imagePath={imagePath}
				/>
			</div>
		</DynamicIslandProvider>
	);
}

const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: "0px 0px -200px" };

export function FadeIn(props: any) {
	let shouldReduceMotion = useReducedMotion();
	let isInStaggerGroup = useContext(FadeInStaggerContext);

	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
				visible: { opacity: 1, y: 0 }
			}}
			transition={{ duration: 0.5 }}
			{...(isInStaggerGroup
				? {}
				: {
						initial: "hidden",
						whileInView: "visible",
						viewport
				  })}
			{...props}
		/>
	);
}

export function FadeInStagger({ faster = false, ...props }) {
	return (
		<FadeInStaggerContext.Provider value={true}>
			<motion.div
				initial='hidden'
				whileInView='visible'
				viewport={viewport}
				transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
				{...props}
			/>
		</FadeInStaggerContext.Provider>
	);
}
