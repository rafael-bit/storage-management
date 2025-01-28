"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

type FileType = "image" | "document" | "video" | "audio" | "other";

interface UploadFileProps {
	file: File;
	ownerId: string;
	accountId: string;
	path: string;
}

interface GetFilesProps {
	types?: string[];
	searchText?: string;
	sort?: string;
	limit?: number;
}

interface RenameFileProps {
	fileId: string;
	name: string;
	extension: string;
	path: string;
}

interface UpdateFileUsersProps {
	fileId: string;
	emails: string[];
	path: string;
}

interface DeleteFileProps {
	fileId: string;
	bucketFileId: string;
	path: string;
}

const handleError = (error: unknown, message: string): never => {
	console.error(error, message);
	throw new Error(message);
};

export const uploadFile = async ({
	file,
	ownerId,
	accountId,
	path,
}: UploadFileProps) => {
	const { storage, database } = await createAdminClient();

	try {
		const inputFile = InputFile.fromBuffer(file, file.name);

		const bucketFile = await storage.createFile(
			appwriteConfig.bucketId,
			ID.unique(),
			inputFile,
		);

		const fileDocument = {
			type: getFileType(bucketFile.name).type,
			name: bucketFile.name,
			url: constructFileUrl(bucketFile.$id),
			extension: getFileType(bucketFile.name).extension,
			size: bucketFile.sizeOriginal,
			owner: ownerId,
			accountId,
			users: [] as string[],
			bucketFileId: bucketFile.$id,
		};

		const newFile = await database.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			ID.unique(),
			fileDocument,
		);

		revalidatePath(path);
		return parseStringify(newFile);
	} catch (error) {
		handleError(error, "Failed to upload file");
	}
};

const createQueries = (
	currentUser: Models.Document,
	types: string[],
	searchText: string,
	sort: string,
	limit?: number,
): string[] => {
	const queries = [
		Query.or([
			Query.equal("owner", [currentUser.$id]),
			Query.contains("users", [currentUser.email]),
		]),
	];

	if (types.length > 0) queries.push(Query.equal("type", types));
	if (searchText) queries.push(Query.contains("name", searchText));
	if (limit) queries.push(Query.limit(limit));

	if (sort) {
		const [sortBy, orderBy] = sort.split("-");
		queries.push(
			orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
		);
	}

	return queries;
};

export const getFiles = async ({
	types = [],
	searchText = "",
	sort = "$createdAt-desc",
	limit,
}: GetFilesProps) => {
	const { database } = await createAdminClient();

	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) throw new Error("User not found");

		const queries = createQueries(currentUser, types, searchText, sort, limit);

		const files = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			queries,
		);

		return parseStringify(files);
	} catch (error) {
		handleError(error, "Failed to get files");
	}
};

export const renameFile = async ({
	fileId,
	name,
	extension,
	path,
}: RenameFileProps) => {
	const { database } = await createAdminClient();

	try {
		const newName = `${name}.${extension}`;
		const updatedFile = await database.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				name: newName,
			},
		);

		revalidatePath(path);
		return parseStringify(updatedFile);
	} catch (error) {
		handleError(error, "Failed to rename file");
	}
};

export const updateFileUsers = async ({
	fileId,
	emails,
	path,
}: UpdateFileUsersProps) => {
	const { database } = await createAdminClient();

	try {
		const updatedFile = await database.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				users: emails,
			},
		);

		revalidatePath(path);
		return parseStringify(updatedFile);
	} catch (error) {
		handleError(error, "Failed to update file users");
	}
};

export const deleteFile = async ({
	fileId,
	bucketFileId,
	path,
}: DeleteFileProps) => {
	const { database, storage } = await createAdminClient();

	try {
		await database.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
		);

		await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);

		revalidatePath(path);
		return parseStringify({ status: "success" });
	} catch (error) {
		handleError(error, "Failed to delete file");
	}
};

export const getTotalSpaceUsed = async () => {
	try {
		const { database } = await createSessionClient();
		const currentUser = await getCurrentUser();
		if (!currentUser) throw new Error("User is not authenticated.");

		const files = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			[Query.equal("owner", [currentUser.$id])],
		);

		const totalSpace = {
			image: { size: 0, latestDate: "" },
			document: { size: 0, latestDate: "" },
			video: { size: 0, latestDate: "" },
			audio: { size: 0, latestDate: "" },
			other: { size: 0, latestDate: "" },
			used: 0,
			all: 2 * 1024 * 1024 * 1024, // 2GB bucket storage
		};

		files.documents.forEach((file) => {
			const fileType = file.type as FileType;
			totalSpace[fileType].size += file.size;
			totalSpace.used += file.size;

			if (
				!totalSpace[fileType].latestDate ||
				new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
			) {
				totalSpace[fileType].latestDate = file.$updatedAt;
			}
		});

		return parseStringify(totalSpace);
	} catch (error) {
		handleError(error, "Error calculating total space used");
	}
};