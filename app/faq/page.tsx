import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
	return (
		<div className="container mx-auto px-4 py-8 mt-20">
			<h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
			<Accordion type="single" collapsible className="space-y-4">
				<AccordionItem value="faq-1">
					<AccordionTrigger>What is this dashboard?</AccordionTrigger>
					<AccordionContent className="mt-2">
						This is an unofficial community-created dashboard that helps track $PROMPT tokens, which can be obtained by staking $PRIME tokens at{' '}
						<a href="https://cache.wayfinder.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
							cache.wayfinder.ai
						</a>. This dashboard isn&apos;t affiliated with the official platform and uses its own methodology for calculations.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="faq-2">
					<AccordionTrigger>How are $PROMPT allocations calculated?</AccordionTrigger>
					<AccordionContent className="mt-2">
						<p className="mx-2">When the dashboard shows &ldquo;X.XX% of the total score, which is XXX $PROMPT&rdquo;, this represents:</p>
						<ul className="list-disc ml-6 space-y-2">
							<li>A snapshot calculation against the total 400M $PROMPT allocation</li>
							<li>Based on current Community Score points distribution</li>
							<li>Not a prediction of future earnings or final allocation</li>
						</ul>
						<div className="mt-4 bg-gray-900/50 p-4 rounded-lg space-y-2">
							<p className="font-medium">Important notes about the calculation:</p>
							<ul className="list-disc ml-6 space-y-1 text-sm">
								<li>We don&apos;t predict future point accrual until TGE (June 2027)</li>
								<li>The actual distribution mechanism is unknown (linear/non-linear)</li>
								<li>New stakers can join and affect the distribution at any time</li>
								<li>Points allocation timing and updates are not public information</li>
								<li>Many badge modifiers (including Avatars) are not currently factored into calculations</li>
							</ul>
						</div>
						<p className="mt-4 text-yellow-200/80">
							⚠️ These calculations are simplified estimates and should not be used for financial decisions.
						</p>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="faq-3">
					<AccordionTrigger>Why might my percentage change?</AccordionTrigger>
					<AccordionContent className="mt-2">
						<p>Your percentage might change due to:</p>
						<ul className="list-disc ml-6 mt-2 space-y-2">
							<li>New stakers joining the platform</li>
							<li>Changes in Community Score calculations</li>
							<li>Updates to staking duration or amounts by other participants</li>
							<li>Changes in the overall points distribution</li>
						</ul>
						<p className="mt-4 text-sm bg-gray-900/50 p-4 rounded-lg">
							The dashboard takes regular snapshots of the current state. Since we can&apos;t predict future
							point accrual or changes in staking conditions, percentages are always relative to the
							current total points, not final distribution.
						</p>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="faq-4">
					<AccordionTrigger>What data does this dashboard show?</AccordionTrigger>
					<AccordionContent className="mt-2">
						This dashboard displays:
						<ul className="list-disc ml-6 mt-2 space-y-2">
							<li>Community Score-based rankings (different from official staking-based rankings)</li>
							<li>Current snapshot percentages against total 400M $PROMPT allocation</li>
							<li>Historical changes in relative positions</li>
							<li>Public blockchain data about staking positions</li>
						</ul>
						<p className="mt-2 text-yellow-200/80">
							⚠️ All calculations are based on current snapshots and may not reflect final distribution mechanics.
						</p>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="faq-5">
					<AccordionTrigger>How accurate are the calculations?</AccordionTrigger>
					<AccordionContent className="mt-2">
						<p>While we strive for accuracy, our calculations:</p>
						<ul className="list-disc ml-6 mt-2 space-y-2">
							<li>Are based on current Community Score snapshots</li>
							<li>Don&apos;t predict future point accrual</li>
							<li>Don&apos;t include most badge modifiers (e.g., Avatars, Rank badges, Achievement badges)</li>
							<li>Use simplified distribution assumptions</li>
						</ul>
						<div className="mt-4 bg-gray-900/50 p-4 rounded-lg text-sm space-y-2">
							<p>Due to the long timeframe until TGE (June 2027) and unknown distribution mechanics,
								we focus on providing current snapshot data rather than attempting to predict final allocations.</p>
							<p className="text-yellow-200/80">Note: Badge modifiers could significantly impact final allocations, but due to their complexity and evolving nature, they are not currently included in our calculations.</p>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="faq-6">
					<AccordionTrigger>Where can I get official information?</AccordionTrigger>
					<AccordionContent className="mt-2">
						For official information and support, please visit:
						<ul className="list-disc ml-6 mt-2 space-y-2">
							<li>Official Wayfinder platform:{' '}
								<a href="https://cache.wayfinder.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									cache.wayfinder.ai
								</a>
							</li>
							<li>Official X (Twitter) accounts:
								<ul className="list-disc ml-6 mt-1 space-y-1">
									<li>
										<a href="https://x.com/AIWayfinder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
											@AIWayfinder
										</a>
									</li>
									<li>
										<a href="https://x.com/EchelonFND" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
											@EchelonFND
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="faq-7">
					<AccordionTrigger>Who created this dashboard?</AccordionTrigger>
					<AccordionContent className="mt-2">
						<p>
							This dashboard was created by krumil, a full-stack developer focused on web3 and AI.
							You can find me on{' '}
							<a
								href="https://x.com/Simo1028"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								X (Twitter) as @Simo1028
							</a>
							.
						</p>
						<p className="mt-2 text-yellow-200/80">
							⚠️ Important: I am not affiliated with Echelon, Parallel, or Wayfinder. This is an independent community project.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
} 