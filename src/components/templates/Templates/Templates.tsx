import { useState } from "react";
import { useWorkoutTemplates } from "../../../hooks/useFetchDbData";
import AddSplit from "../../modal/AddSplit";
import Card from "../../ui/Card";
import deleteWorkoutTemplate from "../../../services/DeleteWorkoutTemplate";
import { useQueryClient } from "@tanstack/react-query";
import EditSplit from "../../modal/EditSplit";
import type { CardType } from "../../../types/types";

function Templates() {
	const { data, isLoading, error } = useWorkoutTemplates();
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [card, setCard] = useState<CardType | null>(null);
	const queryClient = useQueryClient();

	if (isLoading) return <p>Loading...</p>;

	if (error instanceof Error) {
		return <p>{error.message}</p>;
	}

	const handleToggleModal = () => {
		setShowModal((prev) => !prev);
	};

	const handleToggleEditModal = (card: CardType) => {
		setCard(card);
		setShowEditModal((prev) => !prev);
	};

	const handleDelete = async (id: string) => {
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
						handleEdit={handleToggleEditModal}
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

			<div className={`modal ${showEditModal ? "show" : ""}`}>
				{showEditModal && card && (
					<EditSplit closeModal={handleToggleEditModal} card={card} />
				)}
			</div>
		</div>
	);
}

export default Templates;
