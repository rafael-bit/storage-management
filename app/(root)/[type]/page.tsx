import FileGrid from "@/components/FileGrid";
import Header from "@/components/HeaderType";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils";

export default async function Page({ searchParams, params }: SearchParamProps) {
	const type = ((await params)?.type as string) || ""
	const searchText = ((await searchParams)?.query as string) || "";
	const sort = ((await searchParams)?.sort as string) || "";
	const types = getFileTypesParams(type) as FileType[];

	const files = await getFiles({ types, searchText, sort });
	const hasFiles = files.total > 0;

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
			<Header type={type} />
			<FileGrid files={files.documents} hasFiles={hasFiles} />
		</div>
	);
}