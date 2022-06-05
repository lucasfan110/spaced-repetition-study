import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import DeckPage from ".";
import Deck, { recentDeck } from "../Deck";

type Props = {
	isNewDeck?: boolean;
};
export default function LoadDeck({ isNewDeck }: Props) {
	const [deck, setDeck] = React.useState<Deck | null>(null);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [dotText, setDotText] = React.useState<string>("...");

	const { deckName } = useParams<string>();

	const animHandler = React.useRef(0);

	React.useEffect(() => {
		if (!isLoaded) {
			animHandler.current = setInterval(() => {
				setDotText(text => {
					if (text.length === 3) {
						return ".";
					} else {
						return text + ".";
					}
				});
			}, 1000);

			recentDeck
				.openDeck(deckName ?? "", isNewDeck ?? false)
				.then(deck => {
					setDeck(deck);
					setIsLoaded(true);
				});
		} else {
			clearInterval(animHandler.current);
		}
	}, [isLoaded]);

	if (deck === null) {
		if (!isLoaded) {
			return (
				<div className="container">
					<h1 className="display-1 text-center">Loading{dotText}</h1>
					<div className="row justify-content-center">
						<Link to="/" className="btn btn-primary col-5">
							Go to home page
						</Link>
					</div>
				</div>
			);
		} else {
			return <Navigate to="/deck-not-found" replace />;
		}
	} else {
		return <DeckPage deck={deck} />;
	}
}
