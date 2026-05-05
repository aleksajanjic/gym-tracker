import { Outlet } from "react-router-dom";
import Navigation from "../navigation/Navigation";

export default function AppLayout() {
	return (
		<div className="app-shell">
			<Navigation />
			<main className="app-content">
				<Outlet />
			</main>
		</div>
	);
}

