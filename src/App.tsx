import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Workout from "./components/workout/Workout";
import Dashboard from "./components/dashboard/Dashboard/Dashboard";
import Templates from "./components/templates/Templates/Templates";
import AppLayout from "./components/layout/AppLayout";
import WorkoutHistory from "./components/workout/WorkoutHistory";

function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/workout/current" element={<Workout />} />
				<Route path="/templates" element={<Templates />} />
				<Route path="/workout/history" element={<WorkoutHistory />} />
			</Route>
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
}

export default App;
