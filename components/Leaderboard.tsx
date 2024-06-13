import { useEffect, useState } from "react";
import SlideUp from "@/components/ui/SlideUp";
import { useRouter } from "next/navigation";
import { getENSNameFromAddress } from "@/lib/contract";

interface Deposit {
	amount: string;
	points: number;
	createdTimestamp: number;
	endTimestamp: number;
}

interface LeaderboardProps {
	userDeposits: [string, Deposit[]][];
	primeValue: number;
}

const Leaderboard = ({ userDeposits, primeValue }: LeaderboardProps) => {
	const router = useRouter();
	const [ensNames, setEnsNames] = useState<{ [address: string]: string | null }>({});
	const [userStakingData, setUserStakingData] = useState<Record<string, { averageStakingPeriod: number }>>({});

	const formatNumberWithCommas = (num: number) => num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	useEffect(() => {
		const fetchEnsNames = async () => {
			const ensNamePromises = userDeposits.map(async ([address]) => {
				const isMobile = window.innerWidth < 768;
				const ensName = await getENSNameFromAddress(address, isMobile);
				return [address, ensName] as [string, string | null];
			});
			const ensNameResults = await Promise.all(ensNamePromises);
			const ensNameMap = ensNameResults.reduce((acc, [address, ensName]) => {
				acc[address] = ensName;
				return acc;
			}, {} as { [address: string]: string | null });
			setEnsNames(ensNameMap);
		};

		fetchEnsNames();

		let userStakingData = {} as Record<
			string,
			{
				weightedStaking: number;
				numberOfdeposits: number;
				totalTokensStaked: number;
				averageStakingPeriod: number;
			}
		>;
		userDeposits.forEach(([address, deposits]) => {
			deposits.map(deposit => {
				if (!userStakingData[address]) {
					userStakingData[address] = {
						weightedStaking: 0,
						numberOfdeposits: 0,
						totalTokensStaked: 0,
						averageStakingPeriod: 0
					};
				}
				const depositWeigth = (deposit.endTimestamp - deposit.createdTimestamp) * parseFloat(deposit.amount);
				userStakingData[address].weightedStaking += depositWeigth;
				userStakingData[address].numberOfdeposits++;
				userStakingData[address].totalTokensStaked += parseFloat(deposit.amount);
			});
		});

		Object.keys(userStakingData).forEach(address => {
			userStakingData[address].averageStakingPeriod =
				userStakingData[address].weightedStaking / userStakingData[address].totalTokensStaked;
		});

		setUserStakingData(userStakingData);
	}, [userDeposits]);

	const handleClick = (address: string) => {
		router.push(`/address/${address}`);
	};

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<div className='grid grid-cols-1 gap-4'>
				{userDeposits.map(([address, deposits], index) => {
					const totalTokensStaked = deposits.reduce((acc, deposit) => acc + parseFloat(deposit.amount), 0);
					const totalPoints = deposits.reduce((acc, deposit) => acc + deposit.points, 0);
					const ensName = ensNames[address];

					if (!ensName) {
						return null;
					}

					return (
						<div key={index}>
							{index === 0 && (
								<p className='text-2xl font-bold flex justify-center mb-4 text-gradient-transparent'>
									Top Contributors
								</p>
							)}

							<SlideUp delay={index * 0.1}>
								<div className='p-4 rounded-lg shadow-sm flex flex-col justify-start items-between bg-hampton-200 bg-opacity-20 cursor-pointer transition duration-200 hover:bg-opacity-30'>
									<div
										className='flex justify-between items-center'
										onClick={() => handleClick(address)}>
										<div>
											<div className='text-2xl'>{ensName}</div>
										</div>
										<div className='text-end'>
											<div className='text-xl font-bold'>
												{formatNumberWithCommas(totalPoints)} CS
											</div>
										</div>
									</div>
									<div className='text-judge-gray-200 text-sm md:text-xl'>
										{formatNumberWithCommas(totalTokensStaked)} $PRIME for an average of{" "}
										{(
											userStakingData[address]?.averageStakingPeriod /
											(60 * 60 * 24 * 1000)
										).toFixed(0)}{" "}
										days
									</div>
								</div>
							</SlideUp>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Leaderboard;
