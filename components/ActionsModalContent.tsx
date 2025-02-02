import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdGroupRemove } from "react-icons/md";

interface ActionsModalContentProps {
	file: Models.Document;
	onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
	onRemove: (email: string) => void;
}

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
	<div className="mb-1 flex items-center gap-3 rounded-xl border border-zinc-700/40 bg-zinc-600/50 p-3">
		<Thumbnail type={file.type} extension={file.extension} />
		<div className="flex flex-col">
			<p className="text-sm text-zinc-800 mb-1">{file.name}</p>
			<FormattedDateTime date={file.$createdAt} />
		</div>
	</div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
	<div className="flex">
		<p className="text-zinc-800 text-left">{label}</p>
		<p className="text-zinc-800 text-left">{value}</p>
	</div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
	return (
		<>
			<ImageThumbnail file={file} />
			<div className="space-y-4 px-2 pt-2">
				<DetailRow label="Format:" value={file.extension} />
				<DetailRow label="Size:" value={convertFileSize(file.size)} />
				<DetailRow label="Owner:" value={file.owner.username} />
				<DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
			</div>
		</>
	);
};

export const ShareInput = ({ file, onInputChange, onRemove }: ActionsModalContentProps) => {
	return (
		<>
			<ImageThumbnail file={file} />

			<div className="!mt-2 space-y-2">
				<p className="text-sm pl-1 text-zinc-800">
					Share file with other users
				</p>
				<Input
					type="email"
					placeholder="Enter email address"
					onChange={(e) => onInputChange(e.target.value.trim().split(","))}
					className="share-input-field"
				/>
				<div className="pt-4">
					<div className="flex justify-between">
						<p className="text-sm text-zinc-800">Shared with</p>
						<p className="text-sm text-zinc-400">
							{file.users.length} users
						</p>
					</div>

					<ul className="pt-2">
						{file.users.map((email: string) => (
							<li
								key={email}
								className="flex items-center justify-between gap-2"
							>
								<p className="text-sm">{email}</p>
								<Button
									onClick={() => onRemove(email)}
									className="rounded-full bg-transparent text-zinc-800 hover:text-red-500 transition-all duration-300 shadow-none hover:bg-transparent"
								>
									<MdGroupRemove />
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
