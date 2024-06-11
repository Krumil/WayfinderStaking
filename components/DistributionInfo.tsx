"use client";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

interface DistributionInfoProps {
	numberOfAddresses: number;
}

const DistributionInfo = ({ numberOfAddresses }: DistributionInfoProps) => {
	return (
		<div className='text-4xl text-center font-semibold mb-4 max-w-4xl mx-auto p-4'>
			<span className='text-gradient-transparent'> 450 million </span>$PROMPT will be distributed (out of 1
			billion total supply) across{" "}
			<span className='text-gradient-transparent'>
				{" "}
				<AnimatedNumber value={numberOfAddresses} />{" "}
			</span>
			addresses.
		</div>
	);
};

export default DistributionInfo;
