import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import { recentDeck } from "./Deck";
import DeckNotFound from "./DeckNotFound";
import DeckPage from "./DeckPage";
import HomePage from "./HomePage";
import LoadDeck from "./DeckPage/LoadDeck";

export default function App() {
	const [deckRoutes, setDeckRoutes] = React.useState<JSX.Element[]>([]);

	React.useEffect(() => {
		setDeckRoutes(
			recentDeck.info.map(({ deckName }) => {
				console.log(`mapping ${encodeURI(deckName)}`);
				return (
					<Route key={deckName} path={`${encodeURI(deckName)}/*`} />
				);
			})
		);
	}, []);

	return (
		<Routes>
			<Route index key="home-page" element={<HomePage />} />
			<Route key="decks" path="decks">
				{/* {deckRoutes} */}
				<Route
					path=":deckName/*"
					key="deckRoutes"
					element={<LoadDeck />}
				/>
				<Route
					key="404"
					path="*"
					element={<Navigate to="/deck-not-found" replace />}
				/>
			</Route>
			<Route
				key="deck-not-found"
				path="deck-not-found"
				element={<DeckNotFound />}
			/>
		</Routes>
	);
}
