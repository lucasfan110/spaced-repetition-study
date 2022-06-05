import { Link, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Deck from "../Deck";
import AddCard from "./AddCard";
import StudyDeck from "./StudyDeck";

type Props = {
	deck: Deck;
};
export default function DeckPage({ deck }: Props): JSX.Element {
	const navigate = useNavigate();

	console.log(`is flashcards undefined? ${deck.flashcards === undefined}`);

	return (
		<main className="container">
			<StudyDeck deck={deck} />

			<div className="row justify-content-center">
				<Link to="add-card" className="btn btn-primary col-4">
					Add Card
				</Link>
			</div>

			<div className="row justify-content-center mt-2">
				<Link to="/" className="btn btn-secondary col-4">
					Go back
				</Link>
			</div>

			<Routes>
				<Route
					path="add-card"
					element={
						<AddCard
							onSubmit={data => {
								deck.addCard(data);
								navigate("");
							}}
						/>
					}
				/>
			</Routes>
		</main>
	);
}
