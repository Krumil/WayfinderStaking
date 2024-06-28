import { ReactNode, FC, useState, useEffect } from "react";
import { Divz } from "divz";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CardStackProps {
	cards: Array<{
		title: ReactNode;
		content: ReactNode;
	}>;
}

const CardStack: FC<CardStackProps> = ({ cards }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		if (isTransitioning) {
			const timeout = setTimeout(() => {
				setIsTransitioning(false);
			}, 300);
			return () => clearTimeout(timeout);
		}
	}, [isTransitioning]);

	const handleIndexChange = (i: number) => {
		setIsTransitioning(true);
		setSelectedIndex(i);
	};

	return (
		<div className='min-h-screen grid place-items-center relative'>
			<Divz
				isDarkMode={true}
				showPlayButton={false}
				showExpandButton={false}
				showNavButtons={false}
				onIndexChange={handleIndexChange}>
				{cards.map((card, index) => (
					<div
						className='animated-border mb-8 w-full max-w-[600px] !w-9/12 min-h-[400px] relative !overflow-visible !z-50'
						key={index}>
						{selectedIndex === index && (
							<div
								className={`flex flex-col w-full h-full p-4 md:p-8 transition-opacity duration-250 ${
									isTransitioning ? "opacity-0" : "opacity-100"
								}`}>
								<div className='mb-4 text-4xl md:text-6xl text-gradient-transparent'>{card.title}</div>
								<div className='grow'>{card.content}</div>
							</div>
						)}
						{selectedIndex > 0 && (
							<div
								className='-mt-6 absolute top-0 md:top-1/2 -translate-y-full md:-right-12 text-white transition-all duration-300'
								aria-label='Previous card'>
								<ChevronUp size={32} className='animate-[fadeIn_600ms_alternate_infinite]' />
								<ChevronUp
									size={32}
									className='-mt-4 animate-[fadeIn_600ms_300ms_alternate_infinite]'
								/>
								<ChevronUp
									size={32}
									className='-mt-4 animate-[fadeIn_600ms_600ms_alternate_infinite]'
								/>{" "}
							</div>
						)}
						{selectedIndex < cards.length - 1 && (
							<div
								className='-mt-6 absolute top-full md:top-1/2 translate-y-full md:-right-12 text-white transition-all duration-300'
								aria-label='Next card'>
								<ChevronDown size={32} className='animate-[fadeIn_600ms_alternate_infinite]' />
								<ChevronDown
									size={32}
									className='-mt-4 animate-[fadeIn_600ms_300ms_alternate_infinite]'
								/>
								<ChevronDown
									size={32}
									className='-mt-4 animate-[fadeIn_600ms_600ms_alternate_infinite]'
								/>{" "}
							</div>
						)}
					</div>
				))}
			</Divz>
		</div>
	);
};

export default CardStack;
