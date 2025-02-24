import Sort from "./Sort";

export default function Header({ type }: { type: string }) {
	return (
		<div className="w-full">
			<h1 className="capitalize text-4xl font-bold">{type}</h1>
			<div className="flex mt-2 flex-col justify-between sm:flex-row sm:items-center">
				<p className="text-sm text-zinc-800">
					Total: <span className="font-bold">0MB / 2GB</span>
				</p>
				<div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
					<p className="hidden sm:block text-zinc-700">Sort by:</p>
					<Sort />
				</div>
			</div>
		</div>
	);
}