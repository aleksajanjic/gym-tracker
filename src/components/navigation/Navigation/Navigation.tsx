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
];

function Navigation() {
	return (
		<div className="navigation">
			{tabs.map((tab) => (
				<div key={tab.id} className="nav-item">{tab.label}</div>
			))}
		</div>
	);
}
export default Navigation;
