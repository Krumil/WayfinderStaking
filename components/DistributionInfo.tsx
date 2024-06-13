"use client";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { stakingRewards } from "@/lib/utils";
import SlideUp from "@/components/ui/SlideUp";

interface DistributionInfoProps {
	numberOfAddresses: number;
	averageWeightedStakingPeriod: number;
}

const DistributionInfo = ({ numberOfAddresses, averageWeightedStakingPeriod }: DistributionInfoProps) => {
	const stakingRewardsInMillions = stakingRewards / 1_000_000;
	return (
		<div className='text-2xl md:text-3xl text-center mb-4 max-w-4xl mx-auto p-4'>
			{/* <SlideUp delay={0.1}>
				<p className='text-center'>
					Average Weighted Staking Period:{" "}
					<span className='text-4xl font-bold text-gradient-transparent'>
						<AnimatedNumber value={averageWeightedStakingPeriod} /> days
					</span>
				</p>
			</SlideUp> */}
			<SlideUp delay={2}>
				<span className='text-4xl text-gradient-transparent font-bold'>
					{" "}
					{stakingRewardsInMillions} million{" "}
				</span>
				$PROMPT will be distributed (out of 1 billion total supply) across{" "}
				<span className='text-4xl text-gradient-transparent font-bold'>
					{" "}
					<AnimatedNumber value={numberOfAddresses} />{" "}
				</span>
				addresses.
			</SlideUp>
		</div>
	);
};

export default DistributionInfo;
