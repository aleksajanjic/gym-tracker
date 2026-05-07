import { useState } from "react";
import { supabase } from "../../lib/supabase/supabaseClient";
import { Link } from "react-router-dom";

function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) {
				setError(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="register" onSubmit={handleSubmit}>
			<input
				required
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="email"
			/>

			<input
				required
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="password"
			/>

			<button type="submit" disabled={loading}>
				{loading ? "Creating..." : "Register"}
			</button>

			{error && <p>{error}</p>}

			<Link to="/login">Click here to login</Link>
		</form>
	);
}

export default Register;
