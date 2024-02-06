import * as React from "react";
// import { LockClosedIcon } from '@heroicons/react/20/solid'
import backgroundImg from "./assets/logo.png";
import { setAuthenticatedUser } from "./store/browser";
import { login } from "./utils";
import { User } from "./store/dataInterfaces";
import { ToastProps } from "./ToastNotification";

export interface LoginProps {
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	setShowLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
	toast: ToastProps | undefined;
	setToast: React.Dispatch<React.SetStateAction<ToastProps | undefined>>;
}

export const Login = ({
	setUser,
	setShowLoginPage,
	toast,
	setToast,
}: LoginProps) => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const handleFormSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		if (email && password) {
			try {
				const authedUser = await login(email, password);
				if (authedUser) {
					setAuthenticatedUser(authedUser);
					setUser(authedUser);
				} else {
					setToast({
						visible: true,
						title: "Could not login. Check credentials",
						type: "error",
					});
				}
			} catch (e) {
				setToast({
					visible: true,
					title: "Could not login. Check credentials",
					type: "error",
				});
			}
		}
	};
	return (
		<div className="min-h-screen bg-white flex">
			<div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
				<div className="mx-auto w-full max-w-sm">
					<div>
						<h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
							Log in to your account
						</h2>
					</div>

					<div className="mt-8">
						<div className="mt-6">
							<form onSubmit={handleFormSubmit} method="POST">
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium leading-5 text-gray-700"
									>
										Email address
									</label>
									<div className="mt-1 rounded-md shadow-sm">
										<input
											id="email"
											type="email"
											value={email}
											onChange={(e) => {
												setEmail(e.target.value);
											}}
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
										/>
									</div>
								</div>

								<div className="mt-6">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-5 text-gray-700"
									>
										Password
									</label>
									<div className="mt-1 rounded-md shadow-sm">
										<input
											id="password"
											type="password"
											value={password}
											onChange={(e) => {
												setPassword(e.target.value);
											}}
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
										/>
									</div>
								</div>

								<div className="mt-6">
									<span className="block w-full rounded-md shadow-sm">
										<button
											type="submit"
											className=" w-full inline-flex items-center align-baseline gap-1 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
										>
											Log in
										</button>
									</span>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-1 justify-center align-center relative w-0 bg-black">
				<img
					className="inset-0 w-3/6 object-contain"
					src={backgroundImg}
					alt=""
				/>
			</div>
		</div>
	);
};
