"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";

const getUserByEmail = async (email: string) => {
	const { database } = await createAdminClient();

	const result = await database.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		[Query.equal("email", [email])],
	);

	return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
	console.log(error, message);
	throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
	const { account } = await createAdminClient();

	try {
		const session = await account.createEmailToken(ID.unique(), email);

		return session.userId;
	} catch (error) {
		handleError(error, "Failed to send email OTP");
	}
};

export const createAccount = async ({
	username,
	email,
}: {
	username: string;
	email: string;
}) => {
	const existingUser = await getUserByEmail(email);

	const accountId = await sendEmailOTP({ email });
	if (!accountId) throw new Error("Failed to send an OTP");

	if (!existingUser) {
		const { database } = await createAdminClient();

		await database.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			{
				username,
				email,
				avatar: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg",
				accountId,
				account: accountId,
			},
		);
	}

	return parseStringify({ accountId });
};