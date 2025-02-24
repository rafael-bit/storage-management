import { Models } from "node-appwrite";
import Card from "./Card";

export default function FileGrid({ files, hasFiles }: { files: Models.Document[]; hasFiles: boolean }) {
	return hasFiles ? (
		<div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{files.map((file) => (
				<Card key={file.$id} file={file} />
			))}
		</div>
	) : (
		<div className="flex flex-col items-center gap-4">
			<p className="text-sm text-zinc-500">No files found</p>
		</div>
	);
}
