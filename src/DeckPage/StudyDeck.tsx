import React from "react";
import Deck, { Flashcard } from "../Deck";
import CardDisplay from "./Card";

type Props = {
	deck: Deck;
};
type State = {
	index: number;
};
export default class StudyDeck extends React.Component<Props, State> {
	filtered: Flashcard[];
	currentCard?: Flashcard;

	constructor(props: Props) {
		super(props);

		this.filtered = props.deck.spacedRepetitionFilter().reverse();
		this.currentCard = this.filtered.pop();

		this.state = {
			index: 0,
		};
	}

	nextCard(gotCorrect: boolean) {
		const { filtered, currentCard } = this;
		this.setState(state => {
			return {
				index: state.index + 1,
			};
		});
		if (currentCard !== undefined) {
			if (gotCorrect) {
				currentCard.correctCount += 1;
			} else {
				currentCard.correctCount = 1; // Set it to one because user saw the answer already and review it next day will be more effective
			}
			currentCard.lastTimeCorrect = new Date();
		}
		console.log("POPPED FILTERED.CURRENT");
		this.currentCard = filtered.pop();
		this.props.deck.save();
	}

	render(): React.ReactNode {
		const { currentCard } = this;

		return (() => {
			if (currentCard !== undefined) {
				return (
					<CardDisplay
						question={currentCard.question}
						answer={currentCard.answer}
						onNext={this.nextCard.bind(this)}
						key={this.state.index}
					/>
				);
			} else if (this.props.deck.flashcards.length === 0) {
				return (
					<>
						<h1 className="display-4 text-center">You don't have any cards in the deck yet</h1>
						<p className="lead m-5 text-center">Click add card button to start your study journey!</p>
					</>
				);
			} else {
				return (
					<>
						<h1 className="display-4 text-center">There is no more cards to study! Congrats!</h1>
						<p className="lead m-5 text-center">Check for more tomorrow!</p>
					</>
				);
			}
		})();
	}
}
