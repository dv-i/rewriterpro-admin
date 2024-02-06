import MongoDbClient from "./store/MongoDbClient";
import { USERS_COLLECTION } from "./store/constants";
import { User } from "./store/dataInterfaces";

export const toHash = async (payload: string): Promise<string> => {
	const utf8 = new TextEncoder().encode(payload);
	const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
};

export const login = async (
	email: string,
	password: string
): Promise<User | undefined> => {
	const mongo = new MongoDbClient();
	const user = await mongo.findOne(USERS_COLLECTION, {
		email,
	});
	if (!user) {
		console.error("Unauthorized!");
		return;
	}
	const passwordHash = user.passwordHash;
	const authorized = (await toHash(password)) === passwordHash;
	if (!authorized) {
		console.error("Unauthorized!");
		return;
	}
	return user;
};
