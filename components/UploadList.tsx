import { MdClose } from "react-icons/md";
import Thumbnail from "./Thumbnail";

interface UploadListProps {
	files: {
		file: File;
		progress: number;
		status: "pending" | "uploading" | "success" | "error";
	}[];
	onRemove: (fileName: string) => void;
}

export default function UploadList({ files, onRemove }: UploadListProps) {
	return (
		<ul className="fixed bottom-10 right-10 z-40 w-full max-w-[480px] flex-col gap-3 rounded-[15px] bg-white p-5 shadow">
			<h3 className="text-lg font-bold">Uploading</h3>
			{files.map(({ file, progress }) => (
				<li key={file.name} className="flex items-center justify-between gap-3 rounded-xl bg-gray-100 p-3 shadow">
					<div className="flex items-center gap-3">
						<Thumbnail type={file.type} extension={file.name.split(".").pop() || ""} />
						<div className="w-[200px] text-sm">
							<p className="truncate">{file.name}</p>
							<div className="relative w-full h-2 bg-gray-200 rounded">
								<div className="absolute top-0 left-0 h-full rounded bg-blue-500" style={{ width: `${progress}%` }} />
							</div>
						</div>
					</div>
					<MdClose size={20} className="cursor-pointer text-red-500" onClick={() => onRemove(file.name)} />
				</li>
			))}
		</ul>
	);
}