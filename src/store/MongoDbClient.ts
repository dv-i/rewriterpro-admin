import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { DATABASE } from "../constants";
import { type QuestionAndResponse, type User } from "./dataInterfaces";
import { getMongoAccessToken, setMongoAccessToken } from "./browser";

const getAxiosClient = async (): Promise<AxiosInstance> => {
	if (!getMongoAccessToken()) {
		await refreshMongoAccessToken();
	}
	return axios.create({
		baseURL: DATABASE.URL,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getMongoAccessToken()}`,
		},
	});
};

export const refreshMongoAccessToken = async (): Promise<void> => {
	const mongoAuthDetails = await axios.post(DATABASE.AUTH_URL, {
		key: "xxftT7sLbxrs7zVO9phG4xgPKd4HVCGpeW3atzbToEIwrM8Rw3KhbTeIE3R0rHN7",
	});
	if (mongoAuthDetails.data.access_token) {
		setMongoAccessToken(mongoAuthDetails.data.access_token);
	}
};

class MongoDbClient {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async handleMongoAccessTokenRefresh(error: any): Promise<void> {
		if (error.code === "ERR_NETWORK" || error.code === "ERR_BAD_REQUEST") {
			await refreshMongoAccessToken();
		}
	}

	async findOne(
		collection: string,
		filter: Record<string, string>
	): Promise<User | null> {
		try {
			const body = {
				dataSource: DATABASE.DATA_SOURCE,
				database: DATABASE.NAME,
				collection,
				filter,
			};
			const axiosClient = await getAxiosClient();
			const response = await axiosClient.post("/action/findOne", body);
			return response.data.document;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// console.error(
			// 	`Failed to findOne from ${DATABASE.NAME} - ${collection}`,
			// 	error
			// );
			await this.handleMongoAccessTokenRefresh(error);

			throw error;
		}
	}

	async find(collection: string, filter?: any): Promise<any[] | []> {
		try {
			const body = {
				dataSource: DATABASE.DATA_SOURCE,
				database: DATABASE.NAME,
				collection,
				filter: filter || null,
			};
			const axiosClient = await getAxiosClient();

			const response = await axiosClient.post("/action/find", body);
			return response.data.documents;
		} catch (error) {
			// console.error(
			// 	`Failed to findOne from ${DATABASE.NAME} - ${collection}`,
			// 	error
			// );
			await this.handleMongoAccessTokenRefresh(error);
			throw error;
		}
	}

	async insertOneUser(
		collection: string,
		document: User
	): Promise<AxiosResponse | null> {
		try {
			const body = {
				dataSource: DATABASE.DATA_SOURCE,
				database: DATABASE.NAME,
				collection,
				document,
			};
			const userAlreadyExists = await this.findOne("users", {
				email: document.email,
			});
			if (userAlreadyExists) {
				throw new Error("User already exists");
			}
			const axiosClient = await getAxiosClient();
			const response = await axiosClient.post("/action/insertOne", body);
			return response.data;
		} catch (error) {
			// console.error(error);
			await this.handleMongoAccessTokenRefresh(error);
		}
		return null;
	}

	async insertOneQuestionAndResponse(
		collection: string,
		document: QuestionAndResponse
	): Promise<AxiosResponse | null> {
		try {
			const body = {
				dataSource: DATABASE.DATA_SOURCE,
				database: DATABASE.NAME,
				collection,
				document,
			};
			const axiosClient = await getAxiosClient();
			const response = await axiosClient.post("/action/insertOne", body);
			return response.data;
		} catch (error) {
			// console.error(error);
			await this.handleMongoAccessTokenRefresh(error);
		}
		return null;
	}

	async updateOne(
		collection: string,
		filter: Record<string, string>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		update: Record<string, any>
	): Promise<AxiosResponse | null> {
		try {
			const body = {
				dataSource: DATABASE.DATA_SOURCE,
				database: DATABASE.NAME,
				collection,
				filter,
				update,
			};

			const axiosClient = await getAxiosClient();
			const response = await axiosClient.post("/action/updateOne", body);
			return response.data;
		} catch (error) {
			// console.error(
			// 	`Failed to updateOne in ${DATABASE.NAME} - ${collection}`,
			// 	error
			// );
			await this.handleMongoAccessTokenRefresh(error);
		}
		return null;
	}
}

export default MongoDbClient;
