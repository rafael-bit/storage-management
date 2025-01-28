
export default async function Page({ params }: SearchParamProps) {
	const type  = ((await params)?.type as string) || ""
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
			<div className="w-full">
				<h1 className="capitalize">{type}</h1>
			</div>
		</div>
	)
}
