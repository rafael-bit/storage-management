import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";

export default function RecentFiles({ files }: { files: Models.Document[] }) {
	return (
		<section className="h-full rounded-[20px] bg-white p-5 xl:p-8">
			<h2 className="text-2xl xl:text-3xl font-bold text-zinc-800">Recent files uploaded</h2>
			{files.length > 0 ? (
				<ul className="mt-5 flex flex-col gap-5">
					{files.map((file) => (
						<Link href={file.url} target="_blank" className="flex items-center gap-3" key={file.$id}>
							<Thumbnail type={file.type} extension={file.extension} />
							<div className="flex w-full flex-col xl:flex-row xl:justify-between">
								<div className="flex flex-col gap-1">
									<p className="text-sm line-clamp-1 w-full sm:max-w-[200px] lg:max-w-[250px]">{file.name}</p>
									<FormattedDateTime date={file.$createdAt} />
								</div>
								<ActionDropdown file={file} />
							</div>
						</Link>
					))}
				</ul>
			) : (
				<p className="mt-10 text-center text-light-200">No files uploaded</p>
			)}
		</section>
	);
}