import { supabase } from "../lib/supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

export function useLogout() {
	const navigate = useNavigate();

	const logout = async () => {
		await supabase.auth.signOut();
		navigate("/login");
	};

	return logout;
}
