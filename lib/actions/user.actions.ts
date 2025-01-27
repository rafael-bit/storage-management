"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
				account: accountId,
			},
		);
	}

	return parseStringify({ accountId });
};

export const verifySecret = async ({
	accountId,
	password,
}: {
	accountId: string;
	password: string;
}) => {
	try {
		const { account } = await createAdminClient();

		const session = await account.createSession(accountId, password);

		(await cookies()).set("appwrite-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});

		return parseStringify({ sessionId: session.$id });
	} catch (error) {
		handleError(error, "Failed to verify OTP");
	}
};

export const getCurrentUser = async () => {
	try {
		const { database, account } = await createSessionClient();
		const result = await account.get();

		const user = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			[Query.equal("account", [result.$id])],
		);

		if (user.total <= 0) {
			return null;
		}

		return parseStringify(user.documents[0]);
	} catch (error) {
		console.error("Erro ao buscar o usuário:", error);
		return null;
	}
};

export const signOutUser = async () => {
	const { account } = await createSessionClient();

	try {
		await account.deleteSession("current");
		(await cookies()).delete("appwrite-session")
	}catch (error) {
		handleError(error, "Failed to sign out");
	} finally {
		redirect("/sign-in")
	}
}

export const signInUser = async ({ email }: { email: string }) => {
	try {
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			await sendEmailOTP({ email });
			return parseStringify({ accountId: existingUser.accountId });
		}

		return parseStringify({ accountId: null, error: "User not found" });
	} catch (error) {
		handleError(error, "Failed to sign in user");
	}
};