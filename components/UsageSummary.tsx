import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Chart from "./Chart";
import Link from "next/link";
import FormattedDateTime from "./FormattedDateTime";

type FileCategory = {
	size: number;
	latestDate: string;
};

type TotalSpace = {
	document: FileCategory;
	image: FileCategory;
	video: FileCategory;
	audio: FileCategory;
	other: FileCategory;
	used: number;

};


export default function UsageSummary({ totalSpace }: { totalSpace: TotalSpace }) {
	const usageSummary = getUsageSummary(totalSpace);

	return (
		<section>
			<Chart used={totalSpace.used} />
			<ul className="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9">
				{usageSummary.map((summary) => (
					<Link
						href={summary.url}
						key={summary.title}
						className="rounded-[20px] bg-white p-5 transition-all hover:scale-105"
					>
						<div className="space-y-4">
							<div className="flex justify-between items-center gap-3">
								<div className="p-3 bg-brand/10 text-zinc-600 rounded-full">
									<summary.icon size={20} />
								</div>
								<h4 className="relative z-10 w-full text-right">
									{convertFileSize(summary.size) || "0"}
								</h4>
							</div>
							<h5 className="relative z-20 text-left text-sm">{summary.title}</h5>
							<FormattedDateTime date={summary.latestDate} />
						</div>
					</Link>
				))}
			</ul>
		</section>
	);
}