import { useEffect, useState } from "react";
import SlideUp from "@/components/ui/SlideUp";
import { useRouter } from "next/navigation";
import { getENSName } from "@/lib/contract";

interface LeaderboardProps {
	userDeposits: [string, Deposit[]][];
	primeValue: number;
}

const Leaderboard = ({ userDeposits, primeValue }: LeaderboardProps) => {
	const router = useRouter();
	const [ensNames, setEnsNames] = useState<{ [address: string]: string | null }>({});

	const formatNumberWithCommas = (num: number) => num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	useEffect(() => {
		const fetchEnsNames = async () => {
			const ensNamePromises = userDeposits.map(async ([address]) => {
				const ensName = await getENSName(address);
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
	}, [userDeposits]);

	const handleClick = (address: string) => {
		router.push(`/address/${address}`);
	};

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<h2 className='text-2xl font-bold flex justify-center mb-4 text-gradient-transparent'>Top Stakers</h2>
			<div className='grid grid-cols-1 gap-4'>
				{userDeposits.map(([address, deposits], index) => {
					const totalTokensStaked = deposits.reduce((acc, deposit) => acc + parseFloat(deposit.amount), 0);
					const ensName = ensNames[address];

					return (
						<SlideUp key={index} delay={index * 0.1}>
							<div
								className='p-4 rounded-lg shadow-sm flex flex-row justify-between items-center bg-hampton-200 bg-opacity-20 cursor-pointer transition duration-200 hover:bg-opacity-30'
								onClick={() => handleClick(address)}>
								<p className='text-2xl'>{ensName || address}</p>
								<div className='text-end'>
									<p className='text-xl font-bold'>
										{formatNumberWithCommas(totalTokensStaked)} $PRIME
									</p>
									<p className='text-judge-gray-200'>
										{formatNumberWithCommas(totalTokensStaked * primeValue)} $USD
									</p>
								</div>
							</div>
						</SlideUp>
					);
				})}
			</div>
		</div>
	);
};

export default Leaderboard;
