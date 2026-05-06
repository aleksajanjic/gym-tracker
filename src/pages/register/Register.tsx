import { useState } from "react";
import { supabase } from "../../lib/supabase/supabaseClient";

function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		setError(null);

		const { error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="email"
			/>

			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="password"
			/>

			<button type="submit" disabled={loading}>
				{loading ? "Creating..." : "Register"}
			</button>

			{error && <p>{error}</p>}
		</form>
	);
}

export default Register;
