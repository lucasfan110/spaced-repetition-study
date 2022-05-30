import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { recentDeck } from "./Deck";
import DeckNotFound from "./DeckNotFound";
import DeckPage from "./DeckPage";
import HomePage from "./HomePage";

function App() {
	const [deckRoutes, setDeckRoutes] = React.useState<JSX.Element[]>([]);

	React.useEffect(() => {
		setDeckRoutes(
			recentDeck.info.map(({ deckName }) => {
				console.log(`mapping ${encodeURI(deckName)}`);
				return (
					<Route
						key={deckName}
						path={`${encodeURI(deckName)}`}
						element={<DeckPage deckName={deckName} />}
					/>
				);
			})
		);
	}, []);

	return (
		<Routes>
			<Route index key="home-page" element={<HomePage />} />
			<Route key="decks" path="decks">
				{deckRoutes}
				<Route key="404" path="*" element={<DeckNotFound />} />
			</Route>
		</Routes>
	);
}

export default App;
