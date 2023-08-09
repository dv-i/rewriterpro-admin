import React, { useState } from "react";
import "./App.css";
import ToastNotification, { type ToastProps } from "./common/Toast";

function App(): JSX.Element {
	const [toast, setToast] = useState<ToastProps>();

	return (
		<>
			<ToastNotification toast={toast} setToast={setToast} />
			<div className="text-lg text-indigo-700 text-center">
				Hello Tailwind CSS
			</div>
		</>
	);
}

export default App;
