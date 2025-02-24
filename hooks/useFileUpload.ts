import { useCallback, useReducer } from "react";
import { uploadFile } from "@/lib/actions/file.actions";
import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE } from "@/constants";

type FileState = {
	file: File;
	progress: number;
	status: "pending" | "uploading" | "success" | "error";
}[];

type Action =
	| { type: "ADD_FILES"; files: File[] }
	| { type: "UPDATE_PROGRESS"; fileName: string; progress: number }
	| { type: "UPLOAD_SUCCESS"; fileName: string }
	| { type: "UPLOAD_ERROR"; fileName: string; message: string }
	| { type: "REMOVE_FILE"; fileName: string };

const fileReducer = (state: FileState, action: Action): FileState => {
	switch (action.type) {
		case "ADD_FILES":
			return [
				...state,
				...action.files.map((file) => ({
					file,
					progress: 0,
					status: "pending" as const,
				})),
			];
		case "UPDATE_PROGRESS":
			return state.map((item) =>
				item.file.name === action.fileName ? { ...item, progress: action.progress } : item
			);
		case "UPLOAD_SUCCESS":
			return state.map((item) =>
				item.file.name === action.fileName ? { ...item, status: "success" } : item
			);
		case "UPLOAD_ERROR":
			return state.map((item) =>
				item.file.name === action.fileName ? { ...item, status: "error" } : item
			);
		case "REMOVE_FILE":
			return state.filter((item) => item.file.name !== action.fileName);
		default:
			return state;
	}
};

export const useFileUpload = (ownerId: string, accountId: string, path: string) => {
	const { toast } = useToast();
	const [files, dispatch] = useReducer(fileReducer, []);

	const uploadFiles = useCallback(
		async (acceptedFiles: File[]) => {
			dispatch({ type: "ADD_FILES", files: acceptedFiles });

			await Promise.all(
				acceptedFiles.map(async (file) => {
					if (file.size > MAX_FILE_SIZE) {
						toast({
							title: "File too large",
							description: "Please upload a file smaller than 50MB.",
							variant: "destructive",
						});
						dispatch({ type: "REMOVE_FILE", fileName: file.name });
						return;
					}

					try {
						dispatch({ type: "UPDATE_PROGRESS", fileName: file.name, progress: 10 });
						const uploadedFile = await uploadFile({ file, ownerId, accountId, path });
						if (uploadedFile) {
							dispatch({ type: "UPLOAD_SUCCESS", fileName: file.name });
						}
					} catch {
						dispatch({ type: "UPLOAD_ERROR", fileName: file.name, message: "Upload failed." });
					}
				})
			);
		},
		[ownerId, accountId, path, toast]
	);

	const removeFile = useCallback((fileName: string) => {
		dispatch({ type: "REMOVE_FILE", fileName });
	}, []);

	return { files, uploadFiles, removeFile };
};