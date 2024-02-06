import React, { useEffect, useState } from "react";
import Users from "./Users";
import { User } from "./store/dataInterfaces";
import SideBar from "./Sidebar";

export interface DashboardProps {
	setShowLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}
export type AllSections = "users";

function Dashboard({ setShowLoginPage }: DashboardProps): JSX.Element {
	const [currentlyActiveSection, setCurrentlyActiveSection] =
		useState<AllSections>("users");
	return (
		<div className="flex flex-row h-full w-full gap-5 flex-nowrap bg-gray-100">
			<SideBar />
			<Users setShowLoginPage={setShowLoginPage} />
		</div>
	);
}

export default Dashboard;
