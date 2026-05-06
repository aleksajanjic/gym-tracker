import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

	const handleTabChange = (index: number) => {
		setActive(index);
		navigate(tabs[index].path);
	};

	return (
		<div className="navigation">
			{tabs.map((tab, index) => (
				<div
					key={tab.id}
					className={`nav-item ${active === index ? "selected" : ""}`}
					onClick={() => handleTabChange(index)}
				>
					{tab.label}
				</div>
			))}
		</div>
	);
}
export default Navigation;
