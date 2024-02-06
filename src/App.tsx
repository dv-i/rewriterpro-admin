import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { User } from "./store/dataInterfaces";
import { getAuthenticatedUser } from "./store/browser";
import { Login } from "./Login";
import { ToastNotification, ToastProps } from "./ToastNotification";

function App(): JSX.Element {
	const [user, setUser] = useState<User | null>(getAuthenticatedUser());
	const [showLoginPage, setShowLoginPage] = useState(true);
	const [toast, setToast] = useState<ToastProps>();

	useEffect(() => {
		if (user && user.admin) {
			setShowLoginPage(false);
		}
	}, [user]);

	return (
		<>
			<ToastNotification toast={toast} setToast={setToast} />
			<div className="h-full">
				{showLoginPage ? (
					<Login
						setUser={setUser}
						setShowLoginPage={setShowLoginPage}
						toast={toast}
						setToast={setToast}
					/>
				) : (
					<Dashboard setShowLoginPage={setShowLoginPage} />
				)}
			</div>
		</>
	);
}

export default App;
