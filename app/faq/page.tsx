export default function FAQPage() {
	return (
		<div className="container mx-auto px-4 py-8 mt-20">
			<h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

			<div className="space-y-6">
				<div>
					<h2 className="text-xl font-semibold mb-2">What is Wayfinder Staking?</h2>
					<p className="text-gray-200">
						Wayfinder Staking is a platform that allows users to stake their PRIME tokens to earn rewards and participate in the Wayfinder ecosystem.
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">What is PRIME?</h2>
					<p className="text-gray-200">
						PRIME is the native token of the Wayfinder ecosystem. It can be used for staking, governance, and accessing premium features on the platform.
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">How do I start staking?</h2>
					<p className="text-gray-200">
						To start staking, you need to:
						<ol className="list-decimal ml-6 mt-2">
							<li>Connect your wallet to the dashboard</li>
							<li>Ensure you have PRIME tokens in your wallet</li>
							<li>Choose your staking amount</li>
							<li>Approve and confirm the staking transaction</li>
						</ol>
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">What are the rewards for staking?</h2>
					<p className="text-gray-200">
						Staking rewards vary based on several factors including the amount staked, staking duration, and current network conditions. Check the dashboard for current reward rates.
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">Is there a minimum staking amount?</h2>
					<p className="text-gray-200">
						Yes, there is a minimum staking amount. The current minimum stake requirement can be found on the staking dashboard.
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">How can I unstake my tokens?</h2>
					<p className="text-gray-200">
						You can unstake your tokens through the dashboard by:
						<ol className="list-decimal ml-6 mt-2">
							<li>Navigating to your staking position</li>
							<li>Selecting the amount you wish to unstake</li>
							<li>Confirming the unstaking transaction</li>
							<li>Waiting for the unstaking period to complete</li>
						</ol>
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">Is there a lock-up period?</h2>
					<p className="text-gray-200">
						Yes, staked tokens are subject to a lock-up period. The specific duration can be found in the staking terms on the dashboard.
					</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">Where can I get support?</h2>
					<p className="text-gray-200">
						For support, you can:
						<ul className="list-disc ml-6 mt-2">
							<li>Visit the official Wayfinder website</li>
							<li>Join our community on Discord</li>
							<li>Follow us on X (Twitter) for updates</li>
							<li>Check our GitHub repository for technical documentation</li>
						</ul>
					</p>
				</div>
			</div>
		</div>
	);
} 