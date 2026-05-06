import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { supabase } from "@/lib/supabase/supabaseClient";
// import "./App.css";
import Workout from "./components/workout/Workout";
import Dashboard from "./components/dashboard/Dashboard/Dashboard";
import Templates from "./components/templates/Templates/Templates";
import AppLayout from "./components/layout/AppLayout";
import WorkoutHistory from "./components/workout/WorkoutHistory";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	supabase.auth.getSession().then(({ data }) => {
	// 		setSession(data.session);
	// 		setLoading(false);
	// 	});
	// 	const { data: listener } = supabase.auth.onAuthStateChange(
	// 		(_, session) => {
	// 			setSession(session);
	// 		},
	// 	);
	// 	return () => {
	// 		listener.subscription.unsubscribe();
	// 	};
	// }, []);

	if (loading) return null;

	// const isLoggedIn = !!session;
	const isLoggedIn = false;

	function ProtectedRoute({ children }: { children: React.ReactElement }) {
		if (!isLoggedIn) {
			return <Navigate to="/login" replace />;
		}
		return children;
	}

	function PublicOnly({ children }: { children: React.ReactElement }) {
		if (isLoggedIn) {
			return <Navigate to="/dashboard" replace />;
		}
		return children;
	}

	return (
		<Routes>
			<Route
				path="/login"
				element={
					<PublicOnly>
						<Login />
					</PublicOnly>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicOnly>
						<Register />
					</PublicOnly>
				}
			/>
			<Route
				element={
					<ProtectedRoute>
						<AppLayout />
					</ProtectedRoute>
				}
			>
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
