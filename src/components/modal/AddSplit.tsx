import { useState } from "react";
import addWorkoutTemplates from "../../services/AddWorkoutTemplate";
import { useQueryClient } from "@tanstack/react-query";

type AddSplitProps = {
	closeModal: () => void;
};

function AddSplit(props: AddSplitProps) {
	const { closeModal } = props;
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		color: "",
		active: false,
		days_per_week: 0,
	});

	const handleChange = (e: any) => {
		const { name, value, type, checked } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		await addWorkoutTemplates(formData);
		await queryClient.invalidateQueries({
			queryKey: ["workout_templates"],
		});
		closeModal();
	};

	return (
		<div className="add-split">
			<form className="add-split__form" onSubmit={handleSubmit}>
				<span className="add-split__header">
					<h2>Create Split</h2>
					<button type="button" className="close" onClick={closeModal}>
						X
					</button>
				</span>

				<div className="form-group">
					<label htmlFor="name">Split Name</label>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="Push Pull Legs"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="description">Description</label>
					<input
						id="description"
						name="description"
						type="text"
						placeholder="Strength focused split"
						value={formData.description}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="color">Color</label>
					<input
						id="color"
						name="color"
						type="color"
						value={formData.color}
						onChange={handleChange}
					/>
				</div>

				<div className="checkbox-group">
					<input
						id="active"
						name="active"
						type="checkbox"
						checked={formData.active}
						onChange={handleChange}
					/>
					<label htmlFor="active">Active Split</label>
				</div>

				<button type="submit">Create Split</button>
			</form>
		</div>
	);
}

export default AddSplit;
