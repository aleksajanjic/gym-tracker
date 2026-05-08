import { useState } from "react";
import { useWorkoutTemplates } from "../../../hooks/useFetchDbData";
import AddSplit from "../../modal/AddSplit";
import Card from "../../ui/Card";
import deleteWorkoutTemplate from "../../../services/DeleteWorkoutTemplate";
import { useQueryClient } from "@tanstack/react-query";

function Templates() {
	const { data, isLoading, error } = useWorkoutTemplates();
	const [showModal, setShowModal] = useState(false);
	const queryClient = useQueryClient();

	if (isLoading) return <p>Loading...</p>;

	if (error instanceof Error) {
		return <p>{error.message}</p>;
	}

	const handleToggleModal = () => {
		setShowModal((prev) => !prev);
	};

	const handleEdit = (e: any) => {
		e.preventDefault();
		console.log("edit", e);
	};

	const handleDelete = async (id: string) => {
		console.log("delete id:", id);
		await deleteWorkoutTemplate(id);

		await queryClient.invalidateQueries({
			queryKey: ["workout_templates"],
		});
	};

	return (
		<div className="templates">
			<div className="title-wrapper">
				<h1>Templates component</h1>
				<button className="button" onClick={handleToggleModal}>
					+ New Split
				</button>
			</div>
			<div className="cards-wrapper">
				{data?.map((card) => (
					<Card
						key={card.id}
						card={card}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
					/>
				))}
				<div
					className="add-new-split-wrapper"
					onClick={handleToggleModal}
				>
					+ Create new split
				</div>
			</div>

			<div className={`modal ${showModal ? "show" : ""}`}>
				<AddSplit closeModal={handleToggleModal} />
			</div>
		</div>
	);
}

export default Templates;
