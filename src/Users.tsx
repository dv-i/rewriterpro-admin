import { useEffect, useState } from "react";
import { User } from "./store/dataInterfaces";
import MongoDbClient from "./store/MongoDbClient";
import {
	QUESTIONS_AND_RESPONSES_COLLECTION,
	USERS_COLLECTION,
} from "./store/constants";
import { PER_TOKEN_PRICE_INPUT, PER_TOKEN_PRICE_OUTPUT } from "./constants";
import { DashboardProps } from "./Dashboard";

function Users({ setShowLoginPage }: DashboardProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [usersWithCosts, setUsersWithCosts] = useState<any>();
	const [totalCostForAllUsers, setTotalCostForAllUsers] = useState<number>(0);
	const mongo = new MongoDbClient();

	useEffect(() => {
		mongo.find(USERS_COLLECTION).then((res: User[]) => {
			setUsers(
				res.filter(
					(user) =>
						user.subscriptionPeriodEndDateEpochSeconds || user.pro
				)
			);
		});
	}, []);

	function getTotalCharacters(strings: string[]): number {
		let totalCharacters = 0;

		for (const str of strings) {
			totalCharacters += str.length;
		}

		return totalCharacters;
	}

	const getTotalCostPerUser = async (): Promise<void> => {
		//	This function was a one time thing. It should not be needed once every user has a totalCost field
		//	The totalCost field will be updated in the rewriterpro codebase i.e the frontend app
		const userCostMap = {};
		for (const user of users) {
			if (user.totalCost === undefined) {
				const questionsAndResponses = await mongo.find(
					QUESTIONS_AND_RESPONSES_COLLECTION,
					{
						userId: user._id,
					}
				);
				const questions = questionsAndResponses.map(
					(res) => res.question
				);
				const responses = questionsAndResponses.map(
					(res) => res.response
				);
				const totalCharsInQues = getTotalCharacters(questions);
				const totalCharsInResponses = getTotalCharacters(responses);
				const totalInputCost = totalCharsInQues * PER_TOKEN_PRICE_INPUT;
				const totalOutputCost =
					totalCharsInResponses * PER_TOKEN_PRICE_OUTPUT;
				const totalCost = totalInputCost + totalOutputCost;
				userCostMap[user.email] = totalCost;
				await mongo.updateOne(
					USERS_COLLECTION,
					{
						email: user.email,
					},
					{
						$set: {
							totalCost,
						},
					}
				);
			}
		}

		setUsersWithCosts(userCostMap);
	};

	const getTotalLifetimeCostForAllUsers = (): void => {
		let totalCostSum = 0;
		for (const user of users) {
			if (user.totalCost) {
				totalCostSum = totalCostSum + user.totalCost;
			}
		}
		setTotalCostForAllUsers(totalCostSum);
	};

	useEffect(() => {
		if (users) {
			getTotalCostPerUser().then(() => {
				//
			});
			getTotalLifetimeCostForAllUsers();
		}
	}, [users]);

	return (
		<div className="py-6 grow-[6] px-6 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">
						Users
					</h1>
					<p className="mt-2 text-sm text-gray-700">
						A list of all the users in your account including their
						name, email and total cost.
					</p>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						onClick={() => {
							localStorage.clear();
							setShowLoginPage(true);
						}}
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Logout
					</button>
				</div>
			</div>
			<div>
				<h3 className="mt-5 text-base font-semibold leading-6 text-gray-900">
					Lifetime
				</h3>
				<dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
					<div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
						<dt className="truncate text-sm font-medium text-gray-500">
							OpenAI API cost for pro users
						</dt>
						<dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
							${totalCostForAllUsers.toFixed(2)}
						</dd>
					</div>
				</dl>
			</div>
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="overflow-y-scroll h-screen min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th
										scope="col"
										className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
									>
										Email
									</th>
									<th
										scope="col"
										className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Full Name
									</th>
									<th
										scope="col"
										className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Cost ($)
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{users.map((person) => (
									<tr key={person.email}>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
											{person.email}
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
											{person.fullName}
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
											{(usersWithCosts &&
												Object.keys(usersWithCosts)
													.length > 0 &&
												usersWithCosts[person.email]) ||
												person.totalCost?.toFixed(4)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Users;
