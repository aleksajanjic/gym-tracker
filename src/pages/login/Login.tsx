import { useState } from "react";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log("submit");
	};

	return (
		<form className="login" onSubmit={handleSubmit}>
			<input
				type="email"
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			{errors.email && <p>{errors.email}</p>}
			<input
				type="password"
				placeholder="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			{errors.password && <p>{errors.password}</p>}
			<button type="submit" disabled={loading}>
				{loading ? "Loading..." : "Login"}
			</button>
		</form>
	);
}

export default Login;
