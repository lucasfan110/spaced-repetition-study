import Card from "./Card";
import Deck from "../Deck";

type Props = {
	deck: Deck;
};
export default function StudyDeck({ deck }: Props): JSX.Element {
	return (
		<>
			<h1 className="display-1 text-center">Study!</h1>
			<Card
				front={deck.flashcards[0].question}
				back={deck.flashcards[0].answer}
			/>
		</>
	);
}
