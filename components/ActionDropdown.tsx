"use client";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	deleteFile,
	renameFile,
	updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";
import { HiDotsVertical } from "react-icons/hi";
import { IconType } from "react-icons";

interface ActionType {
	value: string;
	label: string;
	icon: IconType;
}

const ActionDropdown = ({ file }: { file: Models.Document }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(file.name);
	const [isLoading, setIsLoading] = useState(false);
	const [emails, setEmails] = useState<string[]>([]);

	const path = usePathname();

	const closeAllModals = () => {
		setIsModalOpen(false);
		setIsDropdownOpen(false);
		setAction(null);
		setName(file.name);
	};

	const handleAction = async () => {
		if (!action) return;
		setIsLoading(true);
		let success = false;

		const actions = {
			rename: () =>
				renameFile({ fileId: file.$id, name, extension: file.extension, path }),
			share: () => updateFileUsers({ fileId: file.$id, emails, path }),
			delete: () =>
				deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
		};

		success = await actions[action.value as keyof typeof actions]();

		if (success) closeAllModals();

		setIsLoading(false);
	};

	const handleRemoveUser = async (email: string) => {
		const updatedEmails = emails.filter((e) => e !== email);

		const success = await updateFileUsers({
			fileId: file.$id,
			emails: updatedEmails,
			path,
		});

		if (success) setEmails(updatedEmails);
		closeAllModals();
	};

	const renderDialogContent = () => {
		if (!action) return null;

		const { value, label } = action;

		return (
			<DialogContent className="focus:ring-0 focus:ring-offset-0 focus-visible:border-none outline-none focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0">
				<DialogHeader className="flex flex-col gap-3">
					<DialogTitle className="text-center text-zinc-800">
						{label}
					</DialogTitle>
					{value === "rename" && (
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					)}
					{value === "details" && <FileDetails file={file} />}
					{value === "share" && (
						<ShareInput
							file={file}
							onInputChange={setEmails}
							onRemove={handleRemoveUser}
						/>
					)}
					{value === "delete" && (
						<p className="text-center text-zinc-300">
							Are you sure you want to delete{` `}
							<span className="font-medium text-brand-100">{file.name}</span>?
						</p>
					)}
				</DialogHeader>
				{["rename", "delete", "share"].includes(value) && (
					<DialogFooter className="flex flex-col gap-3 md:flex-row">
						<Button onClick={closeAllModals} className="p-3 flex-1 rounded-full bg-white text-zinc-800 hover:bg-transparent">
							Cancel
						</Button>
						<Button onClick={handleAction} className="!mx-0 h-[52px] w-full flex-1">
							<p className="capitalize">{value}</p>
							{isLoading && (
								<div className="flex flex-col items-center">
									<div className="animate-spin rounded-full h-5 w-5 border-t-[2px] border-white"></div>
								</div>
							)}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger className="outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
					<HiDotsVertical size={20} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel className="max-w-[200px] truncate">
						{file.name}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actionsDropdownItems.map((actionItem) => (
						<DropdownMenuItem
							key={actionItem.value}
							className="cursor-pointer"
							onClick={() => {
								setAction({
									...actionItem,
									icon: actionItem.icon,
								});

								if (
									["rename", "share", "delete", "details"].includes(
										actionItem.value
									)
								) {
									setIsModalOpen(true);
								}
							}}
						>
							{actionItem.value === "download" ? (
								<Link
									href={constructDownloadUrl(file.bucketFileId)}
									download={file.name}
									className="flex items-center gap-2"
								>
									{actionItem.icon && <actionItem.icon size={20} />}
									{actionItem.label}
								</Link>
							) : (
								<div className="flex items-center gap-2">
									{actionItem.icon && <actionItem.icon size={20} />}
									{actionItem.label}
								</div>
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{renderDialogContent()}
		</Dialog>
	);
};
export default ActionDropdown;