import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { CardType } from "../../types/types";
import updateWorkoutTemplate from "../../services/EditWorkoutTemplate";

type EditSplitProps = {
	closeModal: (card: CardType) => void;
	card: CardType;
};

function EditSplit(props: EditSplitProps) {
	const { closeModal, card } = props;
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		name: card.name ?? "",
		description: card.description ?? "",
		color: card.color ?? "",
		active: card.is_active ?? false,
		days_per_week: card.days_per_week ?? 0,
	});

	useEffect(() => {
		setFormData({
			name: card.name ?? "",
			description: card.description ?? "",
			color: card.color ?? "",
			active: card.is_active ?? false,
			days_per_week: card.days_per_week ?? 0,
		});
	}, [card]);

	const handleChange = (e: any) => {
		const { name, value, type, checked } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleEdit = async (e: any) => {
		e.preventDefault();

		try {
			await updateWorkoutTemplate({
				id: card.id,
				name: formData.name,
				description: formData.description,
				color: formData.color,
				is_active: formData.active,
				days_per_week:
					typeof formData.days_per_week === "number" &&
					formData.days_per_week > 0
						? formData.days_per_week
						: card.days_per_week,
			});

			await queryClient.invalidateQueries({
				queryKey: ["workout_templates"],
			});

			closeModal();
		} catch (err) {
			console.error(err);
			alert(err instanceof Error ? err.message : "Failed to save changes");
		}
	};

	return (
		<div className="add-split">
			<form className="add-split__form" onSubmit={handleEdit}>
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

				<button type="submit">Edit Split</button>
			</form>
		</div>
	);
}

export default EditSplit;
