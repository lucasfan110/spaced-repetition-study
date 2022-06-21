import React from "react";
import Row from "react-bootstrap/Row";
import Deck from "../Deck";
import "./ShowAll.scss";

type CardLine = {
	question: React.RefObject<HTMLTextAreaElement>;
	answer: React.RefObject<HTMLTextAreaElement>;
};

type AllCards = CardLine[];

function resizeCard(card: CardLine) {
	const { question, answer } = card;

	if (question.current === null) {
		return;
	}
	if (answer.current === null) {
		return;
	}

	const maxHeight = Math.max(question.current.scrollHeight, answer.current.scrollHeight);

	const heightStyle = `${maxHeight + 3}px`;

	question.current.style.height = "auto";
	answer.current.style.height = "auto";

	question.current.style.height = heightStyle;
	answer.current.style.height = heightStyle;
}

type Props = {
	deck: Deck;
};
export default function ShowAll({ deck }: Props): JSX.Element {
	// The collection of all cards question text area and answer text area so
	// they can be resized to fit their content
	const cards = React.useRef<AllCards>([]);

	React.useEffect(() => {
		// Fit the content on each text area
		cards.current.forEach(resizeCard);
	}, []);

	const displayCards = () => {
		return deck.flashcards.map(card => {
			const quesRef = React.useRef<HTMLTextAreaElement>(null);
			const ansRef = React.useRef<HTMLTextAreaElement>(null);

			cards.current.push({ question: quesRef, answer: ansRef });

			return (
				<li key={`${card.question}-cq`} className="card-term">
					<textarea className="card-question" value={card.question} ref={quesRef} readOnly />
					<textarea className="card-answer" value={card.answer} ref={ansRef} readOnly />
				</li>
			);
		});
	};

	return (
		<Row className="justify-content-center mt-3">
			<div className="col-8">
				<ul className="card-terms">
					<li key="hint" className="card-term mb-0">
						<textarea className="card-question lead" value="Questions" readOnly />
						<textarea className="card-answer lead" value="Answers" readOnly />
					</li>

					{displayCards()}
				</ul>
			</div>
		</Row>
	);
}
