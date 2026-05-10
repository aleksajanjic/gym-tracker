import type { CardType } from "../../types/types";

type CardProps = {
	card: CardType;
	handleDelete: (id: string) => void;
	handleEdit: (card: CardType) => void;
};

function Card(props: CardProps) {
	const { card, handleEdit, handleDelete } = props;

	return (
		<div className="template-card">
			<div className="content-wrapper">
				<p>{card.name}</p>
				<p>{card.description}</p>
			</div>
			<div className="btn-wrapper">
				<button
					type="button"
					className="btn edit"
					onClick={() => handleEdit(card)}
				>
					edit
				</button>
				<button
					type="button"
					className="btn delete"
					onClick={() => handleDelete(card.id)}
				>
					delete
				</button>
			</div>
		</div>
	);
}

export default Card;
