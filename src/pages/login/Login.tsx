import { useState } from "react";
import { supabase } from "../../lib/supabase/supabaseClient";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setError(error.message);
				return;
			}

			
      if (data.session) {
				navigate("/dashboard");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="login" onSubmit={handleSubmit}>
			<input
				required
				type="email"
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				required
				type="password"
				placeholder="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			{error && <p>{error}</p>}

			<button type="submit" disabled={loading}>
				{loading ? "Loading..." : "Login"}
			</button>

			<Link to="/register">Click here to register</Link>
		</form>
	);
}

export default Login;
