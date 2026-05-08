import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout";

interface TabData {
	id: string;
	label: string;
	path: string;
}

const tabs: TabData[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		path: "/dashboard",
	},
	{
		id: "workout",
		label: "Workout",
		path: "/workout/current",
	},
	{
		id: "templates",
		label: "Templates",
		path: "/templates",
	},
	{
		id: "workout-history",
		label: "Workout History",
		path: "/workout/history",
	},
];

function Navigation() {
	const [active, setActive] = useState(0);

	const navigate = useNavigate();
	const logout = useLogout();

	const handleTabChange = (index: number) => {
		setActive(index);
		navigate(tabs[index].path);
	};

	return (
		<div className="navigation">
			<p className="logo">
				<span className="iron">IRON</span>
				<span className="iq">IQ</span>
			</p>
			{tabs.map((tab, index) => (
				<div
					key={tab.id}
					className={`nav-item ${active === index ? "selected" : ""}`}
					onClick={() => handleTabChange(index)}
				>
					{tab.label}
				</div>
			))}
			<nav>
				<div className="logout" onClick={logout}>
					Logout
				</div>
			</nav>
		</div>
	);
}
export default Navigation;
