import Card from "@/components/Card";
import Sort from "@/components/Sort"
import { getFiles } from "@/lib/actions/file.actions"
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite"

export default async function Page({ searchParams, params }: SearchParamProps) {
	const type = ((await params)?.type as string) || ""
	const searchText = ((await searchParams)?.query as string) || "";
	const sort = ((await searchParams)?.sort as string) || "";
	const types = getFileTypesParams(type) as FileType[];
	const files = await getFiles({ types, searchText, sort });

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
			<div className="w-full">
				<h1 className="capitalize text-4xl font-bold">{type}</h1>
				<div className="flex mt-2 flex-col justify-between sm:flex-row sm:items-center">
					<p className="text-sm text-zinc-800">Total: <span className="font-bold">0MB / 2GB</span></p>
					<div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
						<p className="hidden sm:block text-zinc-700">Sort by:</p>
						<Sort />
					</div>
				</div>
			</div>
			{files.total > 0 ? (
				<div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{files.documents.map((file: Models.Document) => (
						<Card key={file.$id} file={file} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center gap-4">
					<p className="text-sm text-zinc-500">No files found</p>
				</div>
			)}
		</div>
	)
}
